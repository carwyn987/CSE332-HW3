import * as d3 from "https://cdn.skypack.dev/d3@7";

async function pcd() {

    let chartSizeWithoutMargin = 900;
    let xmarginleft = 30;
    let xmarginright = 30;
    let ymargin = 30
    let width = chartSizeWithoutMargin - xmarginleft+xmarginright;
    let height = chartSizeWithoutMargin - 2*ymargin;

    // Ooo look at me using async/await ... I must be learning from CSE316 haha
    let data = await d3.csv("/data/ppdData.csv");

    data.forEach(function(d) {
        d["4046"] = parseInt(d["4046"]);
        d["Total Volume"] = parseInt(d["Total Volume"]);
        d["Total Bags"] = parseInt(d["Total Bags"]);
        d["Small Bags"] = parseInt(d["Small Bags"]);
        d["Large Bags"] = parseInt(d["Large Bags"]);
        d["4225"] = parseInt(d["4225"]);
        d["4770"] = parseInt(d["4770"]);
        d["AveragePrice"] = parseInt(d["AveragePrice"]);
    });


    // Create the canvas (technically not a canvas but whatever, graphics area)
    let svg = d3.select("#ppd")
        .append("svg")
        .attr("width", width + xmarginleft + xmarginright)
        .attr("height", height + 2*ymargin)
        .style("background", "gray")
        .append("g")
        .attr("transform", "translate(" + xmarginleft + "," + ymargin + ")");

    // Make array of property names
    let properties = ["Total Volume", "4046", "Small Bags", "Total Bags","Large Bags","4225","4770","AveragePrice"];

    // Create the scale for each property
    let y = {}
    for(let i = 0; i<8; i++){
        let name = properties[i];
        y[name] = d3.scaleLog()
                    .domain([1, d3.max(data, function(d){
                        return d[name];
                    })])
                    .range([height, 0]);
    }

    // Create the x axis
    let x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(properties)

    function path(d) {
        return d3.line()(properties.map(function(p){
            return [x(p), y[p](d[p])];
        }));
    }

    // Create each data objects path line
    svg.selectAll("Path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "white")
        .style("opacity", 0.8)

    // Axis titles and scales
    svg.selectAll("Axis")
        .data(properties).enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + x(d) + ")";
        })
        .each(function(d) {
            d3.select(this).call(d3.axisLeft().scale(y[d]));
        })
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d){
                return d;
            })
            .style("fill", "black")
            .style("font-weight", "bold")
}

window.onload = () => {
    pcd();
}