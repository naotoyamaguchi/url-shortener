const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CounterSchema = schema({
	_id: {type: String, required: true},
	seq: {type: Number, default: 0}
});

var counter = mongoose.model('counter', CounterSchema);

var urlSchema = new schema({
	_id: {type: Number, index: true},
	long_url: String,
	created_at: Date
});




//this saves the url and increments the _id accordingly using an increment. MongoDB does not do it automatically.
urlSchema.pre('save', function(next){
	var doc = this;
	// find url_count and increment by 1
	counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter){
		if(error){
			return next(error);
		}
		//set the _id of the urls collection to the incremented value of the counter
		doc._id = counter.seq;
		doc.created_at = new Date();
		next();
	});
});





var Url = mongoose.model('Url', urlSchema);

module.exports = Url;