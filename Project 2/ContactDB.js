require('dotenv').config();
const Database = require('dbcmps369');

class ContactDB {
    constructor() {
        this.db = new Database();
    }

    async initialize(){
        await this.db.connect();

        //Initializes contact schema
        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first name', type: 'TEXT' },
            { name: 'last name', type: 'TEXT' },
            { name: 'phone number', type: 'TEXT' },
            { name: 'email address', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_by_email', type: 'NUMERIC' },
            { name: 'contact_by_phone', type: 'NUMERIC' }
        ], 'id');

        //Initializes users schema
        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first name', type: 'TEXT' },
            { name: 'last name', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');
    }

    //Makes a contact
    async createContact(email, password) {
        const id = await this.db.create('Contact', [
            { column: 'first name', value: first },
            { column: 'last name', value: last },
            { column: 'phone number', value: phone },
            { column: 'email address', value: email },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_email', value: 0 },
            { column: 'contact_by_email', value: 0 }
        ])
        return id;
    }

    //Makes user
    async createUser(username, password) {
        const id = await this.db.create('Users', [
            { column: 'first name', value: first },
            { column: 'last name', value: last },
            { column: 'username', value: username },
            { column: 'password', value: password }
        ])
        return id;
    }

    //Find user by username
    async findUserByUsername(username) {
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    //Find user by ID
    // async findUserById(id) {
    //     const us = await this.db.read('Users', [{ column: 'id', value: id }]);
    //     if (us.length > 0) return us[0];
    //     else {
    //         return undefined;
    //     }
    // }

    //Find contact by ID
    async findContactById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    // contactsSchema(){
       
    // }
}

module.exports = ContactDB;