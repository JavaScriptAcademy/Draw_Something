import { Mongo } from 'meteor/mongo';
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
	Meteor.publish('taskdata',function() {
		return Tasks.find({}, { limit: 5, sort: { createdAt: -1 }})
	})

}


