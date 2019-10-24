/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

/* margin -> svg & group -> fetch -> within fetch{ scales -> axes -> axes labels -> render bars }*/

/*----------------Margin----------------*/
let margin = { left: 80, right: 20, top: 50, bottom: 100 };

let width = 800 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;
let index = 0;
let t = d3.transition().duration(75);
let year = 1800;

/*----------------Margin----------------*/

/*----------------SVG and Group----------------*/
let g = d3
  .select("#chart-area")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
/*----------------SVG and Group----------------*/

/*-----Scales-----*/
let x = d3
  .scaleLog()
  .base(10)
  .domain([300, 150000])
  .range([0, width]);

let y = d3
  .scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

let area = d3
  .scaleLinear()
  // .domain(d3.extent(yearOne.countries.map(d => d.population)))
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

let continentColor = d3.scaleOrdinal(d3.schemeCategory10);
/*-----Scales-----*/

/*----------------Axes----------------*/
let xAxisCall = d3
  .axisBottom(x)
  .tickValues([500, 5000, 50000])
  .tickFormat(d3.format("$"));
g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxisCall);

let yAxisCall = d3.axisLeft(y);
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
  .text("GDP per capita");

// Y Label
g.append("text")
  .attr("y", -60)
  .attr("x", -(height / 2))
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy");

//Year label
let yearLabel = g
  .append("text")
  .attr("y", height - 10)
  .attr("x", width - 40)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text(year);
/*----------------Labels----------------*/

d3.json("data/data.json").then(data => {
  data.forEach(array => {
    array.countries = array.countries.filter(
      c => c.income !== null && c.life_exp !== null
    );
  });

  console.log({ data });
  let yearOne = data[0];

  /*--------loop--------*/
  d3.interval(() => {
    index < data.length - 1 ? index++ : (index = 0);
    update(data[index].countries);
  }, 100);
  /*--------loop--------*/

  update(data[0].countries);
});

let update = data => {
  /*-----Circles-----*/
  //DATA JOIN
  let circles = g.selectAll("circle").data(data, d => d.population);

  //EXIT
  circles
    .exit()
    .attr("class", "exit")
    .remove();

  //ENTER
  circles
    .enter()
    .append("circle")
    //deconstruct this later;
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("fill", d => continentColor(d.continent))
    .merge(circles)
    .transition(t);

  /*-----Circles-----*/
  yearLabel.text(year + index);
};

// let update = data => {
//   /*-----Circles-----*/
//   //DATA JOIN
//   let circles = g.selectAll("circle").data(data);
//
//   //EXIT
//   circles.exit().remove();
//
//   //UPDATE
//   circles.attr("class", "update").attr("fill", "red");
//
//   circles
//     .enter()
//     .append("circle")
//     //deconstruct this later;
//     .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
//     .attr("cx", d => x(d.income))
//     .attr("cy", d => y(d.life_exp))
//     .attr("fill", d => continentColor(d.country));
//
//   /*-----Circles-----*/
// };
