const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//var bcrypt = require('bcrypt'),
const SALT_WORK_FACTOR = 10;

const MemberSchema = mongoose.Schema({
    firstName:{type:String,required: true} ,
    username: {type:String,required: true , min: [6, 'Username should be greater than 6 letters']} ,
    lastName: {type:String,required: true} ,
    password: {type:String,required: true, min: [6, 'Username should be greater than 6 letters']} ,
    memberType: {type:String,required: true, enum: ['student', 'provider'],} ,
    emailID : {type:String,required: true} ,
    mobileNo: {type:Number,required: true, min: [10, 'Mobile Numbers Should be equal to 10 digits']} ,
    collegeName: String,
    currentQualification: String,
    supportingDocuments : { type : Array , "default" : [] },
    resume: String,
    preferredLocation : {type:String,required: true} ,
    providerType : {type:String, enum: ['individual', 'organization'],},
    providerName : String,
    skillsTags: { type : Array , "default" : [] },
    supportingDocumentForSkills: { type : Array , "default" : [] },
}, {
    timestamps: true
});

MemberSchema.pre('save', function(next) {
    var member = this;

    // only hash the password if it has been modified (or is new)
    if (!member.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(member.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            member.password = hash;
            next();
        });
    });
});


MemberSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });


    
};


module.exports = mongoose.model('memberModel', MemberSchema);