require('dotenv').config()

//express stuff
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000

//mongoose stuff
const mongoose = require('mongoose')
const mongoURI = `mongodb+srv://ion05:${process.env.DB_PASS}@cluster0.tidfk.mongodb.net/data?retryWrites=true&w=majority`


/*firebase stuff*/
const admin = require("./firebase");
const db = admin.firestore();
const userCollection = db.collection("users");


/*ejs and other misscelanous stuff.*/
app.use(expressLayouts);
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const methodOverride = require("method-override");


/*passport js stuff*/
const passport = require("passport");
const flash = require("express-flash");
const session = require("cookie-session");
const initializePassport = require("./config/passport-config");

app.use(flash());
app.use(
    session({
        name: "_displicareAuth",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

initializePassport(
    passport,
    async (email) => {
        const userdoc = await userCollection.where("email", "==", email).get();
        return userdoc.docs.length != 0 ? userdoc.docs[0].data() : null;
    },
    async (id) => {
        const userdoc = await userCollection.where("id", "==", id).get();
        return userdoc.docs.length != 0 ? userdoc.docs[0].data() : null;
    }
);

//deploying website stuff. such as app and router etc.
const indexRoute = require('./routes/indexRoute')
const dashboardRoute = require('./routes/dashboard')
const consumerRoute = require('./routes/consumerRoute')
const retailerRoute = require('./routes/retailerRoute')
const profileRoute = require('./routes/profile')

app.use('/', indexRoute)
app.use('/dashboard', dashboardRoute)
app.use('/consumer', consumerRoute)
app.use('/retailer', retailerRoute)
app.use('/profile', profileRoute)


mongoose.connect(String(mongoURI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('Connected to Mongo DB')

    app.listen(PORT, err => {
        console.log(`App listening on http://localhost:${PORT}`)
        if (err) throw  err
    })

}).catch((err) => console.log(err))








