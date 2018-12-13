require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const massive = require('massive');
const session = require('express-session');

const { SESSION_SECRET,SERVER_PORT, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());
app.use(session({
secret: SESSION_SECRET,
resave: false,
saveUninitialized: true
}))
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('Database connected')
    app.listen(SERVER_PORT, () => {
        console.log(`Server is listening on port: ${SERVER_PORT}`)
    });
})



app.post('/auth/signup', async (req, res) => {
    let { email, password } = req.body;
    const db = req.app.get('db');
    let user = await db.find_user([email]);
    if(user[0]) {return res.status(200)
    .send({loggedIn: false, message: 'Email already in use'});
    } else {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        let createdCustomer = await db.create_customer([email,hash]);
        req.session.user = {
            email: createdCustomer[0].email, id: createdCustomer[0].id
        }
        res.status(200).send({loggedIn: true, message: 'Login Successful'})
    }
})
app.post('/auth/login', async (req,res)=>{
    let { email, password } = req.body;
    const db = req.app.get('db');
    let user = await db.find_user([email]);
    if(!user[0]){
        return res.status(200).send({loggedIn: false, message:  'Email not found.'})
    };
    let result = bcrypt.compareSync(password, user[0].hash_value)
    if(result){
        req.session.user = {email: user[0].email, id: user[0].id};
        return res.status(200).send({loggedIn: true, message: 'Login Successful'})
    } else {
        return res.status(401).send({loggedIn: false, message:'Incorrect Password'})
    }
})


