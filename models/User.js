const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		accepted:{
			type:String,
			default:"Not Accepted"
		},
		organisation:{
			type:String,
			required:true
		},
		
		userName: {
			type: String,
			required: true
		},
		email: { 
			type: String, 
			required: true, 
			unique: true 
		},
		password: { 
			type: String, 
			required: true 
		},
		description: { 
			type: String 
		},
		phoneNo: { 
			type: Number,
			default:null
		},
		gender:{
			type:String
		},
		qualification:{
			type:String
		},
		cgpa:{
			type:Number
		},
		prevWork:{
			type:String
		},
		dob:{
			type:String
		},
		
		lookingForJob:{
			type:String,
			default:"Yes"
		},
		profileImage:{
			type:String
		},
		resume:{
			type:String
		}
	}
)
 
const User = mongoose.model('user', UserSchema);
module.exports = User;