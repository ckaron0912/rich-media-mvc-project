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

        var pugData = {
            csrfToken: req.csrfToken(),
            username: req.session.account.username,
            "score": user.score,
            "metal": user.metal,
            "credits": user.credits,
            "crystal": user.crystal,
            "miners": user.miners
        };

        //console.log(req.session.account.username);
        res.render('builder', pugData);
    });

};

var save = function(req, res){

    User.AccountModel.findByUsername(req.session.account.username, function(err, user){

        if(err){
            console.log(err);
            return res.status(400).json({error: "An error occurred!"});
        }

        user.credits = req.body.credits;
        user.crystal = req.body.crystal;
        user.metal = req.body.metal;
        user.score = req.body.score;
        user.miners = req.body.miners;

        user.save(function(err, status){

            if(err){

                console.log(err);
                return res.status(400).json({error: "An error occurred!"});
            }
            //console.log(status);
            return res.json({result: "sucess"});
        });
    });
};

module.exports.builderPage = builderPage;
module.exports.save = save;
