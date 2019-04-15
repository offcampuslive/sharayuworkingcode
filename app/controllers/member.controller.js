const memberModel = require('../models/member.model.js');

// Create and Save a new member
exports.create = (req, res) => {
// Validate request
if(!req.body) {
    return res.status(400).send({
        message: "Member content can not be empty"
    });
}

// Create a Member
const member = new memberModel({
    firstName: req.body.firstName ,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    memberType: req.body.memberType,
    emailID: req.body.emailID,
    mobileNo: req.body.mobileNo,
    collegeName: req.body.collegeName,
    currentQualification: req.body.currentQualification,
    supportingDocuments:req.body.supportingDocuments,
    resume: req.body.resume,
    preferredLocation : req.body.preferredLocation ,
    providerType : req.body.providerType,
    providerName : req.body.providerName,
    skillsTags: req.body.skillsTags,
    supportingDocumentForSkills: req.body.supportingDocumentForSkills,
});



// Save Member in the database
member.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Member."
    });
});
};
// Retrieve and return all members from the database.
exports.findAll = (req, res) => {
    memberModel.find()
    .then(member => {
        res.send(member);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving members."
        });
    });
};

// Find a single member with a memberID
exports.findOne = (req, res) => {
    memberModel.findById(req.params.memberID)
    .then(member => {
        if(!member) {
            return res.status(404).send({
                message: "Member not found with id " + req.params.memberID
            });            
        }
        res.send(member);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Member not found with id " + req.params.memberID
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Member with id " + req.params.memberID
        });
    });
};

// Update a member identified by the memberID in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Member content can not be empty"
        });
    }

    // Find member and update it with the request body
    memberModel.findByIdAndUpdate(req.params.memberID, {
        firstName: req.body.firstName || "Untitled Member", 
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        memberType: req.body.memberType,
        emailID: req.body.emailID,
        mobileNo: req.body.mobileNo,
        collegeName: req.body.collegeName,
        currentQualification: req.body.currentQualification,
        supportingDocuments:req.body.supportingDocuments
    }, {new: true})
    .then(member => {
        if(!member) {
            return res.status(404).send({
                message: "Member not found with id " + req.params.member
            });
        }
        res.send(member);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "member not found with id " + req.params.memberID
            });                
        }
        return res.status(500).send({
            message: "Error updating member with id " + req.params.memberID
        });
    });
};

// Delete a member with the specified memberID in the request
exports.delete = (req, res) => {
    memberModel.findByIdAndRemove(req.params.memberID)
    .then(member => {
        if(!member) {
            return res.status(404).send({
                message: "member not found with id " + req.params.memberID
            });
        }
        res.send({message: "member deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Member not found with id " + req.params.memberID
            });                
        }
        return res.status(500).send({
            message: "Could not delete member with id " + req.params.memberID
        });
    });
};


// Students search

exports.searchStudents = (req,res) => {
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if(pageNo < 0 || pageNo === 0) {
        return res.status(404).send({
            message: "Invalid Page Number"
        }); 
     }
     query.skip = size * (pageNo - 1)
     query.limit = size
     var array = req.query.skill.split(',');

    if( (typeof req.query.preferredLocation != 'undefined')  && (typeof req.query.skill != 'undefined') ) {

        memberModel.find({ preferredLocation: req.query.preferredLocation, skillsTags: { $elemMatch: { $in: array} } },null,query, function(err, member) {
            if (err) throw err;
            
            return res.send(member);
        });

    }
    else if((typeof req.query.preferredLocation != 'undefined') && (typeof req.query.skill == 'undefined') ){

        memberModel.find({ preferredLocation: req.query.preferredLocation },null,query, function(err, member) {
            if (err) throw err;
            
            return res.send(member);
        });

    }
    else if ((typeof req.query.skill != 'undefined') && (typeof req.query.preferredLocation == 'undefined') ) {
        memberModel.find({ skillsTags: { $elemMatch: { $in: array} } },null,query, function(err, member) {
            if (err) throw err;
            
           return res.send(member);
        });
       
    }
    else if (err) throw err;
    else {
    return res.status(404).send({
        message: "Students not found"
                                }); 
        }

}


