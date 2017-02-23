//import libraries
var path = require("path");
var express = require("express");
var compression = require("compression");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var url = require("url");
var csrf = require("csurf");

mongoose.Promise = require("bluebird");

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/Admiralty";

var db = mongoose.connect(dbURL, function(err) {
    if(err) {
        console.log("Could not connect to database");
        throw err;
    }
});

var redisURL = {

    hostname: "localhost",
    port: 6379
};

var redisPASS;

if(process.env.REDISCLOUD_URL){

    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(":")[1];
}

//pull in our routes
var router = require("./router.js");

var server;
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use('/assets', express.static(path.resolve(__dirname + '/../client/')));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true
}));

var sess = {

    key: "sessionid",
    store: new RedisStore({

        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS
    }),
    secret: "Admiral on deck",
    resave: true,
    saveUninitialized: true,
    cookie: {}
};

if(app.get('env') === 'production'){
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(favicon(__dirname + "/../client/img/favicon.png"));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(csrf({ cookie: true}));

app.use(function(err, req, res, next){

    if(err.code !== "EBADCSRFTOKEN"){

        return next(err);
    }

    return;
});

router(app);

server = app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("Listening on port " + port);
});
