import Konva from 'konva';

const container = document.getElementById('toppings-container');
if(!container) throw new Error('Missing #toppings-container');

const stage = new Konva.Stage({
	container,
	width:		container.clientWidth,
	height:		container.clientHeight
});

const layer = new Konva.Layer();


/******************************************************************************
 * Pepperoni Topping Code
 *****************************************************************************/

const pepperoniTopping = new Konva.Circle({
	x: 100,
	y: 250,
	radius: 30,
	fill: 'red',
	stroke: 'black',
	strokeWidth: 2,
	draggable: true,
});
pepperoniTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
pepperoniTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});


/******************************************************************************
 * Onions Topping Code
 *****************************************************************************/

const onionsTopping = new Konva.Group({
	x: 220,
	y: 250,
	rotation: -15,
	draggable: true,
});
onionsTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 32,
	radiusY: 22,
	fill: '#e7a2bc',
	stroke: '#c66f96',
	strokeWidth: 2,
}));
onionsTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 24,
	radiusY: 14,
	fill: '#fffdf4', // match the background behind the onion
	stroke: '#f6d5e1',
	strokeWidth: 2,
}));
onionsTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
onionsTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});


/******************************************************************************
 * Olives Topping Code
 *****************************************************************************/

const olivesTopping = new Konva.Group({
	x: 340,
	y: 250,
	rotation: -155,
	draggable: true,
});
olivesTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 35,
	radiusY: 29,
	fill: '#665f4d',
	stroke: '#black',
	strokeWidth: 2,
}));
olivesTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 24,
	radiusY: 17,
	fill: '#fffdf4',
	stroke: '#6b5d3d',
	strokeWidth: 5,
}));
olivesTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
olivesTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});


/******************************************************************************
 * Basil Topping Code
 *****************************************************************************/

const basilTopping = new Konva.Group({
	x: 460,
	y: 250,
	draggable: true,
});
basilTopping.add(new Konva.Line({
	points: [
		-35,   0,
		-25,  -8,
		-10, -13,
		  8, -14,
		 25,  -8,
		 35,   0,
		 25,   8,
		  8,  14,
		-10,  13,
		-25,   8,
	],
	closed: true,
	tension: 0.25,
	fill: '#58a83f',
	stroke: '#286b31',
	strokeWidth: 2,
	lineJoin: 'round',
}));
basilTopping.add(new Konva.Line({
	points: [
		-32, 0,
		-12, 1,
		  8, 0,
		 32, 0,
	],
	tension: 0.3,
	stroke: '#286b31',
	strokeWidth: 1.5,
	lineCap: 'round',
}));
basilTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
basilTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});


/******************************************************************************
 * Add layers and present to stage
 *****************************************************************************/

layer.add(pepperoniTopping);
layer.add(onionsTopping);
layer.add(olivesTopping);
layer.add(basilTopping);

stage.add(layer);
