/*
  ====================================================================
  Global Vars
  ====================================================================
*/
var platform='ANDROID'; // ANDROID / IOS
var SERVICES_HOST='http://appdoyoudo.com/miller/services/';


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    /* 
        INIT CORDOVA
    */
    receivedEvent: function(id) {
        //init();
    }
};

/* 
    INIT JQUERY
*/
(function ($) {
  //init();
}($));

//window.location.href='blank.html';




function compareEdad(){
    /*
 window.localStorage.setItem("sessionID",submitResponse.ID);
                    window.localStorage.setItem("sessionPicture",submitResponse.picture);
                    window.localStorage.setItem("sessionName",submitResponse.Name);
                    window.localStorage.setItem("sessionLastName",submitResponse.LastName);
    */
    var day=$('#edad_day').val();
    var month=$('#edad_month').val();
    var year=$('#edad_year').val();
    var date =  new Date(year, month, day);
    //alert(isValidDate(parseInt(day), parseInt(month), parseInt(year)));
    if (!isValidDate(parseInt(day), parseInt(month)-1, parseInt(year))){
    //if (!isValidDate(day, month, year) || calculateDiffYear(day, month, year) < 18){
        swal({
            type: 'error',
            title: 'MGD',
            html: 'La fecha ingresada no es válida.'
          })

    }
    else if(calculateDiffYear(parseInt(day), parseInt(month)-1, parseInt(year)) < 18){
        swal({
            type: 'error',
            title: 'MGD',
            html: 'Debes ser mayor de 18 años para ingresar.'
          })
    }
    else{
        window.localStorage.setItem("sessionAge","1");
        window.location='authentication.html';
    }
/*
    if(Date(year+18, month-1, day) <= new Date()){
        swal({
            type: 'error',
            title: 'MGD',
            html: 'Debes ser mayor de 18 años para ingresar.'
          })
    }
    else{
        alert("go to home");
    }*/
}


 function gotoLogin(){
    $('#registroselector').css('display','none');
    $('#register').css('display','none');
    $('#login').fadeIn();
    $('#backbutton').css('visibility','visible');
 }

 function gotoRegister(){
    $('#registroselector').css('display','none');
    $('#login').css('display','none');
    $('#register').fadeIn();
    $('#backbutton').css('visibility','visible');
 }
 function isValidDate(date, month, year)
 {
     var flagDate = new Date(year, month, date);
     if (flagDate.getFullYear() != year || flagDate.getMonth() != month || flagDate.getDate() != date)
     {
         return false;
     }
     return true;
 }

 function calculateDiffYear(date, month, year)
		{
			var cur = new Date();
			var diff = Math.floor((cur.getTime() - new Date(year, month, date)) / (60 * 60 * 24 * 1000));
				diff -= Math.floor((cur.getFullYear() - year) / 4);

			return diff / 365;
		}



function noInternetAction(){
    alert("no hay internet");
  }