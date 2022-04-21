const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('express-flash');

app.use(express.json());
app.use(express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false
}));

// local strategy
const passport = require('./lib/passport');
app.use(passport.initialize());
app.use(passport.session());

// jwt
const jwtPassport = require('./lib/jwtPassport');
app.use(jwtPassport.initialize());

app.use(flash());

app.set("view engine", "ejs");

let isLogin = false;

const restrict = require("./middlewares/restrict");
const apiRestrict = require("./middlewares/apiRestrict");

const game = require("./routes/game");
const history = require("./routes/history");
const biodata = require("./routes/biodata");
const auth = require("./routes/auth");

app.use(game);
app.use(history);
app.use("/biodata", restrict, biodata);
app.use(auth);

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/login/auth", async (req, res) => {
    const { Game } = require('./models');
    const gameUser = await Game.findOne({
        where: {
            username: req.body.username
        }
    });

    if (gameUser.username === req.body.username) {
        isLogin = true;
        res.redirect("/game");
    } else {
        res.render("login", {
            error: "Incorrect email address or password",
        });
    }
});

app.get("/game", (req, res) => {
    if (isLogin === true) {
        res.render("game");
    } else {
        res.redirect("/login");
    }
});

app.get("/whoami", apiRestrict, (req, res) => {
    res.json(req.user);
});

app.listen(3000, () => {
    console.log("Server Running...");
});