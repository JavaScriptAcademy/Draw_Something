import { Mongo } from 'meteor/mongo';
 
export const Answers = new Mongo.Collection('answers');

if (Meteor.isServer) {
	Meteor.publish('answerdata',function() {
		return Answers.find({}, { limit: 1, sort: { createdAt: -1 }})
	})

}

