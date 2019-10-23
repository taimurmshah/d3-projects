/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

//setting the margin. what's the reason for this again?
//the teacher set the margin values differently. i've commented out my starting code, and included HIS margin code.
// let margin = { left: 100, right: 10, top: 10, bottom: 150 };
let margin = { left: 80, right: 20, top: 50, bottom: 100 };

//what is the reason for these?
let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let g = d3
  .select("#chart-area")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .append("g")
  // this line below moves the graph to the middle of the svg... gotta review this shit.
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/*----------------Fetch----------------*/
d3.json("data/revenues.json").then(data => {
  data.forEach(d => {
    d.revenue = parseInt(d.revenue);
    d.profit = parseInt(d.profit);
  });

  console.log({ data });

  /*----------------Scales----------------*/

  //returns an object with useful functions
  //domain and range for bar widths
  let x = d3
    .scaleBand()
    .domain(data.map(d => d.month)) //names of the months into an array for each tick
    .range([0, width]) //this helps d3 calculate distance between ticks, as well as thickness of bars
    .padding(0.2);

  //domain and range for bar heights
  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([height, 0]);
  /*----------------Scales----------------*/

  /*----------------Axes----------------*/
  let xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis") //are these classes built into d3?
    //d3.axisBottom specifies how the text will be displayed relative to the axis. it does not
    //take care of the transformations!
    .attr("transform", `translate(0, ${height})`)
    //this method below feeds in all the relevant data and renders the axis
    .call(xAxisCall)
    //all methods chained below do shit to the text
    .selectAll("text")
    .attr("y", "20")
    // .attr("x", "-5")
    .attr("font-size", "15");
  // .attr("text-anchor", "end")
  // .attr("transform", "rotate(-30)");

  let yAxisCall = d3.axisLeft(y).tickFormat(d => "$" + d);
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);
  /*----------------Axes----------------*/

  /*----------------Labels----------------*/
  // X Label
  g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

  // Y Label
  g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");
  /*----------------Labels----------------*/

  //don't know what this does.
  let bars = g.selectAll("rect").data(data);

  // bars
  //   .enter()
  // .append("rect")
  // .attr("y", d => {});

  bars
    .enter()
    .append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", d => x(d.month))
    .attr("height", d => {
      return height - y(d.revenue);
    })
    .attr("width", x.bandwidth)
    .attr("fill", "grey");
});
/*----------------Fetch----------------*/
