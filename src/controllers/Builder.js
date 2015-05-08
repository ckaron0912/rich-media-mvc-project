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

        var jadeData = {
            csrfToken: req.csrfToken(),
            username: req.session.account.username,
            "score": user.score,
            "metal": user.metal,
            "credits": user.credits,
            "crystal": user.crystal,
            "miners": user.miners
        };

        //console.log(req.session.account.username);
        res.render('builder', jadeData);
    });

};

var save = function(req, res){

    User.AccountModel.findByUsername(req.session.account.username, function(err, user){

        if(err){
            console.log(err);
            return res.status(400).json({error: "An error occurred!"});
        }

        var saveData = {

            "_id": user._id,
            "score": req.body.score,
            "crystal": req.body.crystal,
            "credits": req.body.credits,
            "metal": req.body.metal,
            "miners": req.body.miners
        };

        user.save(saveData, function(err){

            if(err){

                console.log(err);
                return res.status(400).json({error: "An error occurred!"});
            }

            return res.json({redirect: "/builder"});
        });
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
module.exports.save = save;
