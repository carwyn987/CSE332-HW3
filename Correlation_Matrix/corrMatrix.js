import * as d3 from "https://cdn.skypack.dev/d3@7";

function replaceWhiteSpaceAsNewLine(str) {
    return str.replace(" ", "\n");
}

async function createCorrelationMatrix() {

    let chartSizeWithoutMargin = 800;
    let margin = 70;
    let width = chartSizeWithoutMargin - 2*margin;
    let height = chartSizeWithoutMargin - 2*margin;

    // Create the canvas (technically not a canvas but whatever, graphics area)
    let svg = d3.select("#correlationMatrix")
        .append("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    // Ooo look at me using async/await ... I must be learning from CSE316 haha
    let data = await d3.csv("./data/corrMatrix.csv");

    let reformattedData = [];
    for(const obj in data){
        for(const property in data[obj]){
            if(data[obj][""] === undefined || data[obj][""] === null){
                continue;
            }
            if(property != ""){
                reformattedData.push({
                    x: data[obj][""],
                    y: property,
                    value: data[obj][property]
                })
            }
        }
    }
    console.log(reformattedData);

    // Get X axis domain
    let domain = new Set(reformattedData.map(function(d) { return d.x }));
    domain = Array.from(domain)
    let num = Math.sqrt(reformattedData.length)

    // Color gradient
    let colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#B22222", "#fff", "#000080"]);

    // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
    let size = d3.scaleSqrt()
        .domain([-1, 1])
        .range([0, 7]);

    // X scale
    let x = d3.scalePoint()
        .range([0, width])
        .domain(domain)

    // Y scale
    let y = d3.scalePoint()
        .range([0, height])
        .domain(domain)

    // Create segment for each label/data in correlation matrix
    let cor = svg.selectAll(".cor")
        .data(reformattedData)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

    cor.filter(function(d){
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            return xpos <= ypos;
        })
        .append("text")
        .attr("y", 5)
        .attr("font-size", 9)
        .text(function(d) {
            if (d.x === d.y) {
                return d.x;
            } else {
                return parseFloat(d.value).toFixed(2);
            }
        })
        .style("text-align", "left")
        .style("fill", function(d){
            if (d.x === d.y) {
            return "#000";
            } else {
            return colorScale(d.value);
            }
        });


    // Up right part: add circles
    cor.filter(function(d){
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            return xpos > ypos;
        })
        .append("circle")
        .attr("r", function(d){ return size(Math.abs(d.value)) })
        .style("fill", function(d){
            if (d.x === d.y) {
            return "#000";
            } else {
            return colorScale(d.value);
            }
        })
}

window.onload = () => {
    createCorrelationMatrix();
}