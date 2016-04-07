import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';


export const Images = new Mongo.Collection('images');
if (Meteor.isServer) {
	Meteor.publish('data',function() {
		return Images.find({}, { limit: 1, sort: { createdAt: -1 }})
	})

}