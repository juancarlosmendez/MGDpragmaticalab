/*
====================================================================
Global Vars
====================================================================
*/
var platform='ANDROID'; // ANDROID (default) / IOS
var SERVICES_HOST='http://mgd.com.ec/services/';
var micomunidad_friends=null;
var sessionID;
var sessionAge;
var sessionPicture;
var sessionName;
var sessionLastName;
var sessionEmail;
var sessionCiudad;



var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  /* 
  INIT CORDOVA
  */
  receivedEvent: function(id) {
    /*define(function (require) {
      var ImgCache = require("imgcache");
  });*/
    ImgCache.init();
    ImgCache.options.cordovaFilesystemRoot = cordova.file.dataDirectory;
    platform = device.platform.toUpperCase();
    sessionChecker(); //remove comment
    //$('#container').css('visibility','visible'); //remove
    if( platform!='IOS'){
      document.addEventListener("backbutton", back, false);
    }
    
  }
};


function sessionChecker(){
  if(window.localStorage.getItem("sessionAge")!=null){
    if(window.localStorage.getItem("sessionID")!=null){
      sessionID = window.localStorage.getItem("sessionID");
      sessionPicture=window.localStorage.getItem("sessionPicture");
      sessionName=window.localStorage.getItem("sessionName");
      sessionLastName=window.localStorage.getItem("sessionLastName");
      sessionEmail=window.localStorage.getItem("sessionEmail");
      sessionCiudad=window.localStorage.getItem("sessionCiudad");
      setTimeout(showInfo,1000);
      setTimeout(function(){
        $('#container').css('visibility','visible');
      },1500);
    }
    else{
      window.location='authentication.html';
    }
  }
  else{
    window.location='age.html';
  }
}


/* 
INIT JQUERY
*/
(function ($) {
  init();
}($));






/*
====================================================================
Initialization
====================================================================
*/
function init(){
  'use strict';  
  //DRAWER
  var action = $('.hamburger-action'),
  hamburger = $('#hamburger'),
  content = $('#content'),
  overlay = $('<div>').attr({
    id: 'hamburger-overlay',
  }).insertAfter(content),
  nav = $('nav'),  
  onClick = function() {
    var contentWidth = content.width(),
    current = nav.css('margin-left'),
    val = '0%',
    layer = 'block',
    opacity = 0.5,
    ham = -10;  
    content.css('width', contentWidth);
    if(current === '0px') {
      val = '100%';
      layer = 'none';
      opacity = 0;
      ham = 0;
    } else {
      overlay.css('display', layer);
    }  
    nav.animate({'margin-left': [val]}, {
      duration: 300
    });  
    hamburger.animate({'left': [ham]}, {
      duration: 300
    });  
    overlay.animate({'opacity': [opacity]}, {
      duration: 300,
      complete: function() {
        overlay.css('display', layer);
      }
    });
  };  
  action.click(onClick);
  overlay.click(onClick);
  //hamburger.click(onClick);
  hamburger.on({ 'touchend' : onClick });   //menu touch
  //hamburger.on({ 'tap' : onClick });   //menu touch
  //hamburger.on({ 'swipe' : onClick });   //menu touch
  
  $('#backbutton').on({ 'touchend' : back });  //backbutton touch
  
  $('.logoutButton').on({ 'click' : logout });
  
  //SWIPER IN THE FOOTER
  var swiper = new Swiper('.swiper-container');
  //FIX MIN HEIGHT IN GENERAL CONTENT
  $('#content').css('min-height',$(window).height()-$('footer').height()-$('header').height());
  //fix tutorial height
  $('.tutorial').css('height',$(window).height());
  touchDrawer();
  /*
  SPOTIFY
  */
  fixSpotify();

  

  $('.revisar_goldenpoints').css('bottom',$('footer').height());
  //INITS PROFILE PICTURE SO IT WILL BE CACHED WHEN LOADED MI COMUNIDAD
 // $('.user-avatar').css('background-image',"url('"+sessionPicture+"')");   //REMOVER COMMENT
}




//  loadPage('goldenlifestyle',true);



/*
====================================================================
Methods
====================================================================
*/
function touchDrawer(){
  //console.log("click");
  //$('#hamburger').click();
  //$('#hamburger').click();
  $('#hamburger').trigger( "touchend" );
}

function fixSpotify(){
  $('#spotify').height( $(window).height() - ($('footer').height()+$('header').height()) -20 );
  $('#spotify_iframe').height( $(window).height() - ($('footer').height()+$('header').height()) -10  );
}

function closeInfo(){
  $('.tutorial').fadeOut();
}

function showInfo(){
  $('.tutorial').fadeIn();
}

function noInternetAction(){
  swal({
    type: 'error',
    title: 'MGD',
    html: 'No se ha podido establecer la conexión.'
  });
}

function logout(){
  swal({
    title: 'MGD',
    text: "¿Esta seguro de cerrar la sesión?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#000000',
    confirmButtonText: 'Cerrar Sesión.'
  }).then((result) => {
    if (result.value) {
      micomunidad_friends=null;
      sessionID=null;
      sessionPicture=null;
      sessionName=null;
      sessionLastName=null;
      sessionEmail=null;
      sessionCiudad=null;
      window.localStorage.setItem("micomunidad_amigos",null);
      window.localStorage.setItem("sessionID",null);
      window.localStorage.setItem("sessionPicture",null);
      window.localStorage.setItem("sessionName",null);
      window.localStorage.setItem("sessionLastName",null);
      window.localStorage.setItem("sessionEmail",null);
      window.localStorage.setItem("sessionCiudad",null);
      window.location='authentication.html';
      localStorage.clear();
    }
  });  
}


