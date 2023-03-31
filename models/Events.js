const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
	{
		title:{
			type:String,
			required:true	
		},
        description:{
            type:String,
			required:true
        },
        url:{
            type:String,
			required:true
        }
	}
)
 
const Event = mongoose.model('event', EventSchema);
module.exports = Event;