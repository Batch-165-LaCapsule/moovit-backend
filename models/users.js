//importation du module "mongoose"
const mongoose = require('mongoose');

//Schema du model de la Souscollection "Stats" contenus dans la collection "Users"
const statSchema = mongoose.Schema(
{
   nbSessions:Number,
   totalTime:Number,
   lastConnection:Date,
   nbEtaps:Number,
   creationDate:Date,
   lastModified:Date,
});

//Schema du model de la Souscollection "form" contenus dans la collection "Users"

const formSchema= mongoose.Schema(
{
    reason:String,
    dayTime:String,

})

//Schema du model de la Collection "Users"
const userSchema = mongoose.Schema(
{

    admin:{type:Boolean,default:false},
    token:{type:String, require:true},
    email:{type:String, require:true},
    password:{type:String, require:true},
    username:{type:String, require:true},
    name:{type:String, require:true},
    gender:String,
    age:Number,
    //déclaration du type geojson point
    coordinate:{name:String,location:{type:{type:String},coordinates:{type:[Number]}}},
    city:String,
    notificationActive:Boolean,
    photoUrl:String,
    level:{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' },
    xp:{type:Number, default:0},
    isSocialConnected:Boolean,
    sportPlayed:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' }], require:true},
    form:{type:formSchema,require:true},
    stats:statSchema,
    medals:{type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'medals' }], default:[]},
   

 
});



//exportation du model "User"
const User = mongoose.model('users', userSchema);
module.exports = User;