function showLoader(){
  $('.loading').show();
}

function hideLoader(){
  $('.loading').hide();
}





/*
====================================================================
Navigation
====================================================================
*/

var actualPage="goldenlifestyle";
function loadPage(pantalla,willTouchDrawer){
  $('#safeinthecity').css('display','none');
  $('#spotify').css('display','none');
  $('#micomunidad').css('display','none');
  $('#galeria').css('display','none');
  $('#eventos').css('display','none');
  $('#goldenlifestyle').css('display','none');
  $('#goldenstore').css('display','none');
  switch(pantalla) {
    case 'safeinthecity':
    $('#screen_title').html('SAFE IN THE CITY');
    break;    
    case 'spotify':
    $('#screen_title').html('SPOTIFY');      
    break;    
    case 'micomunidad':
    $('#screen_title').html('MI COMUNIDAD');    
    initMiComunidad();
    loadFriends();      
    break;
    case 'galeria':
    $('#screen_title').html('GALERIA');
    getDataGaleria(initGaleria,true);
    break;
    case 'eventos':
    $('#screen_title').html('EVENTOS');
    setTimeout(initEventos,500);
    break;
    case 'goldenlifestyle':
    $('#goldenlifestyle_item').hide();
    $('#goldenlifestyle').show();
    $('#screen_title').html('GOLDEN LIFESTYLE');
    initGoldenLifeStyle();
    loadNews();
    break;
    case 'goldenstore':
    $('#screen_title').html('GOLDEN STORE');
    updateGoldenPoints();
    loadProducts();  
    break;
    default:
    break;
  }
  if( platform=='IOS' && pantalla=='spotify'){
    var ref = cordova.InAppBrowser.open('https://open.spotify.com/user/millersounds', '_blank', 'closebuttoncaption=volver a MGD,location=no');
  }
  else{
    if(willTouchDrawer){
      touchDrawer();
    }
    $('#'+pantalla).css('display','block'); 
  }
  actualPage=pantalla;
}








