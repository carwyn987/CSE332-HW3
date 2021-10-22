import * as d3 from "https://cdn.skypack.dev/d3@7";

async function createPCAPlot() {

    // SCREE PLOT
    {
        let chartSizeWithoutMargin = 800;
        let xmarginleft = 90;
        let xmarginright = 20;
        let ymargin = 40
        let width = chartSizeWithoutMargin - xmarginleft+xmarginright;
        let height = chartSizeWithoutMargin - 2*ymargin;

        let scree_plot_data = [{name: "1", value: 0.985},
                                {name: "2", value: 0.008},
                                {name: "3", value: 0.00603},
                                {name: "4", value: 0.001},
                                {name: "5", value: 0.0001218},
                                {name: "6", value: 0.0000004},
                                {name: "7", value: 0},
                                {name: "8", value: 0}
        ]

        
        // Create the canvas (technically not a canvas but whatever, graphics area)
        let svg = d3.select("#pcaPlot")
            .append("svg")
            .attr("width", width + xmarginleft + xmarginright)
            .attr("height", height + 2*ymargin)
            .style("background", "pink")
            .append("g")
            .attr("transform", "translate(" + xmarginleft + "," + ymargin + ")");

        let xScale = d3.scaleBand()
                        .range([0, width])
                        .domain(scree_plot_data.map(function(d){
                            return d.name;
                        }))
                        .padding(0.4);
        
        let yScale = d3.scaleLinear()
                        .range([height, 0])
                        .domain([0,d3.max(scree_plot_data, function(d){
                            return d.value;
                        })])
        
        // Make bottom axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))

        // Make left axis
        svg.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))

        // Draw bars
        svg.selectAll(".bar")
            .data(scree_plot_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.name); })
            .attr("y", function(d) { return yScale(d.value); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d.value); });

        // X AXIS LABEL
        svg.append('text')
            .attr("x", 3*width/8)
            .attr("y", height+ 30)
            .text("Components");

        // Y AXIS LABEL
        svg.append('text')        
            .attr("transform", "rotate(-90)")
            .attr("y", -ymargin/2 - 10)
            .attr("x", -(height/2) - 60)
            .text("Variance Explained");

        // TITLE
        svg.append('text')
            .attr("x", 3*width/8)
            .attr("y", 0-10)
            .text("Scree Plot")
            .style("font-weight", "bold")
    }

    // PCA Plot

    {

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
        let svg = d3.select("#pcaPlot2")
            .append("svg")
            .attr("width", width + xmarginleft + xmarginright)
            .attr("height", height + 2*ymargin)
            .style("background", "ivory")
            .append("g")
            .attr("transform", "translate(" + xmarginleft + "," + ymargin + ")");

        console.log(d3.min(data, function(d){
            return d[variable2];
        }));

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

        svg.append("marker")
            .attr("id", "arrow")
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("refX", 0)
            .attr("refY", 3)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0 L0,6 L9,3 z")

        svg.append("line")
                .attr("x1", xScale(0))
                .attr("y1", yScale(0))
                .attr("x2", xScale(-1))
                .attr("y2", yScale(3.04477366))
                .style("fill", "black")
                .style("stroke", "black")
                .attr("marker-end", "url(#arrow)");

        svg.append("line")
                .attr("x1", xScale(0))
                .attr("y1", yScale(0))
                .attr("x2", xScale(3.04477366))
                .attr("y2", yScale(1))
                .style("fill", "black")
                .style("stroke", "black")
                .attr("marker-end", "url(#arrow)");

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
            .text("PCA Plot")
            .style("font-weight", "bold")

        return svg.node();

    }

}

window.onload = () => {
    createPCAPlot();
}