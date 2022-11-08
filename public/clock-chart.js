// draw the chart by D3.js
// https://observablehq.com/@d3/radial-stacked-bar-chart
// https://observablehq.com/@d3/radial-area-chart

// relative size for svg
const WIDTH = 400;
const HEIGHT = 400;

const margin = 10;
const innerRadius = WIDTH / 5;
const outerRadius = WIDTH / 2 - margin;

// scales
const xScale = d3.scaleLinear()
	.domain([0, 12]) // 12 hours
	.range([- 0.5 * Math.PI, (2 - 0.5) * Math.PI]); // 360 degrees in radians, offset by 90 degrees

const yScale = d3.scaleLinear()
	.domain([0, 60]) // 60 minutes
	.range([innerRadius, outerRadius]);

// axes
const xAxis = g => g
	.attr("text-anchor", "middle")
	.call(g => g.selectAll("g")
		.data(xScale.ticks().slice(1))
		.join("g")
			.attr("transform", d => `
				rotate(${xScale(d) / Math.PI * 180})
				translate(${innerRadius},0)
			`)
			.call(g => g.append("line")
					.attr("x1", 0)
					.attr("x2", outerRadius - innerRadius)
					.attr("stroke", "#ccc"))
			.call(g => g.append("text")
					.attr("transform", d => (xScale(d) + Math.PI) % (2 * Math.PI) < Math.PI
							? "rotate(90)translate(0,16)"
							: "rotate(-90)translate(0,-9)")
					.style("fill",'#ccc')
					.style('font-family', 'sans-serif')
					.style('font-size', 10)
					.text(d => d)))

const yAxis = g => g
	.attr('text-anchor', 'middle')
	.call(g => g.selectAll('g')
		.data(yScale.ticks(2))
		.join('g')
			.attr('fill', 'none')
			.call(g => g.append('circle')
					.style('stroke', '#ccc')
					.style('stroke-opacity', 0.5)
					.attr('r', yScale))
			.call(g => g.append('text')
					.attr('y', d => -yScale(d))
					.attr('dy', '0.35em')
					.style('stroke', '#fff')
					.style('stroke-width', 5)
					.style("fill",'#ccc')
					.text(yScale.tickFormat(6, 's'))
			.clone(true)
					.style('stroke', 'none')))

const SAMPLE_DATA = [
	{ time: '2022-11-08T00:00:00.000Z', color: "#0bd" },
	{ time: '2022-11-08T01:16:00.000Z', color: "#0b9" },
	{ time: '2022-11-08T02:31:00.000Z', color: "#e55" },
	{ time: '2022-11-08T06:45:00.000Z', color: "#e59" },
	{ time: '2022-11-08T11:58:00.000Z', color: "#e99" },
	{ time: '2022-11-08T13:30:00.000Z', color: "#ff0" },
];

const SAMPLE_DATA2 = [
	{ time: '2022-11-08T02:31:00.000Z', color: "#e55" },
	{ time: '2022-11-08T13:30:00.000Z', color: "#ff0" },
	{ time: '2022-11-08T08:58:00.000Z', color: "#0f0" },
]

// for debug
Object.assign(window, { SAMPLE_DATA, SAMPLE_DATA2, })

function convertData(data) {
	return data.map(d => {
		const date = new Date(d.time);
		console.log(`%c${date}`, `background: ${d.color}`);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return {
			...d,
			hours,
			minutes,
		};
	});
}

export class ClockChart {
	width = WIDTH;
	height = HEIGHT;
	colorRadius = 10;
	colorGroup = null;
	data = [];

	constructor(svgDom, data = SAMPLE_DATA) {
		const { width, height, colorRadius } = this;
		// svg canvas
		const svg = d3.select(svgDom)
			.attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
			.style("width", "100%")
			.style("height", "auto")
			.style("font", "10px sans-serif");

		// draw axes
		svg.append("g")
			.call(xAxis);

		svg.append("g")
			.call(yAxis);

		// draw colors
		const colorGroup = svg.append("g");		
		this.colorGroup = colorGroup;

		this.updateData(this.data);

		// add a button
		const buttonGroup = svg.append("g")
		buttonGroup.append("circle")
			.attr("r", 40)
			.attr("fill", "#eee")
			.attr("stroke", "#aaa")
			.attr("stroke-width", 2)
			.attr("cursor", "pointer")

		buttonGroup.append("text")
			.style("pointer-events", "none")
			.attr("text-anchor", "middle")
			.attr("dominant-baseline", "middle")
			.attr("font-size", 10)
			.text("Take Color")
		
		buttonGroup.on("click", () => {
			this.takeColorHandler();
		});
	}

	updateData(data) {
		this.data = data;
		const { colorGroup, colorRadius } = this;

		data = convertData(data);

		colorGroup.selectAll("circle")
			.data(data, d => d.time)
			.join("circle")
			.attr("stroke", d => d.hours >= 12 ? "#aaa" : "#fff") // stroke colors after 12:00
			.attr("stroke-width", 1)
			.attr("fill", d => d.color)
			.attr("r", colorRadius)
			.attr("cx", d => yScale(d.minutes) * Math.cos(xScale(d.hours)))
			.attr("cy", d => yScale(d.minutes) * Math.sin(xScale(d.hours)));
	}

	addData(datum) {
		const data = [...this.data, datum];
		this.updateData(data);
	}

	takeColorHandler() {
		// set by instance user and call by button click
	}
}
