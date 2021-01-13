// Dimensions
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// SVG
var svg = d3.select("#box_pl")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read data
var students_results = [];
var assignment_results = [];
d3.csv("/data/students_group.csv", function(error, csv) {
    // get from csv
    for (var i = 0; i < csv.length; i++) {
        var assignment_1_procentage = csv[i]['Assignment 1 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_2_procentage = csv[i]['Assignment 2 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_3_procentage = csv[i]['Assignment 3 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_4_procentage = csv[i]['Assignment 4 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        // store it
        students_results.push({
            name:  csv[i].Name, 
            Assignment_1: Number(assignment_1_procentage),
            Assignment_2: Number(assignment_2_procentage),
            Assignment_3: Number(assignment_3_procentage),
            Assignment_4: Number(assignment_4_procentage)
        });
    }
    
    // Get procentage marks from each assignment
    for (var y = 0; y < students_results.length; y++) { 
        assignment_results.push({
            name:  students_results[y].name, 
            percentage: students_results[y].Assignment_1,
            Assignments: Object.keys(students_results[y])[1]
        });
    }
    for (var y = 0; y < students_results.length; y++) { 
        assignment_results.push({
            name:  students_results[y].name, 
            percentage: students_results[y].Assignment_2,
            Assignments: Object.keys(students_results[y])[2]
        });
    }
    for (var y = 0; y < students_results.length; y++) { 
        assignment_results.push({
            name:  students_results[y].name, 
            percentage: students_results[y].Assignment_3,
            Assignments: Object.keys(students_results[y])[3]
        });
    }
    for (var y = 0; y < students_results.length; y++) { 
        assignment_results.push({
            name:  students_results[y].name, 
            percentage: students_results[y].Assignment_4,
            Assignments: Object.keys(students_results[y])[4]
        });
    }
    printResults(assignment_results)
});

function printResults(assignment_results) {

    var sumstat = d3.nest()
    .key(function(d) { return d.Assignments;})
    .rollup(function(d) {
        q1 = d3.quantile(d.map(function(g) { return g.percentage;}).sort(d3.ascending),.25)
        median = d3.quantile(d.map(function(g) { return g.percentage;}).sort(d3.ascending),.5)
        q3 = d3.quantile(d.map(function(g) { return g.percentage;}).sort(d3.ascending),.75)
        interQuantileRange = q3 - q1
        min = q1 - 1.5 * interQuantileRange
        max = q3 + 1.5 * interQuantileRange
        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    }).entries(assignment_results)

// Y scale
var y = d3.scaleLinear()
.domain([0,100])
.range([height, 0])
svg.append("g").call(d3.axisLeft(y))

// Show the X scale
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["Assignment_1", "Assignment_2", "Assignment_3", "Assignment_4"])
    .paddingInner(1)
    .paddingOuter(.5)
svg.append("g")
    .attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

// Main vertical line
svg.selectAll("verticalLines")
    .data(sumstat)
    .enter()
    .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

// Main box
var boxWidth = 100
svg.selectAll("medians")
   .data(sumstat)
   .enter()
   .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){
            return(y(d.value.q1)-y(d.value.q3));
        })
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "whitesmoke")

 // Show the median
 svg.selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)


var jitterWidth = 50
svg.selectAll("binPoints")
  .data(assignment_results)
  .enter()
  .append("circle")
    .attr("cx", function(d){
        return(x(d.Assignments) - jitterWidth/2 + Math.random()*jitterWidth + 15);
    })
    .attr("cy", function(d){
        return(y(d.percentage));
    })
    .attr("r", 4)
    .style("fill", "white")
    .attr("stroke", "black")

}
