const express = require('express');
const router = express.Router();

// If logged in then allow contact addition and deletion and editing
const logged_in = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Not authorized");
    }
}


//Home page
router.post('/', async(req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contacts = await req.db.contactsSchema();
    res.render('/', {contacts: contacts});
});


//Create Contact Page
router.get('/create', async (req, res) => {
    res.render('create', { hide_login: true });
});

// router.post('/create', async (req, res) => {
//     const username = req.body.username.trim();
//     const p1 = req.body.password.trim();
//     const p2 = req.body.password2.trim();
//     if (p1 != p2) {
//         res.render('create', { hide_login: true, message: 'Passwords do not match!' });
//         return;
//     }

//     const user = await req.db.findUserByUsername(username);
//     if (user) {

//         res.render('create', { hide_login: true, message: 'This account already exists!' });
//         return;
//     }

//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(p1, salt);

//     const id = await req.db.createUser(username, hash);
//     req.session.user = await req.db.findUserById(id);
//     res.redirect('/');
// });


module.exports = router;