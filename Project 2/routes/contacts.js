const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// If logged in then allow contact addition and deletion and editing
const logged_in = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Not authorized");
    }
}

//Home page rendering
router.get('/', async(req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const user = await req.db.findUserById(userId);

    //Checks to see if the user is there in the database, and creates it if not
    const adminUsername = 'cmps369';
    const adminPassword = 'rcnj';

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);

    if(await req.db.findUserByUsername(adminUsername) == undefined){
        await req.db.createUser('RCNJ', 'CMPS369', adminUsername, hash);
    }

    let id = 1;
    let temp = []; //Temp array to store the contacts into
    let nextContact = [];

    //While the next id contact exists, it adds it to the temporary array of contacts
    while (nextContact != undefined){
        temp.push(await req.db.findContactById(id));
        id++;
        nextContact = await req.db.findContactHomePage(id);
    }

    //Once all of the contacts in the database are in an array of object arrays, change it to just an array of objects
    const contacts = [].concat(...temp);

    res.render('home', { contacts: contacts, user: user });
});


//Create Contact Page
router.get('/create', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const user = await req.db.findUserById(userId);
    res.render('create', {user: user});
});

//Create Page Functionality
router.post('/create', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;

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
    res.redirect('/');
});

//Singular Contact Page render
router.get('/:id', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const user = await req.db.findUserById(userId);
    const contact = await req.db.findContactById(req.params.id);
    res.render('idpage', { contact: contact, user: user });
});

//Edit page render
router.get('/:id/edit', logged_in, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const user = await req.db.findUserById(userId);
    const contact = await req.db.findContactById(req.params.id);
    res.render('edit', { contact: contact , user: user});
});

//Edit page functionality
router.post('/:id/edit', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;

    const first = req.body.first;
    const last = req.body.last;
    const phone = req.body.phone;
    const email = req.body.email;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const country = req.body.country;

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

    await req.db.updateContact(req.params.id, first, last, phone, email, street, city, state, zip, country, cEmail, cPhone, cMail);
    res.redirect('/'+req.params.id);
});

//Delete page render
router.get('/:id/delete', logged_in, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contact = await req.db.findContactById(req.params.id);
    const user = await req.db.findUserById(userId);

    res.render('delete', { contact: contact , user: user});
})

//Delete page functionality
router.post('/:id/delete', logged_in, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;

    await req.db.deleteContact(req.params.id);
    res.redirect('/');
})

module.exports = router;