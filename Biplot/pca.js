import * as d3 from "https://cdn.skypack.dev/d3@7";

async function createPCAPlot() {
    // PCA Biplot

    let data = await d3.csv("/data/pc.csv");
    let variable1 = "principal component 1";
    let variable2 = "principal component 2";

    data.forEach(function(d) {
        d[variable1] = parseFloat(d[variable1]);
        d[variable2] = parseFloat(d[variable2]);
    });

    let chartSizeWithoutMargin = 800;
    let xmarginleft = 90;
    let xmarginright = 20;
    let ymargin = 40
    let width = chartSizeWithoutMargin - xmarginleft+xmarginright;
    let height = chartSizeWithoutMargin - 2*ymargin;
    
    // Create the canvas (technically not a canvas but whatever, graphics area)
    let svg = d3.select("#pcaPlot")
        .append("svg")
        .attr("width", width + xmarginleft + xmarginright)
        .attr("height", height + 2*ymargin)
        .style("background", "ivory")
        .append("g")
        .attr("transform", "translate(" + xmarginleft + "," + ymargin + ")");

    // Set up x and y scales
    let xScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d){
                        return d[variable1];
                    }), d3.max(data, function(d){
                        return d[variable1];
                    })])
                    .range([0, width]);

    let yScale = d3.scaleLinear()
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
    svg.append("g").call(yAxis)
        .selectAll("text")

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

    // Add eigenvectors:

    let coeff = [[-0.11439946,  0.69932716],
                [ 0.39582068,  0.074763  ],
                [ 0.38711403,  0.06696394],
                [ 0.3821598 ,  0.06955135],
                [ 0.32818142, -0.00138519],
                [ 0.3873315 ,  0.08940239],
                [ 0.38999234,  0.09321604],
                [ 0.32883445,  0.04122325],
                [-0.12778565,  0.68098679],
                [ 0.00716532,  0.11791593]]

    let colors = ["red", "maroon", "orange", "yellow", "lightgreen", "darkgreen", "aquamarine", "blue", "purple", "black"]
    let vars = ["AveragePrice", "Total Volume", "4046", "4225", "4770", "Total Bags", "Small Bags", "Large Bags", "XLarge Bags", "Type", "Production"]

    for(let i = 0; i<coeff.length; i++){

        let tempData = coeff[i];
        let scalerVal = 5;

        svg.append("marker")
            .attr("id", "arrow" + i)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("refX", 0)
            .attr("refY", 3)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0 L0,6 L9,3 z")
            .style("stroke", colors[i])
            .style("fill", colors[i]);

        svg.append("line")
                .attr("x1", xScale(0))
                .attr("y1", yScale(0))
                .attr("x2", xScale(scalerVal*tempData[0]))
                .attr("y2", yScale(scalerVal*tempData[1]))
                .style("fill", colors[i])
                .style("stroke", colors[i])
                .attr("marker-end", "url(#arrow" + i + ")");
    
    }

    // Add labels
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + 60)
        .attr("y", height - ymargin + 50)
        .text(variable1)

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(90)")
        .attr("x", height/2 + 50)
        .attr("y", xmarginleft - 40)
        .text(variable2)

    // TITLE
    svg.append('text')
        .attr("x", 3*width/8)
        .attr("y", 0-10)
        .text("PCA Biplot")
        .style("font-weight", "bold")

    let legend = document.getElementById("legend");
    for(let i = 0; i<10; i++){

        let h = document.createElement("H3")
        let t = document.createTextNode(vars[i]);
        h.style.color = colors[i];
        h.appendChild(t);
        legend.appendChild(h);
    }

}

window.onload = () => {
    createPCAPlot();
}