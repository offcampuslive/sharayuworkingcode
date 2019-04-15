module.exports = (app) => {
    const member = require('../controllers/member.controller.js');
    const login = require('../controllers/login.controller.js');
    var VerifyToken = require('../../utils/Auth.js');

    // Create a new Note
    app.post('/members', member.create);

    // Retrieve all Notes
    app.get('/members', member.findAll);

    // Retrieve a single Note with noteId
    app.get('/members/:memberID', member.findOne);

    // Update a Note with noteId
    app.put('/members/:memberID', member.update);

    // Delete a Note with noteId
    app.delete('/members/:memberID', member.delete);

    // verify Login
    
    app.post('/login', login.verifyUser);

    // Test Auth token
    app.post('/loginTestToken',VerifyToken, login.verifyTokenTest);

    // Search Students
    app.get('/students', member.searchStudents);
    


}