/*
====================================================================
Eventos (Calendario)
====================================================================
*/
var alreadyEventos=false;
function initEventos(){
  if(!alreadyEventos){
    var calendar = $('#calendar').fullCalendar({
      defaultView: 'month',
      editable: false,
      height: getCalendarHeight(),
      eventLimit: true, // allow "more" link when too many events
      events: [],
      dayClick: function(date, allDay, jsEvent, view) {
        //yyyy-mm-dd
        loadEventosDia(date.format());
      },
      viewRender:function( view, element ){
        loadEventos();
      }
    });    
    var pivotCalendarSwipe=true;
    var myElement = document.getElementById('calendar');
    var mc = new Hammer(myElement);      
    mc.on("panleft", function(ev) {
      if(pivotCalendarSwipe){
        calendar.fullCalendar('next');
        pivotCalendarSwipe=false;
        setTimeout(function(){
          pivotCalendarSwipe=true;
        },500);
        
      }
    });
    mc.on("panright", function(ev) {
      if(pivotCalendarSwipe){
        calendar.fullCalendar('prev');
        pivotCalendarSwipe=false;
        setTimeout(function(){
          pivotCalendarSwipe=true;
        },500);
        //loadEventos();
      }
    });
    $('#calendar').height(getCalendarHeight());
    fixEventosList();
    alreadyEventos=true;
    //loads events from server
    //loadEventos();
    var today = new Date();
    loadEventosDia(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
  }
}

function getCalendarHeight(){
  return (getContentHeight()/2)+35;
}

function getContentHeight(){
  var hei=$(window).height()-$('footer').height()-$('header').height();
  return hei;
}

function fixEventosList(){
  var heightCells = $('.fc-row.fc-week.fc-widget-content.fc-rigid').height();
  var calendarHEgith = (getContentHeight()/2)+35;
  $('.eventos-list').height($(window).height()-$('footer').height()-$('header').height()-getCalendarHeight()-1); //1px el border top de eventos-list
}

function loadEventosDia(fecha){ 
  showLoader();
  var tmp=fecha.split('-');
  var data = {
    year:tmp[0],
    month:tmp[1],
    day:tmp[2]
  };
  $.post(SERVICES_HOST+"getEvents.php", data)
  .done(function(submitResponse) {
    $('.eventos-list').html('');
    $('.eventos-list').empty();
    var i=0;
    $.each(submitResponse.data,function(key,obj){
      $('.eventos-list').append('<li class="evento-item"><div class="day">'+obj.Dayofweek+'</div><div class="date">'+obj.Day+'</div>  <div class="separator"></div>   <div class="description">  <h4>'+obj.Title+'</h4> <p>'+obj.Description+'</p>  </div>   <div class="hour">'+obj.Hour+':'+obj.Minute+'</div> </li>');
      i++;
    });
    if(i==0){
      $('.eventos-list').append('<li class="norecord">NO HAY ACTIVIDADES...</li>');
    }
    hideLoader();      
  }, 'json')
  .fail( function(xhr, textStatus, errorThrown) {
    hideLoader();
    noInternetAction();
    
  });}
  
  function loadEventos(){
    showLoader();
    var data = {
    };
    $.post(SERVICES_HOST+"getEvents.php", data)
    .done(function(submitResponse) {
      $.each(submitResponse.data,function(key,obj){
        var datex = moment(obj.Year+"-"+stuffDateValue(obj.Month)+"-"+stuffDateValue(obj.Day));
        $('#calendar').fullCalendar('renderEvent', {
          title: 'dynamic event',
          start: datex,
          allDay: true
        });
      });      
      hideLoader();      
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {
      hideLoader();
      noInternetAction();      
    });
  }
  
  function stuffDateValue(value){
    if(value.length==1){
      return "0"+value;
    }
    else{
      return value;
    }
  }
  
  
  
  /*
  ====================================================================
  Golden Lifestyle
  ====================================================================
  */
  var listNews=null;
  var  actualLifeStyleSection="list";
  
  function loadNews(){
    showLoader();  
    var data = {      
    };
    $.post(SERVICES_HOST+"getNews.php", data)
    .done(function(submitResponse) {
      $('#goldenlifestyle_list ul').html('');
      $('#goldenlifestyle_list ul').empty();
      $('#goldenlifestyle_item').html('');
      $('#goldenlifestyle_item').empty();
      $.each(submitResponse.data,function(key,obj){
        $('#goldenlifestyle_list ul').append('<li class="news-'+obj.ID+'"> <div class="cell-picture" onclick="newsInfo('+obj.ID+')" style="background-image:url(\''+obj.PicturePath+'\')"></div>  <div class="cell-picture-path" style="display:none">'+obj.PicturePath+'</div><div class="cell-info"> <div class="cell-title" onclick="newsInfo('+obj.ID+')"> '+obj.Title+' </div>  <div class="cell-viewmore" onclick="newsInfo('+obj.ID+')"> Leer Más</div></div> <div class="cell-separator"></div> </li>');   
        
        $('#goldenlifestyle_item').append('<div class="item-news item-news-'+obj.ID+'">'+obj.Content+'</div>');  
        
      });   
      listNews=submitResponse.data;        
      hideLoader();         
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {
      hideLoader();
      noInternetAction();
    });   
  }
  
  function initGoldenLifeStyle(){
    $('#goldenlifestyle_item').hide();
    $('#goldenlifestyle_list').show();
    actualLifeStyleSection='list';
    $('#backbutton').css('visibility','hidden');          
    $('#goldenlifestyle_list ul li .cell-picture').css('visibility','hidden');
    setTimeout(function(){
      $('#goldenlifestyle_list ul li .cell-picture').css('height',$('#goldenlifestyle_list ul li .cell-picture').width());
      $('#goldenlifestyle_list ul li .cell-picture').css('visibility','visible');
    },500);
  }
  
  function newsInfo(newsID){
    $('#goldenlifestyle_list').hide();
    $('#goldenlifestyle_item').show();
    $('.item-news').css('display','none');
    actualLifeStyleSection="info";
    $('#backbutton').css('visibility','visible');
    $('.item-news.item-news-'+newsID).css('display','block');
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  ====================================================================
  Galería
  ====================================================================
  */
  var listaFotos;
  var actualPhotoIndex;
  var actualPhotoIndexLiked;
  var jsonGaleria;

  function getDataGaleria(_callback,_displayLoader){
    //sessionID=50;//remove
    if(_displayLoader){showLoader();}
    var data = {      
      userid:sessionID
    };
    $.post(SERVICES_HOST+"getGallery.php", data)
    .done(function(submitResponse) {
      jsonGaleria=submitResponse;
      if(_callback!=null){
        _callback();
      }          
      if(_displayLoader){hideLoader();}      
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {
      if(_displayLoader){hideLoader();}
      noInternetAction();
    });   
  }


  function initGaleria(){  
    $('#links').hide();
    $('#albums').html('');
    $('#albums').empty();
    $.each(jsonGaleria.albums,function(key,obj){
      $('#albums').append('<a  href="javascript:loadAlbum('+obj.ID+')" title="'+obj.Name+'"><div style="background-image:url('+"'"+obj.ImagePath+"'"+')" class="foto"></div><p>'+obj.Name+'</p> </a>');
    });
    listaFotos=jsonGaleria.items;     
    $('.photo-like').click(likePhoto);  //events for liking 
  }



  function loadAlbum(albumID){
    $('#albums').hide();
    $('#links').html('');
    $('#links').empty();
    var i=0;
    $.each(listaFotos,function(key,obj){
      if(obj.AlbumID==albumID){
        $('#links').append('<a class="photolink_'+i+'" rel="'+i+'"  href="'+obj.Path+'" title="'+obj.Description+'"><div style="background-image:url('+"'"+obj.Path+"'"+')" class="foto" rel="'+obj.ID+'"></div><p>'+obj.Description+'</p> <div rel="'+obj.Likes+'" class="likes">'+obj.Likes+' Likes</div><span class="likedbyme" style="display:none">'+obj.Likedbyme+'</span> </a>');
        i++;
      }
    });    
    $('#links a').click(function(event){
      event = event || window.event;
      var target = event.target || event.srcElement,
      link = target.src ? target.parentNode : target,
      options = { event: event},
      links = this.getElementsByTagName('a');
      var options = {
        index: $(this).attr('rel'),
        event: event,
        hidePageScrollbars:false,
        onslide: function(p1,p2){
          actualPhotoIndex=p1;
          $('.photo-like-caption').html($('.photolink_'+actualPhotoIndex).find('.likes').html()); //number of likes
          actualPhotoIndexLiked=$('.photolink_'+actualPhotoIndex).find('.likedbyme').html();
          if(actualPhotoIndexLiked=='1'){ //it´s liked
            $('.photo-like').attr('src','img/liked.png')
          }
          else{
            $('.photo-like').attr('src','img/like.png')
          }
        }
      }
      blueimp.Gallery(document.getElementById('links').getElementsByTagName('a'), options);   
    });    
    $('#links').fadeIn();
    $('#backbutton').css('visibility','visible');
  }
  
  
  function likePhoto(){  
    var currentLikesForThis = $('.photolink_'+actualPhotoIndex).find('.likes').attr('rel');
    var photoID= $('.photolink_'+actualPhotoIndex).find('.foto').attr('rel');
    if(actualPhotoIndexLiked==1){ //it´s liked
      $('.photo-like').attr('src','img/like.png');
      currentLikesForThis--;
      $('.photolink_'+actualPhotoIndex).find('.likedbyme').html("0");
      var data = {  
        userid:sessionID, //grabs from session ID variable
        photoid: photoID  
      };
      $.post(SERVICES_HOST+"removeLike.php", data).done(function(submitResponse) {}, 'json').fail( function(xhr, textStatus, errorThrown) {});  
    }
    else{ //it´s not liked
      $('.photo-like').attr('src','img/liked.png');
      currentLikesForThis++;
      $('.photolink_'+actualPhotoIndex).find('.likedbyme').html("1");
      var data = {  
        userid:sessionID, //grabs from session ID variable
        photoid: photoID  
      };
      $.post(SERVICES_HOST+"saveLike.php", data).done(function(submitResponse) {}, 'json').fail( function(xhr, textStatus, errorThrown) {});  
    }
    $('.photo-like-caption').html(currentLikesForThis+" Likes"); //number of likes
    $('.photolink_'+actualPhotoIndex).find('.likes').attr('rel',currentLikesForThis);
    $('.photolink_'+actualPhotoIndex).find('.likes').html(currentLikesForThis+" Likes");    
    getDataGaleria(null,false);  //refreshes data locally
  }
  
  

  

  
  
  
  
  
  
  /*
  ====================================================================
  Golden Store
  ====================================================================
  */
  var actualGoldenStoreSection="categories";
  
  function loadProducts(){
    showLoader();
    var data = {      
    };
    $.post(SERVICES_HOST+"getProducts.php", data)
    .done(function(submitResponse) {
      $('#goldenstore_list ul').html('');
      $('#goldenstore_list ul').empty();
      $.each(submitResponse.data,function(key,obj){
        $('#goldenstore_list ul').append('<li class="product-'+obj.ID+' '+obj.Category+'"><div class="cell-picture" onclick="productInfo('+obj.ID+')" style="background-image:url(\''+obj.PicturePath+'\')">    </div> <div class="cell-info">  <div class="cell-title" onclick="productInfo('+obj.ID+')"> CARGADOR </div> <div class="cell-price">  '+obj.Price+' GOLDEN POINTS </div>  <div class="cell-action" onclick="canjear('+obj.ID+','+obj.Price+',\''+obj.Name+'\')"> CANJEAR </div> <div class="cell-viewmore" onclick="productInfo('+obj.ID+')"> CARACTERISTICAS </div>  <div class="cell-description"  style="display:none">'+obj.Description+'</div> </div>  <div class="cell-separator"></div></li>');
      });        
      hideLoader();         
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {
      hideLoader();
      noInternetAction();
    });  
  }
  
  function listProducts(categoryID,categoryName){
    $('#goldenstore_categories').hide();
    $('#goldenstore_list').show();
    actualGoldenStoreSection="list";
    $('#backbutton').css('visibility','visible');
    $('#goldenstore_list .list-title').html(categoryName);
    $('#goldenstore_list ul li').hide();
    $('#goldenstore_list ul li.'+categoryID).show();
  }
  
  
  function productInfo(productID){
    $('#goldenstore_list').hide();
    $('#goldenstore_item').show();
    actualGoldenStoreSection="info";
    $('#backbutton').css('visibility','visible');
    //displays product info
    $('#goldenstore_item .item-picture').css('background-image',$('.product-'+productID).find('.cell-picture').css('background-image'));
    $('#goldenstore_item .item-title').html($('.product-'+productID).find('.cell-title').html());
    $('#goldenstore_item .item-price').html($('.product-'+productID).find('.cell-price').html());
    $('#goldenstore_item .item-description').html($('.product-'+productID).find('.cell-description').html());
    $('#goldenstore_item .item-action').attr('onclick',"canjear("+productID+","+$('.product-'+productID).find('.cell-price').html()+",'"+$('.product-'+productID).find('.cell-title').html()+"')");
    
  }
  
  function canjear(productID,goldenPoints,productName){
    if(goldenPoints<=window.localStorage.getItem("sessionGoldenPoints")){
      swal({
        title: 'REGISTRA LOS DATOS DE ENVIO',
        html:
        '<input id="swal-input1" class="swal2-input" placeholder="CIUDAD">' +
        '<input id="swal-input2" class="swal2-input" placeholder="DIRECCION" style="margin-top:-17px;">'+
        '<input id="swal-input3" class="swal2-input" placeholder="CELULAR" style="margin-top:-17px;">',      
        confirmButtonText: 'REGISTRAR Y CANJEAR',
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve([
              $('#swal-input1').val(),
              $('#swal-input2').val()
            ])
          })
        },
        onOpen: function () {
          $('#swal-input1').focus()
        }
      }).then(function (result) {
        var data = {
          'ProductID': productID,
          'UserID': window.localStorage.getItem("sessionID"),
          'GoldenPoints': goldenPoints,
          'Address': result.value[1],
          'Email': window.localStorage.getItem("sessionEmail"),
          'Phone': result.value[2],
          'City': result.value[0],
          'ProductName': productName
        };
        $.post(SERVICES_HOST+"canjear.php", data)
        .done(function(submitResponse) {
          updateGoldenPoints();      
        }, 'json')
        .fail( function(xhr, textStatus, errorThrown) {     
          noInternetAction();        
        });
        swal("Listo, nos comunicaremos contigo en breve para coordinar la entrega. Gracias"); 
      }).catch(swal.noop)
    }
    else{
      swal({
        title: 'Atención!',
        text: 'No tienes los suficientes GoldenPoints para canjear este producto.',
        type: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  /*
  ====================================================================
  Mi Comunidad
  ====================================================================
  */
  function addFriend(){
    swal({
      title: 'Ingresa el E-Mail de tu amigo/a:',
      input: 'email',
      showCancelButton: true,
      confirmButtonText: 'Invitar',
      confirmButtonColor: 'rgb(18, 86, 8)',
      cancelButtonColor: '#000000',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        return new Promise((resolve) => {
          var data = {
            'Email': email,
            'ParentID': sessionID
          };
          $.post(SERVICES_HOST+"register_invite.php", data)
          .done(function(submitResponse) {
            if(submitResponse.success==1){
              loadFriends();
              resolve();
            }
            else{
              swal.showValidationError(
                submitResponse.error
              )
            }
          }, 'json')
          .fail( function(xhr, textStatus, errorThrown) {
            noInternetAction();
          });   
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        swal({
          type: 'success',
          title: 'MGD',
          html: 'Has invitado a ' + result.value+ ', debes esperar a que confirme su cuenta.'
        })
      }
    })
  }
  
  function addProducto(){
    swal({
      title: 'Ingresa el código del producto:',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      confirmButtonColor: 'rgb(18, 86, 8)',
      cancelButtonColor: '#000000',
      iconColor: '#FFF',
      showLoaderOnConfirm: true,
      preConfirm: (text) => {
        return new Promise((resolve,reject) => {
          var data = {
            'code': text,
            'userid': window.localStorage.getItem("sessionID")
          };
          $.post(SERVICES_HOST+"canjearCodigo.php", data)
          .done(function(submitResponse) {
            if(submitResponse.success=="1"){
              resolve();
              updateGoldenPoints();
            }
            else{
              reject('El código que ingresaste no es válido, por favor inténtalo de nuevo con otro código.');
            }
          }, 'json')
          .fail( function(xhr, textStatus, errorThrown) {     
            reject('Por favor inténtelo de nuevo más tarde.');  
          });
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        swal({
          type: 'success',
          title: 'MGD',
          html: 'Has agregado correctamente el código ' + result.value+ ', en unos momentos se actualizarán tus GOLDEN POINTS'
        })
      }
      else{
        swal({
          type: 'error',
          title: 'MGD',
          html: 'Por favor inténtelo de nuevo más tarde.'
        })
      }
    }).catch((error) => {
      swal({
        type: 'error',
        title: 'MGD',
        html: error
      })
    })
  }
  
  function updateGoldenPoints(){
    var data = {
      'UserID': window.localStorage.getItem("sessionID")
    };
    $.post(SERVICES_HOST+"getGoldenPoints.php", data)
    .done(function(submitResponse) {
      window.localStorage.setItem("sessionGoldenPoints",submitResponse.GoldenPoints);
      $('.user-goldenpoints').html(submitResponse.GoldenPoints);
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {     
      noInternetAction();        
    });
  }
  
  
  
  function updateGoldenPoints(){
    var data = {
      'UserID': window.localStorage.getItem("sessionID")
    };
    $.post(SERVICES_HOST+"getGoldenPoints.php", data)
    .done(function(submitResponse) {
      window.localStorage.setItem("sessionGoldenPoints",submitResponse.GoldenPoints);
      
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {     
      noInternetAction();        
    });
  }
  
  function displayGoldenPoints(){
    swal({
      title: 'MGD',
      text: 'Actualmente tienes '+window.localStorage.getItem("sessionGoldenPoints")+' GOLDEN POINTS',
      confirmButtonText: 'OK'
    });
  }
  
  
  function canjear(productID,goldenPoints,productName){
    
    
    
    if(goldenPoints<=window.localStorage.getItem("sessionGoldenPoints")){
      swal({
        title: 'REGISTRA LOS DATOS DE ENVIO',
        html:
        '<input id="swal-input1" class="swal2-input" placeholder="CIUDAD">' +
        '<input id="swal-input2" class="swal2-input" placeholder="DIRECCION" style="margin-top:-17px;">'+
        '<input id="swal-input3" class="swal2-input" placeholder="CELULAR" style="margin-top:-17px;">',
        
        confirmButtonText: 'REGISTRAR Y CANJEAR',
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve([
              $('#swal-input1').val(),
              $('#swal-input2').val()
            ])
          })
        },
        onOpen: function () {
          $('#swal-input1').focus()
        }
      }).then(function (result) {
        
        
        var data = {
          'ProductID': productID,
          'UserID': window.localStorage.getItem("sessionID"),
          'GoldenPoints': goldenPoints,
          'Address': result.value[1],
          'Email': window.localStorage.getItem("sessionEmail"),
          'Phone': result.value[2],
          'City': result.value[0],
          'ProductName': productName
        };
        
        
        $.post(SERVICES_HOST+"canjear.php", data)
        .done(function(submitResponse) {
          updateGoldenPoints();
          
        }, 'json')
        .fail( function(xhr, textStatus, errorThrown) {
          
          noInternetAction();        
        });
        
        
        swal("Listo, nos comunicaremos contigo en breve para coordinar la entrega. Gracias");
        
        
        
      }).catch(swal.noop)
      
      /*
      swal({
        type: 'error',
        title: 'MGD',
        html: 'No cuentas con suficientes GoldenPoints para canjear este artículo.'
      })*/
      
    }
    else{
      swal({
        title: 'Atención!',
        text: 'No tienes los suficientes GoldenPoints para canjear este producto.',
        type: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  
  
  function closeInfo(){
    $('.tutorial').fadeOut();
  }
  
  
  function showInfo(){
    $('.tutorial').fadeIn();
  }
  
  
  
  /*
  ------------------  MI COMUNIDAD ---------------------
  */
  function initMiComunidad(){
    
    



    //sessionID=50; //remover
    //sessionPicture='http://mgd.com.ec/uploads/avatars/50_0707182016_pic.jpg';  //remover
    //sets avatar picture
    $('.user-avatar').css('background-image',"url('"+sessionPicture+"')");
    //sets events for changing avatar
    $('.user-avatar').click(function(){
      //$("#avatar_uploader").click();
      navigator.camera.getPicture(
        function(imageData){
          //alert("success");
    //      var image = document.getElementById('imagenx');
    //image.src = "data:image/jpeg;base64," + imageData;
    //alert(imageData);
         // var image = document.getElementById('imagenx');
   // image.src = imageData;
          //$('.user-avatar').css('background-image',"url('data:image/jpeg;base64," + imageData + "')");
          //$('.user-avatar').css('background-image',"url('" + imageData + "')"); //----------
          //alert(imageData);
          //$("#avatar_uploader").attr("value",imageData);
          //document.getElementById("avatar_uploader").value=imageData;
          //alert(0);
          //if ($("#avatar_uploader").files && $("#avatar_uploader").files[0]) {
             /* var reader = new FileReader();
              reader.onload = function (e) {
                  //$('#imgLogo').attr('src', e.target.result);
                  //alert(e.target.result);
                  $('.user-avatar').css('background-image',"url('data:image/png;" + e.target.result + "')");
              }
              //reader.readAsDataURL($("#avatar_uploader").files[0]);
              reader.readAsDataURL(new File(imageData));


*/


           //   $('.user-avatar').css('background-image',"url('" + imageData + "')");
           
           $('.user-avatar').css('background-image',"url('data:image/jpeg;base64," + imageData + "')");
             // var file_data = request.response;   
                 // var form_data = new FormData();                  
                  //form_data.append('file', file_data);       
               //   form_data.append('file', new File(imageData));
                 //form_data.append("file", { uri: imageData, type: "image/png" });
                 
                 //form_data.append("image", { uri: imageData, name: 'image.jpg', type: 'image/jpg'});
                  //alert(form_data);                             
                 /* $.ajax({
                      url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
                      dataType: 'text',  // what to expect back from the PHP script, if anything
                      cache: false,
                      contentType: false,
                      processData: false,
                      data: form_data,                         
                      type: 'post',
                      success: function(php_script_response){
                        alert(php_script_response);
                          //alert(php_script_response); // display response from the PHP script, if any
                          window.localStorage.setItem("sessionPicture",php_script_response);
                          sessionPicture=php_script_response;
                      }
                  });*/

/*
                 $.ajax({
                    type: "POST",
                    url: SERVICES_HOST+"uploadAvatar2.php?userid="+sessionID,
                    //data: imageData,
                    data: { img_data:imageData},
                    cache: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (result) {
                      alert("upload OK: "+ result);
                    }
                  });

*/


                 /* $.ajax({
                    url: SERVICES_HOST+"uploadAvatar2.php?userid="+sessionID,
                    type: 'POST',
                    processData: false,
                    contentType: 'application/octet-stream',
                    data: makeblob('data:image/jpeg;base64,'+imageData)
                 })
                .done(function(data) {alert(data);})
                .fail(function() {alert("error");});
*/

                //var url = "url/action";                
                var image = $('#image-id').attr('src');
                //var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
                var blob = base64ToBlob(imageData, 'image/png');                
                var formData = new FormData();
                formData.append('file', blob);

                $.ajax({
                    url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, 
                    type: "POST", 
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: formData})
                        .done(function(e){
                            //alert(e);
                            ImgCache.cacheFile(e);
                        });

                  /*
                  $.post( SERVICES_HOST+"uploadAvatar2.php", {data: imageData}, function(data) {
                    alert("Image uploaded!");
                    alert("upload OK: "+ data);
                  });*/
/*
                  $.ajax({
                    url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
                    dataType: 'text',  // what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,                         
                    type: 'post',
                    success: function(php_script_response){
                      alert(php_script_response);
                        //alert(php_script_response); // display response from the PHP script, if any
                        window.localStorage.setItem("sessionPicture",php_script_response);
                        sessionPicture=php_script_response;
                    }
                });
*/

/*
var request = new XMLHttpRequest();
              request.open('GET', imageData, true);
              request.responseType = 'blob';
              request.setRequestHeader('Content-Type', 'image/jpeg');
              request.onload = function(ev) {


                  var reader = new FileReader();
                  reader.readAsDataURL(request.response);
                  reader.onload =  function(e){
                      //console.log('DataURL:', e.target.result);
                      //$('.user-avatar').css('background-image',"url('data:image/png;" + e.target.result + "')");
                  };


                  var arrayBufferView = new Uint8Array(request.response);
                  var blob = new Blob([arrayBufferView], {
                    type: "image/jpeg"
                  });
                  var urlCreator = window.URL || window.webkitURL;
                  var imageUrl = urlCreator.createObjectURL(blob);

                  var file_data = request.response;   
                  var form_data = new FormData();                  
                  form_data.append('file', file_data);
                  //alert(form_data);                             
                  $.ajax({
                      url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
                      dataType: 'text',  // what to expect back from the PHP script, if anything
                      cache: false,
                      contentType: false,
                      processData: false,
                      data: form_data,                         
                      type: 'post',
                      success: function(php_script_response){
                          //alert(php_script_response); // display response from the PHP script, if any
                          window.localStorage.setItem("sessionPicture",php_script_response);
                          sessionPicture=php_script_response;
                      }
                  });


              };
              request.send();

*/








              /*
              var request = new XMLHttpRequest();
              request.open('GET', imageData, true);
              request.responseType = 'blob';
              request.setRequestHeader('Content-Type', 'image/jpeg');
              request.onload = function() {
                  var reader = new FileReader();
                  reader.readAsDataURL(request.response);
                  reader.onload =  function(e){
                      //console.log('DataURL:', e.target.result);
                      $('.user-avatar').css('background-image',"url('data:image/png;" + e.target.result + "')");
                  };


                  var file_data = request.response;   
                  var form_data = new FormData();                  
                  form_data.append('file', file_data);
                  //alert(form_data);                             
                  $.ajax({
                      url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
                      dataType: 'text',  // what to expect back from the PHP script, if anything
                      cache: false,
                      contentType: false,
                      processData: false,
                      data: form_data,                         
                      type: 'post',
                      success: function(php_script_response){
                          //alert(php_script_response); // display response from the PHP script, if any
                          window.localStorage.setItem("sessionPicture",php_script_response);
                          sessionPicture=php_script_response;
                      }
                  });



              };
              request.send();
              */

















/*
              //uploads to server
              //var file_data = $('#avatar_uploader').prop('files')[0];  
              var file_data = imageData;   
              var form_data = new FormData();                  
              form_data.append('file', file_data);
              //alert(form_data);                             
              $.ajax({
                  url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
                  dataType: 'text',  // what to expect back from the PHP script, if anything
                  cache: false,
                  contentType: false,
                  processData: false,
                  data: form_data,                         
                  type: 'post',
                  success: function(php_script_response){
                      //alert(php_script_response); // display response from the PHP script, if any
                      window.localStorage.setItem("sessionPicture",php_script_response);
                      sessionPicture=php_script_response;
                  }
              });*/
          //}

        }, function(){
          //alert("fail");
        },
        {
            //destinationType: Camera.DestinationType.FILE_URI,
            destinationType:Camera.DestinationType.DATA_URL,
            //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            quality: 10,
            allowEdit: false,
            correctOrientation: true,  //Corrects Android orientation quirks
            popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
        });
        
        // Reposition the popover if the orientation changes.
        window.onorientationchange = function() {
            var cameraPopoverHandle = new CameraPopoverHandle();
            var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
            cameraPopoverHandle.setPosition(cameraPopoverOptions);
        }
    });
    $("#avatar_uploader").change(function () {
      if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              //$('#imgLogo').attr('src', e.target.result);
              //alert(e.target.result);
              $('.user-avatar').css('background-image',"url('data:image/png;" + e.target.result + "')");
          }
          reader.readAsDataURL(this.files[0]);
          //alert(this.files[0]);
          //uploads to server
          var file_data = $('#avatar_uploader').prop('files')[0];  
          //alert($('#avatar_uploader').prop('files')[0]); 
          var form_data = new FormData();                  
          form_data.append('file', file_data);
          //alert(form_data);                             
          /*$.ajax({
              url: SERVICES_HOST+"uploadAvatar.php?userid="+sessionID, // point to server-side PHP script 
              dataType: 'text',  // what to expect back from the PHP script, if anything
              cache: false,
              contentType: false,
              processData: false,
              data: form_data,                         
              type: 'post',
              success: function(php_script_response){
                  //alert(php_script_response); // display response from the PHP script, if any
                  window.localStorage.setItem("sessionPicture",php_script_response);
                  sessionPicture=php_script_response;
              }
          });*/
      }
  });
  }




  function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}



  


  function photoSelector(){
    var options = {
      //androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
      title: 'Imagen de perfil',
      //subtitle: 'Choose wisely, my friend', // supported on iOS only
      buttonLabels: ['Tomar Foto', 'Seleccionar de la Galería'],
      androidEnableCancelButton : true, // default false
      winphoneEnableCancelButton : true, // default false
      addCancelButtonWithLabel: 'Cancelar',
      position: [20, 40], // for iPad pass in the [x, y] position of the popover
    };
    window.plugins.actionsheet.show(options, function(buttonIndex) {
      setTimeout(function() {        
        switch(buttonIndex){// like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
          case 1:
            openCamera();
            break;
          case 2:
            openPhotoGallery();
            break;
        }
      });
    });
  }





  function loadFriends(){
    showLoader();
    //loads my Session info
    $('.user-info .user-name').html(sessionName+" "+sessionLastName);
    $('.user-info .user-city').html(sessionCiudad);
    //loads my friends from web service
    var data = {
      'parentid': sessionID
    };
    $.post(SERVICES_HOST+"getFriends.php", data)
    .done(function(submitResponse) {
      $('.user-amigos-count').html(submitResponse.amigos);
      $('.user-goldenpoints').html(submitResponse.goldenpoints);
      processFriends(submitResponse.data);
      window.localStorage.setItem("micomunidad_amigos", JSON.stringify(submitResponse.data));
      if(submitResponse.picture!='' && submitResponse.picture!=null && submitResponse.picture!=undefined){
        window.localStorage.setItem("sessionPicture",submitResponse.picture);
        
        
        sessionPicture=submitResponse.picture;

      
        ImgCache.isCached(sessionPicture, function(path, success) {
         
          if (success) {
            // already cached
            //ImgCache.useCachedFile(target);
            //alert("guardada previamente en cache");
            ImgCache.useCachedBackground($('.user-avatar'),function(){
              alert("callback"+$('.user-avatar').css('background-image'));
            });
            alert($('.user-avatar').css('background-image'));
          } else {
            // not there, need to cache the image
            ImgCache.cacheFile(sessionPicture, function () {
              //ImgCache.useCachedFile(target);
              //alert("no guardada en cache, se guarda ahorita");
              ImgCache.useCachedBackground($('.user-avatar'));
            });
          }
        });
     

        //$('.user-avatar').css('background-image',"url('"+sessionPicture+"')");
      }
      hideLoader();
    }, 'json')
    .fail( function(xhr, textStatus, errorThrown) {
      if(window.localStorage.getItem("micomunidad_amigos") !=null) {
        processFriends(JSON.parse(window.localStorage.getItem("micomunidad_amigos")));
      }
      hideLoader();
      noInternetAction();
    });
    
    updateGoldenPoints();
  }
  
  
  function processFriends(data){
    $('.micomunidad_amigos').empty();
    $('.micomunidad_amigos').append("<div class='row_col3' onclick='addFriend()'>  <img src='img/miller_friend_add.png' alt=''/>  <div class='name_friend add_new_label'>Add New</div>  </div>");
    $.each(data,function(key,obj){
      if(obj.Confirmed==0){
        $('.micomunidad_amigos').append("<div class='row_col3'> <img src='img/miller_friend_unconfirmed.png' alt=''/> <div class='name_friend'>"+obj.Name+" "+obj.LastName+"</div> </div>");
      }
      else{  //then its 1
        $('.micomunidad_amigos').append("<div class='row_col3'> <img src='img/miller_friend_confirmed.png' alt=''/> <div class='name_friend'>"+obj.Name+" "+obj.LastName+"</div> </div>");
      }
    });
  }
  
  
  
  
  
  
  
  /*
  ====================================================================
  BackButton
  ====================================================================
  */
  function back(){alert(actualPage);
    switch(actualPage) {
      case 'goldenstore':
      if(actualGoldenStoreSection=='info'){
        $('#goldenstore_item').hide();
        $('#goldenstore_list').show();
        actualGoldenStoreSection='list';
      }
      else if(actualGoldenStoreSection=='list'){
        $('#goldenstore_categories').show();
        $('#goldenstore_list').hide();
        $('#backbutton').css('visibility','hidden');
        actualGoldenStoreSection='categories';
      }
      else if(actualGoldenStoreSection=='categories'){
        if( platform!='IOS'){
          touchDrawer();
        } 
      }
      break;    
      case 'goldenlifestyle':
      if(actualLifeStyleSection=='info'){
        $('#goldenlifestyle_item').hide();
        $('#goldenlifestyle_list').show();
        actualLifeStyleSection='list';
        $('#backbutton').css('visibility','hidden');
      }
      else{
        if( platform!='IOS'){
          touchDrawer();
        } 
      }
      break;    
      case 'galeria':
      if( $('#backbutton').css('visibility')=='visible'){
        $('#links').hide();
        $('#albums').fadeIn();
        $('#backbutton').css('visibility','hidden');
      }        
      if( $('#backbutton').css('visibility')=='hidden' && platform!='IOS'){
        touchDrawer();
      }
      break;   
      default:
      if( platform!='IOS'){
        touchDrawer();
      }        
      break;
    }
  }