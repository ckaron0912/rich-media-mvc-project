"use strict";

$(document).ready(function() {
    $("#error").hide();

    function handleError(message) {
        $("#errorMessage").text(message);
        $("#error").show();
    }
    function sendAjax(action, data) {
      console.log('sendAjax');
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
              //Sconsole.log(result);
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = xhr.responseText;

                handleError(messageObj.error);
            }
        });
    }

    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();

        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }

        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

        return false;
    });

    $("#signupForm").on("keyup", function(e) {

        if(e.keyCode == 13){

            if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
                handleError("All fields are required");
                return false;
            }

            if($("#pass").val() !== $("#pass2").val()) {
                handleError("Passwords do not match");
                return false;
            }

            sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

            return false;
        }
    });

    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
        console.log(JSON.stringify($("#loginForm").serialize()));

        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });

    $("#loginForm").on("keyup", function(e) {
        if(e.keyCode == 13){

            if($("#user").val() == '' || $("#pass").val() == '') {
                handleError("Username or password is empty");
                return false;
            }

            sendAjax($("#loginForm").attr("action"), $("#loginForm").serializeA());
        }
    });
});
