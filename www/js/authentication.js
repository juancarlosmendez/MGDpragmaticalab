/*
  ====================================================================
  Global Vars
  ====================================================================
*/
var platform='ANDROID'; // ANDROID / IOS
var SERVICES_HOST='http://mgd.com.ec/services/';


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
  init();
}($));

//window.location.href='blank.html';


/* 
    INITIALIZATION
*/
function init(){
    //FIX MIN HEIGHT IN GENERAL CONTENT
    $('#content').css('height',$(window).height()-$('footer').height()-$('header').height());
    $('#content').css('height',$(window).height()-$('footer').height()-$('header').height());
 }


 function login(){
    var allowLogin=true;
    var errors="Debes llenar todos los campos.";
    if($('#loginUsername').val()==''){
        allowLogin=false;
    }
    if($('#loginPassword').val()==''){
        allowLogin=false;
    }
   
//http://appdoyoudo.com/miller/services/validateUser.php?user=jmendez.ec@gmail.com&pass=123456

    if(allowLogin){
        var data = {
            'user': $('#loginUsername').val(),
            'pass': $('#loginPassword').val()
          };
        $.post(SERVICES_HOST+"validateUser.php", data)
            .done(function(submitResponse) {
                if(submitResponse.status==1){
                    window.localStorage.setItem("sessionID",submitResponse.ID);
                    if(submitResponse.picture!='' && submitResponse.picture!=null && submitResponse.picture!=undefined){
                        window.localStorage.setItem("sessionPicture",submitResponse.picture);
                    }
                    else{
                        window.localStorage.setItem("sessionPicture",'img/miller_avatar.png'); //by default displays the default in local folder
                    }      
                    window.localStorage.setItem("sessionName",submitResponse.Name);
                    window.localStorage.setItem("sessionLastName",submitResponse.LastName);
                    window.localStorage.setItem("sessionEmail",submitResponse.Email);
                    window.localStorage.setItem("sessionCiudad",submitResponse.Ciudad);
                    window.localStorage.setItem("sessionGoldenPoints",submitResponse.GoldenPoints);
                    window.location='index.html';
                }
                else{
                    swal({
                        title: 'Atención!',
                        text: "El correo electrónico o contraseña no son correctos.",
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                }
                }, 'json')
            .fail( function(xhr, textStatus, errorThrown) {
                noInternetAction();
        });        
    }
    else{
        swal({
            title: 'Atención!',
            text: errors,
            type: 'error',
            confirmButtonText: 'OK'
          });
    }

 }


 function registerAction(){
    var allowRegister=true;
    var errors="Debes llenar todos los campos.";
    if($('#regNombre').val()==''){
       allowRegister=false;
    }
    if($('#regApellido').val()==''){
       allowRegister=false;
    }
    if($('#regDate').val()=='' || $('#regDate').val().indexOf('mm')>-1){
       allowRegister=false;
    }
    if($('#regEmail').val()=='' || $('#regEmail').val().indexOf('@')==-1 || $('#regEmail').val().indexOf('.')==-1){
       allowRegister=false;
       errors="Debes ingresar una cuenta de correo válida.";
    }
    if($('#regTelefono').val()==''){
       allowRegister=false;
    }
    if($('#regPassword').val()==''){
       allowRegister=false;
    }
    if($('#regRePassword').val()==''){
       allowRegister=false;
    }
    if($('#regCiudad').val()==''){
       allowRegister=false;
    }
    if($('#regPassword').val()!=$('#regRePassword').val()){
        allowRegister=false;
        errors="Las contraseñas deben coincidir.";
    }
    var d = new Date( $('#regDate').val() );
    var year = d.getFullYear();
    var month = d.getMonth()+1; //arroja el dia menos 1
    var dia = d.getDate()+1; //arroja el dia menos 1


    if(allowRegister){
        var data = {
            'Name': $('#regNombre').val(),
            'LastName': $('#regApellido').val(),
            'Email': $('#regEmail').val(),
            'Password': $('#regPassword').val(),
            'Ciudad': $('#regCiudad').val(),
            'Ano': year,
            'Mes': month,
            'Dia': dia
          };
        $.post(SERVICES_HOST+"register.php", data)
            .done(function(submitResponse) {
                if(submitResponse.success==1){
                   
                      swal({
                        title: 'MGD',
                        text: "Te has registrado con éxito.",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#000000',
                        confirmButtonText: 'INGRESAR'
                      }).then((result) => {
                        if (result.value) {
                            $('#regEmail').val('');
                            $('#regNombre').val('');
                            $('#regApellido').val('');
                            $('#regEmail').val('');
                            $('#regPassword').val('');
                            $('#regCiudad').val('');
                            $('#regRePassword').val('');
                            $('#regTelefono').val('');
                            $('#login').css('display','none');
                            $('#register').css('display','none');
                            $('#registroselector').fadeIn();
                            $('#backbutton').css('visibility','hidden');
                        }
                      });

                }
                else{
                    swal({
                        title: 'Atención!',
                        text: submitResponse.error,
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                }
                }, 'json')
            .fail( function(xhr, textStatus, errorThrown) {
                noInternetAction();
        });        
    }
    else{
        swal({
            title: 'Atención!',
            text: errors,
            type: 'error',
            confirmButtonText: 'OK'
          });
    }
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

 function back(){
    $('#login').css('display','none');
    $('#register').css('display','none');
    $('#registroselector').fadeIn();
    $('#backbutton').css('visibility','hidden');
 }


function noInternetAction(){
    swal({
        type: 'error',
        title: 'MGD',
        html: 'No se ha podido establecer la conexión.'
      });
  
  }