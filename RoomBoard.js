/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts\fabric.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/linq.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/json-patch-duplex.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/lz-string-1.0.2.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/BSON.min.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/base64-string.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/gzip.js" /> 

/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/jsend-2.0.0.source.js" />

var boardhub = $.connection.boardHub;
var modified = false;
var created = false;
var timeline = [];
var playMode = false;
var currentPlayerTime = 0;
var currentTimeLineIndex = 0;
var loadingSlide = false;
var imglist = [];
var tempslides = [];
var canvascontainer = $('.canvascontainer');
var customProperties = 'slideid height width'.split(' ');
var remote = false;
var isfill = $('#isfill').is(':checked');

function sort_li(a, b) {
    return Number(($(b).attr('slide'))) < Number(($(a).attr('slide'))) ? 1 : -1;
}

function getUrls(canvasString) {
    var urlRegex = '/"(http://[^"]*?\.(jpg|png))"/g';
    return canvasString.replace(urlRegex, function (url) {
        alert(url);
    })


}

function addImage(imgurl) {

    if (!loadingSlide) {
        loadingSlide = true;
        boardctx.addslide('image', imgurl);
    } else {

        imglist.push(imgurl);

    }
}

function addImageList(imglist) {

    for (var i = 0; i < imglist.length; i++) {

        addImage(imglist[i]);

    }

}


$('#canvas2').resize(function () {
    alert($(this).height());

});

function updateFill() {
    isfill = $('#isfill').is(':checked');

    if (isfill) {

        // $('#bgColor').show();

        $("#bgColor *").attr("disabled", false).off('click');

    } else {
        // $('#bgColor').hide();
        $("#bgColor *").attr("disabled", true).off('click');

    }
    var obj = canvas.getActiveObject();
    if (obj) {
        if (isfill) {
            obj.setFill($('.colorInput').val());

        } else {
            obj.setFill('transparent');

        }
        canvas.renderAll();
    }

}

function onScroll() {
    alert('scrolling');

}
//server
$(document).ready(function () {
    var myIframe = document.getElementById('boardiframe');
    $('#boardiframe').load.onload = function () {
        alert($('#boardiframe').contents());
    }

  
    $('#isfill').load(function () {
        updateFill();

    });
    $('#isfill').click(updateFill());
});

//end server






var starttime = new Date();



function ctool(tool) {
    currenttool = tool;

}

var uid = 0;
var maxslideid = 0;
var currentslide = 0;
var currentJSON = {};
var scrollTimer = null;
var scrolltimeout = false;

$('#canvasouter').scroll(function () {
    var slide = boardctx.getCurrentSlide();
    if (slide && slide.Type == 'pdf') {

        var iframeId = '#slide' + slide.SlideNo;
        if ($(iframeId).length > 0) {
            var canvasScroll = $(this).scrollTop();

            $(iframeId).contents().find('body').scrollTop(canvasScroll);

            $('#divChatWindow').text('canvas height : ' + $('#canvas2').height() + '</br>iframe height : ' +

                $(iframeId).contents().find('body').height() + '</br>canvas top ' + $(this).scrollTop() + '<br/> iframe top ' + $(iframeId).contents().find('#viewerContainer').scrollTop()
            )

        }

    }
    scrollTimer = new Date();

    if (scrolltimeout === false) {
        scrolltimeout = true;
        setTimeout(handleScroll, 1500);
    }
});

function handleScroll() {

    console.log("scroll is handled");
    if (new Date() - scrollTimer < 500) {
        setTimeout(handleScroll, 500);
    } else {
        //alert($('#canvasouter').scrollTop());
        boardctx.saveslidehistory();
        scrolltimeout = false;
    }
}

 



var canvas = new fabric.Canvas('canvas2', {
    // stateful: false,
    // renderOnAddRemove: false
});
canvas.backgroundColor = "transparent";
var tempcanvas = new fabric.Canvas('tempcanvas');

canvas.selection = false;
window.addEventListener("resize", windowresize);
window.addEventListener("load", windowresize);

function windowresize() {
    canvas.setWidth(canvascontainer.width());
    var currentboard = boardctx.getCurrentSlide();
   
        canvas.setHeight(canvascontainer.height());
   
    $('.canvas-container').css('width', canvascontainer.width());
    $('.canvas-container').css('height', canvas.getHeight());
    $('#boardiframe').css('position', 'absolute');
    $('#boardiframe').css('top', '0px');
    $('#canvasouter').width($('.canvascontainer').width());
     
    canvas.renderAll();
    // canvas.calcOffset();

}


function preload(arrayOfImages) {

    $(arrayOfImages).each(function () {
        $('<img/>')[0].src = this;
    });
}


function init2() {
    windowresize();
    preload([
        '/icono_borrar.jpg',
        '../customcontrols/icono_borrar2.jpg',
        '../customcontrols/icono_escala_horizontal.jpg',
        '../customcontrols/icono_escala_oblicua.jpg',
        '../customcontrols/icono_escala_osblicua2.jpg',
        'home/imgicono_escala_vertical.jpg',
        '../customcontrols/icono_mover.jpg',
        '../customcontrols/icono_rotar.jpg',
        '../customcontrols/icono_rotar2.jpg',
        '../customcontrols/icono_rotar3.jpg',
        '../customcontrols/icono_rotar4.jpg'
    ]);
    //boardctx.newslide();

    var $box = $('#colorPicker');

}
 
//Start UX Functions 

 

 
//End UX Functions 


  
   

 
 