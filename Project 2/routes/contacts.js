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
router.get('/', async(req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    //res.render('home', {contacts: contacts});
    res.render('home');
});


//Create Contact Page
router.get('/create', async (req, res) => {
    res.render('create', { hide_login: true });
});

//Create Page Functionality
router.post('/create', async (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();
    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim();
    const country = req.body.country.trim();

    let cPhone = 0;
    let cEmail = 0;
    let cMail = 0;

    //Checkboxes
    if(req.body.contact_by_email == 'on'){
        cEmail = 1;
    }else{
        cEmail = 0;
    }

    if(req.body.contact_by_phone == 'on'){
        cPhone = 1;
    }else{
        cPhone = 0;
    }

    if(req.body.contact_by_mail == 'on'){
        cMail = 1;
    }else{
        cMail = 0;
    }


    const id = await req.db.createContact(first, last, phone, email, street, city, state, zip, country, cEmail, cPhone, cMail);
    req.session.user = await req.db.findUserById(id);
    res.redirect('/');
});

//Singular Contact Page
router.get('/:id', async (req, res) => {
    const contact = await req.db.findContactById(req.params.id);
    res.render('idpage', { contact: contact });
});

/*
    IMPORTANT NOTE:
        USE THE LOGGED_IN FOR THE EDIT AND DELETE CONTACT PAGES
*/
module.exports = router;