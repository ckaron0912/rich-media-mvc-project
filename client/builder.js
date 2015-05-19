"use strict";

$(document).ready(function() {

    var timer = 0;
    var queueIndex = 0;
    var warScore = parseInt($("#score").html());
    var currentCrystal =  parseFloat($("#crystal").html());
    var currentCredits = parseInt($("#credits").html());
    var currentMetal = parseInt($("#metal").html());
    var numMiners = miners;
    var minerButton = $("#buyMiner");
    var corvetteButton = $("#buyCorvette");
    var frigateButton = $("#buyFrigate");
    var cruiserButton = $("#buyCruiser");
    var battleshipButton = $("#buyBattleship");

    //ship objects
    var ships = {

        "miner":{
            "name": "miner",
            "cost":{
                "metal": 200,
                "crystal": 10,
                "credits": 50
            },
            "score": 1
        },

        "corvette":{
            "name": "corvette",
            "cost":{
                "metal": 400,
                "crystal": 50,
                "credits": 200
            },
            "score": 3
        },

        "frigate":{
            "name": "frigate",
            "cost":{
                "metal": 500,
                "crystal": 100,
                "credits": 350
            },
            "score": 10
        },

        "cruiser":{
            "name": "corvette",
            "cost":{
                "metal": 700,
                "crystal": 200,
                "credits": 200
            },
            "score": 20
        },

        "battleship":{
            "name": "corvette",
            "cost":{
                "metal": 1000,
                "crystal": 400,
                "credits": 200
            },
            "score": 50
        }
    };

    //setup save Timer
    setInterval(function(){

        save();

    }, 300000);

    //setup TimeCircles
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

    //timers for each ship
    var minerTimer = $("#minerTimer");
    minerTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("minerTimer end");
                minerButton.show();
                warScore += ships["miner"].score;
                numMiners++;
                updateValues();
                save();
                this.TimeCircles().restart().rebuild();
            }
        });

    var corvetteTimer = $("#corvetteTimer");
    corvetteTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("corvetteTimer end");
                corvetteButton.show();
                warScore += ships["corvette"].score;
                updateValues();
                save();
                this.TimeCircles().restart().rebuild();
            }
        });

    var frigateTimer = $("#frigateTimer");
    frigateTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("frigateTimer end");
                frigateButton.show();
                warScore += ships["frigate"].score;
                updateValues();
                save();
                this.TimeCircles().restart().rebuild();
            }
        });

    var cruiserTimer = $("#cruiserTimer");
    cruiserTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("cruiserTimer end");
                cruiserButton.show();
                warScore += ships["cruiser"].score;
                updateValues();
                save();
                this.TimeCircles().restart().rebuild();
            }
        });

    var battleshipTimer = $("#battleshipTimer");
    battleshipTimer.TimeCircles().addListener(
        function(unit, value, total){

            if(total <= 0){

                console.log("battleshipTimer end");
                battleshipButton.show();
                warScore += ships["battleship"].score;
                updateValues();
                save();
                this.TimeCircles().restart().rebuild();
            }
        });

    function handleError(message) {
        $("#errorMessage").text(message);
    }

    function sendAjax(action, data) {

        console.log("send");

        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {

                console.log(result.result);
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);

                handleError(messageObj.error);
            }
        });
    }

    function save(){

        var csrf = $("#csrf").val();

        var json = {

            "_csrf": csrf,
            "score": warScore,
            "miners": numMiners,
            "credits": currentCredits,
            "metal": currentMetal,
            "crystal": currentCrystal
        };

        sendAjax("/builder", json);
    }

    $("#logout-btn").on("click", function(e){

        save();
    });

    $("button").on("click", function(e) {

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

        startBuild(button.name);

        return false;
    });

    function startBuild(ship){

        console.log(minerButton);
        currentCredits -= ships[ship].cost.credits;
        currentMetal -= ships[ship].cost.metal;
        currentCrystal -= ships[ship].cost.crystal;

        updateValues();

        switch(ship){

            case "miner":{

                minerButton.hide();
                minerTimer.TimeCircles().start();
                break;
            }
            case "corvette":{

                corvetteButton.hide();
                corvetteTimer.TimeCircles().start();
                break;
            }
            case "frigate":{

                frigateButton.hide();
                frigateTimer.TimeCircles().start();
                break;
            }
            case "cruiser":{

                cruiserButton.hide();
                cruiserTimer.TimeCircles().start();
                break;
            }
            case "battleship":{

                battleshipButton.hide();
                battleshipTimer.TimeCircles().start();
                break;
            }
        }

    }

    function updateValues(){

        $("#crystal").html(currentCrystal);
        $("#credits").html(currentCredits);
        $("#metal").html(currentMetal);
        $("#score").html(warScore);
    }

    setInterval(function(){

        currentCredits += (1 * numMiners);
        currentCrystal += (.2 * numMiners);
        currentCrystal = parseFloat(currentCrystal.toFixed(1));
        currentMetal += (3 * numMiners);
        updateValues();
    }, 1000);
});
