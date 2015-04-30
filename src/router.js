//import the controller folder (automatically calls the index.js file)
var controllers = require('./controllers');
var mid = require("./middleware");

var router = function(app) {

    app.get("/login", mid.requiresLogout, mid.requiresSecure, controllers.Account.loginPage);
    app.post("/login",mid.requiresSecure, controllers.Account.login);
    app.get("/logout", controllers.Account.logout);
    app.get("/register", mid.requiresSecure, controllers.Account.signupPage);
    app.post("/register", mid.requiresSecure, controllers.Account.signup);
    app.get("/builder", controllers.Builder.builderPage);
    app.get("/", controllers.Home.homePage);
};

module.exports = router;
