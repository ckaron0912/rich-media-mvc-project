"use strict";

$(document).ready(function() {

    var timer = 0;
    var queueIndex = 0;
    var buildQueue = [];
    var warScore = parseInt($("#score").html());
    var currentCrystal =  parseFloat($("#crystal").html());
    var currentCredits = parseInt($("#credits").html());
    var currentMetal = parseInt($("#metal").html());
    var numMiners = 1;
    var minerButton = $("#buyMiner");
    $(".timer").TimeCircles({

        start: false,
        animation: "smooth",
        total_duration: "Auto",
        time: {
            Days: {show: false},
            Hours: {show: false},
            Minutes: {show: false},
            Seconds: {

                "color": "#99CCFF"
            }
        }
    });

    var minerTimer = $("#minerTimer");
    minerTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("timer end");
                minerButton.show();
                warScore++;
                numMiners++;
                updateValues();
                this.TimeCircles().restart().rebuild();
            }
        });

    //ship objects
    var ships = {

        "miner":{
            "name": "miner",

            "cost":{

                "metal": 100,
                "crystal": 10,
                "credits": 50
            },
            "score": 1,
            "buildTime": 10
        }
    };

    function handleError(message) {
        $("#errorMessage").text(message);
    }

    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);

                handleError(messageObj.error);
            }
        });
    }

    $("button").on("click", function(e) {
        console.log();

        var button = e.currentTarget;

        if(currentCredits < ships[button.name].cost.credits) {
            handleError("Not enough credits");
            return false;
        }
        else if(currentMetal < ships[button.name].cost.metal) {
            handleError("Not enough metal");
            return false;
        }
        else if(currentCrystal < ships[button.name].cost.crystal) {
            handleError("Not enough crystal");
            return false;
        }

        //sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());

        startBuild(button.name);

        return false;
    });

    function startBuild(ship){

        currentCredits -= ships[ship].cost.credits;
        currentMetal -= ships[ship].cost.metal;
        currentCrystal -= ships[ship].cost.crystal;

        updateValues();

        if(ship == "miner"){

            minerButton.hide();
            minerTimer.TimeCircles().start();
        }

        buildQueue.push(ships[ship]);
    }

    function updateValues(){

        $("#crystal").html(currentCrystal);
        $("#credits").html(currentCredits);
        $("#metal").html(currentMetal);
        $("#score").html(warScore);
    }

    setInterval(function(){
        console.log(currentCrystal);
        currentCredits += (1 * numMiners);
        currentCrystal += (.2 * numMiners);
        currentCrystal = parseFloat(currentCrystal.toFixed(1));
        currentMetal += (3 * numMiners);
        updateValues();
    }, 1000);
});
