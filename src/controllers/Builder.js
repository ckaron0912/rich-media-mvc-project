var _ = require('underscore');
var models = require('../models');

var User = models.Account;

var builderPage = function(req, res) {
    if(!req.session.account){

        return res.redirect('/');
    }

    User.AccountModel.findByUsername(req.session.account.username, function(err, user){

        if(err){
            console.log(err);
            return res.status(400).json({error: "An error occurred!"});
        }
        //console.log(req.session.account.username);
        res.render('builder', {csrfToken: req.csrfToken(), username: req.session.account.username});
    });

};

var makeDomo = function(req, res) {

    if(!req.session.account){

        return res.redirect('/');
    }

    if(!req.body.name || !req.body.age){

        return res.status(400).json({error: "RAWR! Both name and age are required!"});
    }

    var domoData = {

        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id
    };

    var newDomo = new Domo.DomoModel(domoData);

    newDomo.save(function(err){

        if(err){

            console.log(err);
            return res.status(400).json({error: "An error occurred!"});
        }

        return res.json({redirect: "/maker"});
    });
};

module.exports.builderPage = builderPage;
module.exports.make = makeDomo;
