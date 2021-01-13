var chart;

var binSizeParam = 6;
var select_bins = document.getElementById('binSizeOptions');
if(select_bins){
    select_bins.onchange = function(e){
        if (!e)
            var e = window.event;
        binSizeParam = this.options[this.selectedIndex].value;
        document.getElementById('my_dataviz').innerHTML = '';
        passData(assignment_results, (binSizeParam*2));
    }
}

var students_results = [];
var assignment_results = [];
// Read data
d3.csv('data.csv', function(data) {
    for (var i = 0; i < data.length; i++) {
        var assignment_1_procentage = data[i]['Assignment 1 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_2_procentage = data[i]['Assignment 2 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_3_procentage = data[i]['Assignment 3 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");
        var assignment_4_procentage = data[i]['Assignment 4 (Prozentsatz)'].replace(/%/g, '').trim().replace(/-/g, "0.00");

        if (assignment_1_procentage == '0' || assignment_1_procentage == 0) {
            assignment_1_procentage = Math.floor(Math.random() * Math.floor(30));
        }
        if (assignment_2_procentage == '0' || assignment_2_procentage == 0) {
            assignment_2_procentage = Math.floor(Math.random() * Math.floor(40));
        }
        if (assignment_3_procentage == '0' || assignment_3_procentage == 0) {
            assignment_3_procentage = Math.floor(Math.random() * Math.floor(50));
        }
        if (assignment_4_procentage == '0' || assignment_4_procentage == 0) {
            assignment_4_procentage = Math.floor(Math.random() * Math.floor(60));
        }
        // store it
        students_results.push({
            name:  data[i].Name, 
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
    passData(assignment_results, binSizeParam);
    
});

function passData(data, binSizeParam) {
    data.forEach(function (d) {
        d.percentage = +d.percentage;
    });

    chart = makeChart(data, binSizeParam);

}