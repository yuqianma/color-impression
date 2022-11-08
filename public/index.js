import { ClockChart } from "./clock-chart.js";
import { liveCapture } from "./live-capture.js";

const svgDom = document.getElementById("clock-chart");
const cameraVideo = document.getElementById("camera-video");
const focusedColorEl = document.getElementById("focused-color");

// like a router, simply switch between views
function switchView(name) {
	const views = document.getElementsByClassName("view");
	for (let i = 0; i < views.length; i++) {
		views[i].classList.remove("active");
	}
	document.getElementById(name).classList.add("active");
}

// -------------------------- chart ----------------------------------
const chart = new ClockChart(svgDom, []);

// ----------------------- interaction events ------------------------

chart.takeColorHandler = () => {
	switchView('camera-eyedropper');
	liveCapture(cameraVideo, focusedColorEl);
}

// since doms are just hidden, we can add event listeners to them
focusedColorEl.addEventListener('click', () => {
	switchView('color-clock');
	// Though we should get the color directly from the function,
	// using the background color of the element is a quick hack.
	const color = focusedColorEl.style.backgroundColor;
	console.log(`captured color: ${color}`);
	const data = { color, time: new Date() };
	chart.addData(data);
	// TODO: sync data to other clients if we want
});

// ------------------------ data update logic ------------------------

// TODO: init data from server
(async () =>{
	const res = await fetch('sample-data.json');
	const json = await res.json();
	chart.updateData(json.data1);
})();

// TODO: listen on live update from server if we want

// --------------------------- for debug -----------------------------
window.chart = chart;
// chart.updateData(data)
