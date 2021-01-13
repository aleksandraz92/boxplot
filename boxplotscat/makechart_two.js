// set the dimensions and margins of the graph
var margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 40
  },
  width = 1260 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

 // Code from https://www.d3-graph-gallery.com/graph/boxplot_horizontal.html
 //https://codesandbox.io/s/v8l9ro1273
 // https://www.d3-graph-gallery.com/graph/boxplot_show_individual_points.html
 //https://stackoverflow.com/questions/5621249/plot-with-no-collision
 //7http://bl.ocks.org/asielen/92929960988a8935d907e39e60ea8417

// Read the data and compute summary statistics for each assignment
function makeChart(students_data, binSizeParam) {

    var data = students_data;

    var allGroup = d3.map(data, function(d){return(d.name)}).keys() // 

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
      // Boxplot alone
    var boxplot = d3.select("#boxplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
      //Scatter alone
      var scatter = d3.select("#scatter")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //NORMAL ******************************************************************************************

  var normal = d3.select("#normal")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");



  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) {
      return d.Assignments;
    })
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) {
        return g.percentage;
      }).sort(d3.ascending), .25)
      median = d3.quantile(d.map(function(g) {
        return g.percentage;
      }).sort(d3.ascending), .5)
      q3 = d3.quantile(d.map(function(g) {
        return g.percentage;
      }).sort(d3.ascending), .75)
      interQuantileRange = q3 - q1
      min = (q1 - 1.5 * interQuantileRange) < 0 ? 0 : q1 - 1.5 * interQuantileRange 
      max = q3 + 1.5 * interQuantileRange
      return ({
        q1: q1,
        median: median,
        q3: q3,
        interQuantileRange: interQuantileRange,
        min: min,
        max: max
      })
    })
    .entries(data)
 console.log(min)
 console.log(max)


  // Show the X scale
  var x = d3.scaleBand()
    .range([0, width])
    .domain(["Assignment_1", "Assignment_2", "Assignment_3", "Assignment_4"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
         
     // Boxplot alone
    boxplot.append("g")   // [NOVi]
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
     // Scatter alone
    scatter.append("g")  // [NOVi]
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

      //NORMAL ******************************************************************************************
      normal.append("g")  // [NOVi]
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))
   // Boxplot alone
  boxplot.append("g").call(d3.axisLeft(y)) // [NOVi]
   // Scatter alone
  scatter.append("g").call(d3.axisLeft(y)) // [NOVi]
      
      //NORMAL ******************************************************************************************
      normal.append("g").call(d3.axisLeft(y)) // [NOVi]

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return (x(d.key))
    })
    .attr("x2", function(d) {
      return (x(d.key))
    })
    .attr("y1", function(d) {
      return (y(d.value.min))
    })
    .attr("y2", function(d) {
      return (y(d.value.max))
    })
    .attr("stroke", "black")
    .style("width", 40)

     // Boxplot alone
    boxplot //NOVI
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return (x(d.key))
    })
    .attr("x2", function(d) {
      return (x(d.key))
    })
    .attr("y1", function(d) {
      return (y(d.value.min))
    })
    .attr("y2", function(d) {
      return (y(d.value.max))
    })
    .attr("stroke", "black")
    .style("width", 40)


  // Rectangle for the main box
  var boxWidth = binSizeParam*22;
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return (x(d.key) - boxWidth / 2)
    })
    .attr("y", function(d) {
      return (y(d.value.q3))
    })
    .attr("height", function(d) {
      return (y(d.value.q1) - y(d.value.q3))
    })
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", function(d){ return myColor(d.key)})
    .style('opacity', 0.6)
    
     // Boxplot alone
    boxplot // [NOVI]
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return (x(d.key) - boxWidth / 2)
    })
    .attr("y", function(d) {
      return (y(d.value.q3))
    })
    .attr("height", function(d) {
      return (y(d.value.q1) - y(d.value.q3))
    })
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", function(d){ return myColor(d.key)})
    .style('opacity', 0.6)

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return (x(d.key) - boxWidth / 2)
    })
    .attr("x2", function(d) {
      return (x(d.key) + boxWidth / 2)
    })
    .attr("y1", function(d) {
      return (y(d.value.median))
    })
    .attr("y2", function(d) {
      return (y(d.value.median))
    })
    .attr("stroke", "black")
    .style("width", 80)


    // Boxplot alone
   boxplot
   .selectAll("medianLines")
   .data(sumstat)
   .enter()
   .append("line")
   .attr("x1", function(d) {
     return (x(d.key) - boxWidth / 2)
   })
   .attr("x2", function(d) {
     return (x(d.key) + boxWidth / 2)
   })
   .attr("y1", function(d) {
     return (y(d.value.median))
   })
   .attr("y2", function(d) {
     return (y(d.value.median))
   })
   .attr("stroke", "black")
   .style("width", 80)

      //NORMAL ******************************************************************************************
      normal
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function(d) {
        return (x(d.key))
      })
      .attr("x2", function(d) {
        return (x(d.key))
      })
      .attr("y1", function(d) {
        return (y(d.value.min))
      })
      .attr("y2", function(d) {
        return (y(d.value.max))
      })
      .attr("stroke", "black")
      .style("width", 40)

      normal
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return (x(d.key) - boxWidth / 2)
      })
      .attr("y", function(d) {
        return (y(d.value.q3))
      })
      .attr("height", function(d) {
        return (y(d.value.q1) - y(d.value.q3))
      })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", function(d){ return myColor(d.key)})
      .style('opacity', 0.6) 

      normal
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return (x(d.key) - boxWidth / 2)
    })
    .attr("x2", function(d) {
      return (x(d.key) + boxWidth / 2)
    })
    .attr("y1", function(d) {
      return (y(d.value.median))
    })
    .attr("y2", function(d) {
      return (y(d.value.median))
    })
    .attr("stroke", "black")
    .style("width", 80)














    
  // create a tooltip
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("font-size", "16px")
  
  // Three functions that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 1)
    tooltip.html("<span style='color:grey'>Student: </span>" + d.name 
            + "<br> <span style='color:grey'>Assignment: </span>" + d.Assignments  // span slicno divu -html element
            + "<br> <span style='color:grey'>Percentage: </span>" + d.percentage)
            .style("left", (d3.mouse(this)[0]+60) + "px") // x pozicija misa koja odredjuje poziciju tooltipa
            .style("top", (d3.mouse(this)[1]+30) + "px") // y pozicija misa 
   
            
    var colored = d3.selectAll('.point[data-studentname="' + d.name + '"]').attr('fill', 'black');
    colored.attr('fill', function(d){ return myColor(d.name) })
  }
  var mousemove = function(d) { // kretanje kroz kruzic
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)

    var colored = d3.selectAll('.point[data-studentname="' + d.name + '"]').attr('fill', 'black');
    colored.attr('fill', 'white')
  }


  // ********************************************************** //
  // Set r of a circle
  var r = binSizeParam*2;
  var yScale = y.copy()
    .range([Math.floor(y.range()[0] / r), 0])
    .interpolate(d3.interpolateRound)   //Returns an interpolator between the two numbers a and b;
                                       // the interpolator is similar to interpolateNumber,
                                      // except it will round the resulting value to the nearest integer.
    .domain(y.domain());
  

  
  // inizijalizacija da mi redovi budu prazni i onda sa ovom p ubacuje vrednosti u taj array 
  var newA = {};
  data.forEach(function(d,i) {
    var yBin = yScale(d.percentage);
    if (!newA[d.Assignments]){
      newA[d.Assignments] = {};
    }
    if (!newA[d.Assignments][yBin]){
      newA[d.Assignments][yBin] = [];
    }
    newA[d.Assignments][yBin].push({
      cy: yScale(d.percentage) * r,
      cx: x(d.Assignments),
      name: d.name,
      percentage: d.percentage,
      Assignments: d.Assignments
    });
  });
  
  
  if(!normal._groups[0][0]){
    for (var x in newA){
      for (var row in newA[x]) {
        var array = newA[x][row], 
            midPoint = array[0].cx, 
            positionFormula = midPoint - (((array.length / 2) * r) - r/2); 
          array.forEach(function(d,i){
          d.cx = positionFormula + (r * i); // x 
        });
      }
    }
  } else {
    for (var x in newA){
      for (var row in newA[x]) {
        var array = newA[x][row], 
        midPoint = array[0].cx, 
        positionFormula = midPoint - (boxWidth / 2); 

            array.forEach(function(d,i){
          d.cx = positionFormula + (r * i); 
        });
      }
    }
  }

  var posData = Object.values(newA)
                  .map(function(d){return Object.values(d)})
                  .flat(2);

   var line = svg
    .append('g')
    .append("path")
    .datum(posData.filter(function(d){return d.name==allGroup[0]}))
    .attr("d", d3.line()
        .x(function(d) { return d.cx })
        .y(function(d) { return y(+d.percentage) })
    )
    .attr("stroke", function(d){ return myColor("valueA") })
    .style("stroke-width", 0)
    .style("fill", "none")

    
  // Create data points
  svg.selectAll("points")
    .data(posData)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return d.cx;
    })
    .attr("cy", function(d) {
      return d.cy;
    })
    .attr("r", binSizeParam)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr('class', 'point')
    .attr('data-studentname', function(d){
        return(d.name)
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  
  //NOVI

  scatter.selectAll("points")
  .data(posData)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return d.cx;
  })
  .attr("cy", function(d) {
    return d.cy;
  })
  .attr("r", binSizeParam)
  .attr("fill", "white")
  .attr("stroke", "black")
  .attr('class', 'point')
  .attr('data-studentname', function(d){
      return(d.name)
  })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)

  // ********************************************************** //
  // ********************************************************** //
  // ********************************************************** //
  // ********************************************************** //
  // ********************************************************** //
  // ********************************************************** //
  // ********************************************************** //

  // write line on circle click
   d3.selectAll(".point").on("click", function(d) {
       var selectedOption = d3.select(this).attr("data-studentname")
       writeLine(selectedOption);
   })
   function writeLine(student_name) {
    var dataFilter = posData.filter(function(d){return d.name==student_name})
    line.datum(dataFilter)
      .transition()
      .duration(500)
      .attr("d", d3.line()
        .x(function(d) { return d.cx })
        .y(function(d) { return d.cy })
      )
      .style("stroke-width", 4)
      .attr("stroke", function(d){ return myColor(student_name) })
  }




  normal.selectAll("points")
  .data(posData)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return d.cx;
  })
  .attr("cy", function(d) {
    return d.cy;
  })
  .attr("r", binSizeParam)
  .attr("fill", "white")
  .attr("stroke", "black")
  .attr('class', 'point')
  .attr('data-studentname', function(d){
      return(d.name)
  })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)

}