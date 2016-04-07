import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';
 
Template.task.events({

  'click .delete'() {
    Tasks.remove(this._id);
  },
});