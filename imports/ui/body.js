import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import './body.html';
import './task.js';
import { Tasks } from '../api/tasks.js';
import { Tracker } from 'meteor/tracker'
// import { Users } from '../api/user.js';
import { Answers } from '../api/answer.js';
import { Images } from '../api/canvas2svg.js';
//import session for answer
import { Session } from 'meteor/session'

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('data')
  // setInterval(updateSVG, 50);

}); 

Template.body.helpers({
	tasks() {
		// Show newest tasks at the top
    	return Tasks.find({}, { sort: { createdAt: -1 } });
      // return Tasks.find();
	},
  svg() {
    var x;
    Images.find({},{sort: { createdAt: -1 }}).forEach(function(doc) {
      x = doc.svg
    })
    return x;
  },
});

var canvas = null;
var clearEl = null;

Template.body.onRendered(function(){
  canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
  });
  fabric.Object.prototype.transparentCorners = false;
  clearEl = document.getElementById('clear-canvas');
});

function updateSVG() {
    // convert canvas to SVG
    var svg = canvas.toSVG();
    var a = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
    svg = svg.replace(a, "");
    // save SVG to collection
    Images.insert({
      svg: svg,
      createdAt: new Date(),
    });

    Meteor.subscribe('data')
}

Template.body.events({
    'mouseup canvas'(event) {
      Meteor.setTimeout(updateSVG,1)
    },

  'submit .answerbyuser'(event){
    event.preventDefault(); 
    const answer = event.target.answerbyuser.value;
    Answers.insert({
      'answer':answer,
      createdAt: new Date(),
      });    
    console.log("inserted one record - "+ answer);
    event.target.answerbyuser.value = '';
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

    Meteor.subscribe('answerdata');
    var y;
    Answers.find({},{sort: { createdAt: -1 }}).forEach(function(doc) {
    y = doc.answer;
    })

    console.log(y)

    if(y===text){
       // console.log("win")
     alert(Meteor.user().username+" is the winner!!");
    };
    Meteor.subscribe('taskdata');
   },

  'click #clear-canvas'(event){
    canvas.clear();
    updateSVG();
  },

});

