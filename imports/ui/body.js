import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
 
import './body.html';
import './task.js';
import { Tasks } from '../api/tasks.js';
import { Images } from '../api/canvas2svg.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
}); 

Template.body.helpers({
	tasks() {
		// Show newest tasks at the top
    	return Tasks.find({}, { sort: { createdAt: -1 } });
      // return Tasks.find();
	},
});

var canvas = null;
var drawingModeEl = null,
    drawingOptionsEl = null,
    drawingShadowColorEl = null,
    drawingLineWidthEl = null,
    drawingShadowWidth = null,
    drawingShadowOffset = null,
    clearEl = null;

var pattern = null;


Template.body.onRendered(function(){
  canvas = this.__canvas = new fabric.Canvas('c', {
  isDrawingMode: true



});

fabric.Object.prototype.transparentCorners = false;


      drawingModeEl = document.getElementById('drawing-mode'),
      drawingOptionsEl = document.getElementById('drawing-mode-options'),
      drawingColorEl = document.getElementById('drawing-color'),
      drawingShadowColorEl = document.getElementById('drawing-shadow-color'),
      drawingLineWidthEl = document.getElementById('drawing-line-width'),
      drawingShadowWidth = document.getElementById('drawing-shadow-width'),
      drawingShadowOffset = document.getElementById('drawing-shadow-offset'),
      clearEl = document.getElementById('clear-canvas');

});

Template.body.events({

  'click #save-drawing'(event) {
    // convert canvas to SVG
    var svg = canvas.toSVG();
    //console.log(svg);


    // TODO - save SVG to collection
    Images.insert({svg});
    console.log(Images.find())


    // TODO - all subscribers to above (pub) see SVG (note that SVG can be rendered directly)
  },

  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault(); 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    Tasks.insert({
      text,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date(), // current time
    });
    // Clear form
    target.text.value = '';
  },

  'click #clear-canvas'(){
    canvas.clear();
  },

});

