const mongoose = require('mongoose')

const NoticeSchema = new mongoose.Schema(
	{
		title:{
			type:String,
			required:true	
		},
        description:{
            type:String,
			required:true
        }
	}
)
 
const Notice = mongoose.model('notice', NoticeSchema);
module.exports = Notice;