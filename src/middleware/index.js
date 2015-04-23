
var requiresLogin = function(req, res, next) {

    if(!req.session.account){

        return res.redirect("/");
    }

    next();
};

var requiresLogout = function(req, res, next) {

    if(req.session.account){

        return res.redirect("/builder");
    }
    next();
};

var requiresSecure = function(req,res,next) {

};

var bypassSecure = function(req, res, next){

}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;











