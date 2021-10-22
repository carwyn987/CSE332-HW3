import * as d3 from "https://cdn.skypack.dev/d3@7";

async function createCorrelationMatrix() {

    let chartSizeWithoutMargin = 600;
    let xmarginleft = 90;
    let xmarginright = 20;
    let ymargin = 40
    let width = chartSizeWithoutMargin - xmarginleft+xmarginright;
    let height = chartSizeWithoutMargin - 2*ymargin;

    // Ooo look at me using async/await ... I must be learning from CSE316 haha
    let data = await d3.csv("/data/mds_euclidean.csv");

    data.forEach(function(d) {
        d["0"] = parseInt(d["0"]);
        d["1"] = parseInt(d["1"]);
    });

    let properties = [];
    for(let var1 in data[0]){
        properties.push(var1);
    }


    let variable1 = properties["0"];
    let variable2 = properties["1"];

    // Create the canvas (technically not a canvas but whatever, graphics area)
    let svg = d3.select("#mds")
    .append("svg")
    .attr("width", width + xmarginleft + xmarginright)
    .attr("height", height + 2*ymargin)
    .style("background", "pink")
    .append("g")
    .attr("transform", "translate(" + xmarginleft + "," + ymargin + ")");

    // Set up x and y scales
    let xScale = d3.scaleSqrt()
                    .domain([d3.min(data, function(d){
                        return d[variable1];
                    }), d3.max(data, function(d){
                        return d[variable1];
                    })])
                    .range([0, width]);

    let yScale = d3.scaleSqrt()
                    .domain([d3.min(data, function(d){
                        return d[variable2];
                    }), d3.max(data, function(d){
                        return d[variable2]
                    })])
                    .range([height-ymargin, 0]);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Draw axis
    svg.append("g").attr("transform", "translate(0, " + (height-ymargin) + ")").call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0,15), rotate(60)")
        .style("font-size", "8px")
    svg.append("g").call(yAxis)
        .selectAll("text")
        .style("font-size", "8px")

    // Draw points
    let dots = svg.append("g")
                    .selectAll("dot").data(data);

    dots.enter().append("circle")
                    .attr("cx", function(d){
                        return xScale(d[variable1])
                    })
                    .attr("cy", function(d){
                        return yScale(d[variable2])
                    })
                    .attr("r", 2)
                    .style("fill", "red");

    // Add labels
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height - ymargin + 50)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text("Coordinate 1")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(90)")
        .attr("x", height/2)
        .attr("y", xmarginleft - 10)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text("Coordinate 2")
}

window.onload = () => {
    createCorrelationMatrix();
}