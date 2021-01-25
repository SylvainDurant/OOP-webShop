const express = require('express');
const router = express.Router();
const app = express();
const port = 3666;
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const dotenv = require("dotenv");


require("./config/passport")(passport)

dotenv.config();

///// mongoose /////
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECT)
.then(() => console.log('connected to DB'))
.catch((err)=> console.log(err));

///// EJS /////
app.set('view engine','ejs');
app.use(expressEjsLayout);

app.use(express.static(__dirname + '/public')); // setup static directory 
app.use(express.json());       // to support JSON-encoded bodies

///// BodyParser /////
app.use(express.urlencoded({extended : false}));

///// express session /////
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

///// use flash /////
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
})

///// Routes /////
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/admin',require('./routes/admin'));

app.listen(port, () => console.log(`Server's up on port ${port}!`))