const express = require('express');
const app = express();
require('express-async-errors')
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/users.js');
const LoginRoutes = require('./routes/login.js');
const db = require('./db.js');
const port = process.env.port || 3000;

app.use(bodyParser.json());


const secret =  process.env.COOKIE_SECRET || 'thisismysecret';

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 } // 30 minutes
}))

//Global access
// app.use('/auth/login',(req, res, next)=> {
//   const sessionData = req.session;
//   res.json(sessionData);
//   next();
// })

app.use('/api/users', userRoutes);
app.use('/auth', LoginRoutes);

app.use((err, res, req, next)=> {
    console.log(err)
    res.send(err.status || 500).send('Something Went Wrong!');
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

db.query("SELECT 1")
    .then(() => {
        console.log('Database connected😎');
        app.listen(port, ()=> {
            console.log(`Application is running on Port:${port}`);
        });
    })
    .catch(err => console.log('Database connection error:😕' + err));


