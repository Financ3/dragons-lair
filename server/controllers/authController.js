const bcrypt = require('bcryptjs');

module.exports = { 
    register: async function(req, res) {
        //receive the info to create a new user
        const {username, password, isAdmin} = req.body;

        // bring in the database
        const db = req.app.get('db');

        //get username from the DB to check if it already exists
        const result = await db.get_user(username);
        const [existingUser] = result;

        if(existingUser) {
            return res.status(409).send("Username is taken");
        }

        //create salt for handling the password
        const salt = bcrypt.genSaltSync(10);

        //create the hashed password
        const hash = bcrypt.hashSync(password, salt);

        //make the request to create a new user in the DB
        const registeredUser = await db.register_user(isAdmin, username, hash);
        user = registeredUser[0];

        //Create the session data by adding the user object to the session object, remove the HASH value before hand.
        delete user.hash;
        req.session.user = user;
        res.status(201).send(user);
    },
    login: async function(req, res) {
        const {username, password} = req.body;
        const db = req.app.get('db');

        const foundUser = await db.get_user(username);
        const [user] = foundUser;

        if(!user) {
            return res.status(401).send("User not found. Please register as a new user before logging in.");
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash);

        if (!isAuthenticated) {
            return res.status(403).send("Incorrect Password");
        }

        delete user.hash;
        req.session.user = user;
        res.status(200).send(user);
    },
    logout: async function(req, res) {
        req.session.destroy();
        res.sendStatus(200);
    }
}