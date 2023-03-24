require('dotenv').config();
const Database = require('dbcmps369');
const sqlite = require('sqlite-async');

class ContactDB {
    constructor() {
        this.db = new Database();
    }

    async initialize(){
        await this.db.connect();

        //Initializes contact schema
        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'phone_number', type: 'TEXT' },
            { name: 'email_address', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_by_email', type: 'INTEGER' },
            { name: 'contact_by_phone', type: 'INTEGER' },
            { name: 'contact_by_mail', type: 'INTEGER' }
        ], 'id');

        //Initializes users schema
        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');

    }

    //Makes a contact
    async createContact(first, last, phone, email, street, city, state, zip, country, cEmail, cPhone, cMail) {
        const id = await this.db.create('Contact', [
            { column: 'first_name', value: first },
            { column: 'last_name', value: last },
            { column: 'phone_number', value: phone },
            { column: 'email_address', value: email },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_email', value: cEmail },
            { column: 'contact_by_phone', value: cPhone },
            { column: 'contact_by_mail', value: cMail}
        ])
        return id;
    }

    //Makes user
    async createUser(first, last, username, password) {
        const id = await this.db.create('Users', [
            { column: 'first_name', value: first },
            { column: 'last_name', value: last },
            { column: 'username', value: username },
            { column: 'password', value: password }
        ])
        return id;
    };

    //Find user by username
    async findUserByUsername(username) {
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    //Find user by ID
    async findUserById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    //Find contact for home page output
    async findContactHomePage(id) {
        const fullContact = await this.db.read('Contact', [{ column: 'id', value: id }]);
        if(fullContact.length > 0) return fullContact;
        else{
            return undefined; 
        }
    }

    //Find contact by ID
    async findContactById(id) {
        const fullContact = await this.db.read('Contact', [{ column: 'id', value: id }]);
        return fullContact;
    }

    //Updates a contact
    async updateContact(id, first, last, phone, email, street, city, state, zip, country, cEmail, cPhone, cMail) {
        await this.db.update('Contact', [
            { column: 'first_name', value: first },
            { column: 'last_name', value: last },
            { column: 'phone_number', value: phone },
            { column: 'email_address', value: email },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_email', value: cEmail },
            { column: 'contact_by_phone', value: cPhone },
            { column: 'contact_by_mail', value: cMail}
        ], [{ column: 'id', value: id}]);
    }

    //Deletes a contact
    async deleteContact(id){
        await this.db.delete('Contact', [{ column: 'id', value: id }]);
    }
}

module.exports = ContactDB;