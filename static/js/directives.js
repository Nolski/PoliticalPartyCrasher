"use strict";

var moneyGateDirectives = angular.module('moneyGateDirectives', []);

moneyGateDirectives.directive('miniChart', ['$parse', function ($parse) {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<div class="graph"></div>', //TODO: replace this and generate id
        scope: { legislator: '=chartData' },
        link: function (scope, element, attrs) {
            var chart = d3.select(element[0]),
                margin = {top: 40, right: 20, bottom: 90, left: 40},
                height = 260 - margin.top - margin.bottom,
                divisions = 3,
                urlObj = { host:  "getContributionsForLegislator",
                    query: {
                        recipientName: scope.legislator.first_name + ' '
                            + scope.legislator.last_name,
                        amountMin: 0
                    }
                };

            drawAxis(chart, margin, height, divisions, scope.legislator);

            var destination = url.format(urlObj);

            d3.json("/api/" + destination.substring(1, destination.length),
                function (error, json) {
                    if(error) {
                        return console.warn(error.stack);
                    } else {
                        drawBoxes( scope.legislator, prepareData(json), height );
                    }
                }
            );

        }
    }
}]);

function drawAxis(chart, margin, height, divisions, legislator) {
            // Append base graph svg to append to
            var svg = chart
                .append("svg")
                    .attr("id", "svg-" + legislator.first_name)
                    .attr("height", height)
                .append("g");


            var width = parseInt(
                chart.style("width")
                    .substring(0, chart.style("width").length - 2)
                );
            svg = chart.select("#svg-" + legislator.first_name)
                .attr("width", width);

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);
            var y = d3.scale.linear()
                .range([height, 0]);


            // Create axis based upon x and y length
            var xAxis = d3.svg.axis()
                .scale(x)
                .tickValues(["Jan", "Feb", "Mar", "Apr", "May", "June",
                            "July", "Aug", "Sept", "Oct", "Nov", "Dec"])
                .orient('bottom');
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')

            // Draw x axis
            svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
            // Draw y axis
            svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Frequency");

}

// Represents grid or single column in graph
function Grid() {
    this._grid = [ [false, false, false] ];

    this.reset = function () {
        this._grid = [ [false, false, false] ];
    }

    this.isTaken = function (row, col) {
        if(row >= this._grid.length)
            this._grid.push([false, false, false]);

        if(this._grid[row][col])
            return true;
        return false
    };

    this.checkNeighbors = function (startRow, startCol, size) {
        var neighbors = [];
        // Start at each column and search up until you hit size
        for(var col = startCol; col < startCol + size; col++) {
            for(var row = startRow; row < startRow + size; row++) {
                // Make sure none of these spots are already taken
                if(this.isTaken(row, col))
                    return false;
                neighbors.push([row, col]);
            }
        }

        for(var i = 0; i < neighbors.length; i++)
            this._grid[ neighbors[i][0] ][ neighbors[i][1] ] = true;

        return true;
    }
}

// Draw svg contribtuion boxes
function drawBoxes(legislator,data, height) {
    var barWidth = 49;

    d3.select("#svg-" + legislator.first_name)
        .selectAll(".contriubtion")
            .data(data)
        .enter().append("rect")
            .attr("class", "contribution")
            .attr("x", function(d) {
                return (d.x * barWidth) + ( (d.start[1] / 3) * barWidth) + (1);
            })
            .attr("width", function(d) {
                return (d.size / 3 * barWidth) - 1;
            })
            .attr("y", function(d) {
                var chunkHeight = height / d.maxHeight;
                console.log(d.maxHeight);

                return height - ( (chunkHeight * d.start[0]) + // Start Position
                                  ((height / d.maxHeight) * d.size)) // chunk size * block
                                  + 2;
            })
            .attr("height", function(d) {
                var chunkHeight = height / d.maxHeight;

                return ( chunkHeight * d.size ) - 2;
            })
}

// Comparitor function for sorting contributions by date
function compareDates(contribution1, contribution2) {
    var momentDate1 = moment(contribution1.date, "YYYY-MM-DD"),
        momentDate2 = moment(contribution2.date, "YYYY-MM-DD");

    if(momentDate1.get('month') < momentDate2.get('month')) {
        return -1;
    } else if (momentDate1.get('month') > momentDate2.get('month')) {
        return 1;
    }
    return 0;
}

function prepareData(data) {
    var grid = new Grid(),
        WIDTH = 3,
        dates = {},
        maxHeight = 0,
        currentDate = null;

    data.sort(compareDates);

    data.forEach(function (contribution) {
        var row = 0,
            spaceNotFound = true;

        if(moment(contribution.date).get('month') != moment(currentDate).get('month')) {
            console.log(grid._grid);
            grid.reset();
            currentDate = contribution.date;
        }

        if (contribution.amount <= 3000) {
            contribution.size = 1;
        } else if (contribution.amount <= 8000) {
            contribution.size = 2;
        } else {
            contribution.size = 3;
        }

        // Keep going until we have found a spot in the grid that fits
        while(spaceNotFound) {

            // Start at left side. Don't go out of bounds
            for(var col = 0; col <= WIDTH - contribution.size; col++) {
                // Check neighbors of current spot
                if(grid.checkNeighbors(row, col, contribution.size)) {
                    contribution.start = [row, col];
                    if(maxHeight < row + contribution.size)
                        maxHeight = row + contribution.size;
                    spaceNotFound = false;
                    break;
                }
            }

            // If no valid spots were found, check next row above
            row++;
        }
    });
    console.log('======================================================')

    var x = -1;


    data.forEach(function (contribution) {
        contribution.maxHeight = maxHeight;

        if(moment(contribution.date).get('month')
           != moment(currentDate).get('month')) {

            currentDate = contribution.date;
            x++;
        }

        contribution.x = x;
    });

    return data;
}
