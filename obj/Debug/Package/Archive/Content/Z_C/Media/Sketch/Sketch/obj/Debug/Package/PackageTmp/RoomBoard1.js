﻿/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts\fabric.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/linq.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/json-patch-duplex.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/lz-string-1.0.2.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/BSON.min.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/base64-string.js" />
/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/gzip.js" /> 

/// <reference path="D:\CoursatuSktetch2\Sketch\Sketch\Scripts/jsend-2.0.0.source.js" />

var boardhub = $.connection.boardHub;
var modified = false;
var timeline = [];
var playMode = false;
var currentPlayerTime = 0;
var currentTimeLineIndex = 0;
var loadingSlide = false;
var tempslides = [];
var canvascontainer = $('.canvascontainer');

var isfill =$('#isfill').is(':checked');

function sort_li(a, b) {
    return ($(b).attr('slide')) < ($(a).data('slide')) ? 1 : -1;
}
function updateFill() {
    isfill = $('#isfill').is(':checked');
  
    if (isfill) {

       // $('#bgColor').show();

        $("#bgColor *").attr("disabled", false).off('click');

    }
    else {
       // $('#bgColor').hide();
        $("#bgColor *").attr("disabled", true).off('click');

    }
	var obj = canvas.getActiveObject();
	if (obj){
		if (isfill){
			obj.setFill($('.colorInput').val());
			
		}else{
			obj.setFill('transparent');
			
		}
		canvas.renderAll();
	}
	boardctx.saveslidehistory();
}

//server
$(document).ready(function () {
	function imgtosvg(){
	jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
    
        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
    $svg.attr('width',40);
	$svg.attr('height',40);
            // Replace image with new SVG
            $img.replaceWith($svg);
 
        }, 'xml');
    
    });
}
imgtosvg();
    
boardhub.client.broadcastCanvasJson = function (slides, room, slideid) {

    var lz = lzw_decode(slides);
    var canvasJson = JSON.parse(lz);
    canvas.loadFromJSON(canvasJson);



}
	
    boardhub.client.broadcastCanvas = function (slides, room, slideid) {


     //    var lz = lzw_decode(message);

         var canvasJSON = JSON.parse(slides);

        var slidehistories = [];

        boardctx.getSlide({}, slideid, slidehistories);
        canvas.deactivateAll();
    }

    boardhub.client.broadcastPatch = function (slides, room, slideid) {
        currentslide = Enumerable.From(boardctx.getAllSlides()).First(function (x) { return x.SlideNo == slideid });
        for (var i = 0 ; i < slides.length; i++)
            currentslide.SlideHistories.push(JSON.parse(slides[i]));
        boardctx.selectslide(slideid);
        canvas.deactivateAll();


    }

    boardhub.client.sendSlideSelection = function (slideNo) {

        boardctx.selectslide(slideNo);
    }

    function getSlide(initCanvas, SlideId, SlideHistories) {
        if (!loadingSlide) {
            loadingSlide = true;
            boardctx.getSlide(initCanvas, SlideId, SlideHistories);
        } else {

            var tempslide = { 'initCanvas': initCanvas, 'SlideId': SlideId, 'SlideHistory': SlideHistories };
            tempslides.push(tempslide);

        }
    }
    boardhub.client.sendCanvas = function (slideNo) {

        boardctx.broadcast(slideNo);
      //  e.log('broadcasting slide no : ' + slideNo);
    }
    boardhub.client.getSlides = function (roomSlides) {

        if (roomSlides.length == 0) {

            boardctx.newslide();
        }
        for (var i = 0; i < roomSlides.length; i++) {

            getSlide(roomSlides[i].initCanvas, roomSlides[i].SlideId, roomSlides[i].SlideHistory);

        }

    }

    $.connection.hub.start().done(function () {
        boardhub.server.getRoomSlides(room);

    });

    $('#isfill').load(function () {
        updateFill();

    });
    $('#isfill').click( updateFill());
}
);

//end server






var starttime = new Date();



function ctool(tool) {
    currenttool = tool;

}

var uid = 0;
var maxslideid = 0;
var currentslide = 0;
var currentJSON = {};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}




var canvas = new fabric.Canvas('canvas2');
var tempcanvas = new fabric.Canvas('tempcanvas');

canvas.selection = false;
window.addEventListener("resize", windowresize);
window.addEventListener("load", windowresize);

function windowresize() {
    canvas.setWidth(canvascontainer.width());
    canvas.setHeight(canvascontainer.height());
    canvas.renderAll();

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

} function convert_formated_hex_to_string(s) {
    var byte_arr = convert_formated_hex_to_bytes(s);
    var res = "";
    for (var i = 0 ; i < byte_arr.length ; i += 2) {
        res += String.fromCharCode(byte_arr[i] | (byte_arr[i + 1] << 8));
    }
    return res;
} function is_array(input) {
    return typeof (input) === "object" && (input instanceof Array);
}

//Start UX Functions 
function setbgImage(imgsrc) {
    var img = new Image();
    img.crossOrigin = 'anonymous';

    img.src = imgsrc;
    img.onload = function () {
        var fimg = new fabric.Image(img);
        fimg.setWidth(canvas.width);
        fimg.setHeight(canvas.height);
        canvas.setBackgroundImage(fimg, canvas.renderAll.bind(canvas));
        canvas.renderAll();

    }


}


var SlideHistory = (function (slideno) {
    this.canvas = {};
    this.time = 0;
    this.slideNo = slideno;

});
var mainlz = '';
var BoardSlide = (function (slideno) {
    this.SlideNo = slideno;
    this.initialCanvas = {};
    this.SlideHistories = [];
    this.Sent = false;

});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

var Board = (function () {
    var slides = [];
    var currentslide;
    var _bgColor = '#fff';
    var _isfill = true;
    var boardFunctions = {
        getAllSlides: function () {
            return slides;
        }
        ,
        getSlide: function (slide, slideNo, slidehistory) {

            var slideboard = new BoardSlide(slideNo);

            if (Enumerable.From(slides).Where(function (x) { return x.SlideNo == slideNo }).Count() > 0) {

                slideboard = Enumerable.From(slides).First(function (x) { return x.SlideNo == slideNo });
            }

            slideboard.SlideNo = slideNo;

            slideboard.initialCanvas = {};
            for (var i = 0; i < slidehistory.length; i++) {

                slideboard.SlideHistories.push(JSON.parse(slidehistory[i]));
            }

            slides.push(slideboard);
            canvas.clear();

            this.selectslide(slideNo);
        },
        newslide: function () {

            var slideboard = new BoardSlide((++maxslideid).toString());
            if (!currentslide) {
                //     slideboard.initialCanvas =[];// canvas.toJSON();
            }
            maxslideid = slideboard.SlideNo;
            slides.push(slideboard);
            canvas.clear();

            this.selectslide(maxslideid);
            this.saveslidehistory();
        },
        addslide: function (backgroundurl) {


            

            try {
                var img = new Image();
                img.crossOrigin = 'anonymous';
               
                img.src = backgroundurl;


                img.onload = function () {
                    var slideboard = new BoardSlide((++maxslideid).toString());

                    var fimg = new fabric.Image(img);
                    //fimg.setWidth(canvas.width);
                    //fimg.setHeight(canvas.height);
                    fimg.setWidth(canvas.getWidth());
                    //canvas.setWidth(fimg.width);
                    canvas.setHeight(fimg.height);
                    canvas.setBackgroundImage(fimg, canvas.renderAll.bind(canvas));
                    canvas.renderAll();
                    // slideboard.initialCanvas = canvas.toJSON();
                    slides.push(slideboard);
                    canvas.clear();
                    $('#cbp-spmenu-s1').append('<a href="#" slide=' + slideid.toString() + ' onclick="boardctx.selectslide(\'' + slideid + '\');"><div class="thumbnail"><img src=' + canvas.toDataURL() + ' alt="" /></div></a>');

                    boardctx.selectslide(maxslideid);
                    boardctx.saveslidehistory();
                }
            } catch (wx) {
                alert(wx.message);
            }



        },
        getTimeLine: function () {
            var slide = Enumerable.From(slides).Select("$.SlideHistories").ToArray();
            var merged = [].concat.apply([], slide);

            timeline = Enumerable.From(merged).OrderBy("$.time").ToArray();

        },
        settinycolor: function (elem, color) {
            var $color = $(elem);
            var $colorInput = $color.find('.colorInput');
             $color.find(".colorInner").css("backgroundColor", color);
           // if (elem=='#borderColor')
           // $color.css("border", color + " solid 3px");
            $colorInput.val(color);
           
        }
        ,
        setbackColor: function (color, isdefault) {

_bgColor=color;            
            this.settinycolor('#bgColor', color);
            if (canvas.getActiveObject()) {
           
                var obj = canvas.getActiveObject();
                if (isfill)
				obj.setFill(color);
                else
					obj.setFill('transparent');
                
			   obj.setStroke(color);
			  }
           else if (isdefault)
                _bgColor = color;

        },
   
	getstrokeColor:function(){
	return _bgColor;
	},
	
   getBackColor:function(){
            if (!isfill)
                return 'transparent';
            return _bgColor;

        },
        setisFill:function(fill,isdefault){
            if (isdefault)
            _isfill = fill;
            $('#isfill').prop('checked',fill);
            $('#isfill').trigger('change'); 
        },
        getisFill:function(){

            return _isfill;
        },
        playTimeLine() {
            playMode = true;

            //var currentTimeLine = Enumerable.From(timeline).First('$.time <  ' + currentTime);
            var timer = setInterval(function () {
                try {
                    currentPlayerTime += 50;

                    if (timeline.length > currentTimeLineIndex) {
                        var newTimeLine = timeline[currentTimeLineIndex];
                        if (newTimeLine.time >= currentPlayerTime / 100) {
                            currentTimeLineIndex++;

                            //     alert(newTimeLine.time + ' time : ' + currentPlayerTime);
                            var selectedSlide = Enumerable.From(slides).First('$.SlideNo ==  ' + newTimeLine.slideNo);
                            var selectedCanvas = selectedSlide.initialCanvas;
                            var patches = Enumerable.From(selectedSlide.SlideHistories).TakeWhile('$.time <=' + newTimeLine.time).ToArray();
                            for (var i = 0; i < patches.length; i++) {
                                jsonpatch.apply(selectedCanvas, patches[i].canvas);
                            }
                            canvas.loadFromJSON(selectedCanvas);
                        }


                    }
                    else {

                    }
                } catch (err) {
                    alert('error ' + err)
                }
            }, 1000);



        },
        updateThumbinal: function (slideid) {
            var thumbslide = Enumerable.From(slides).First(function (x) { return x.SlideNo == slideid });

            if ($('li[slide=' + slideid + ']').length == 0) {


                $('#slidemenu').append('<li  slide=' + slideid + ' onclick="boardctx.selectslide(\'' + slideid + '\');boardctx.broadcast();"  class="small-board" ><figure><img src=' + canvas.toDataURL() + ' alt="" /></figure></li>');
                $("#slidemenu li").sort(sort_li).appendTo('#slidemenu');
                maxslideid = Number($('#slidemenu li:last').attr('slide'));

            }
            $('li[slide=' + slideid + ']').find('img').attr('src', canvas.toDataURL());

            if (tempslides.length > 0) {
                var tempslide = tempslides.shift();
                this.getSlide(tempslide.SlideId, tempslide.SlideId, tempslide.SlideHistory);


            }
            else {
                loadingSlide = false;

            }
        }
        ,
        selectslide: function (slideid) {


            currentslide = Enumerable.From(slides).First(function (x) { return x.SlideNo == slideid });
            canvas.clear();
            // alert(currentslide.SlideNo +'  '+JSON.stringify( currentslide.initialCanvas));
            var initialCanvas = currentslide.initialCanvas;
            if (currentslide.SlideHistories.length > 0) {


                for (var i = 0; i < currentslide.SlideHistories.length; i++) {
                    jsonpatch.apply(initialCanvas, currentslide.SlideHistories[i].canvas);

                }
                var lasthistory = Enumerable.From(currentslide.SlideHistories).Last();

                canvas.loadFromJSON(initialCanvas);

                //        this.saveslidehistory();
            }
            canvas.loadFromJSON(JSON.stringify(initialCanvas), function () {
                canvas.renderAll.bind(canvas);
                boardctx.updateThumbinal(slideid);

                // boardctx.broad();

            });
            // setbgImage(initialCanvas.src);
        },
        saveslidehistory: function () {
            setTimeout(function () {

                if (currentslide) {

                    var slidehistory = new SlideHistory(currentslide.SlideNo);

                    var newJSON = canvas.toJSON();
                    var newjsonstr = JSON.stringify(newJSON);
                    var diffrence = jsonpatch.compare(currentJSON, newJSON);
                    var currenttime = new Date();

                    var timestamp = (currenttime - starttime) / 100;
                    slidehistory.canvas = diffrence;
                    slidehistory.time = timestamp;
                    currentslide.SlideHistories.push(slidehistory);
                    boardctx.updateThumbinal(currentslide.SlideNo);

                    // this.broadcast();
                  //  if (currentslide.SlideHistories.length <= 1)
                        boardctx.broadcast();
                    //else {
                      //  boardctx.broadcastPatch();
                    //}

                    //          this.getTimeLine();
                }
            }, 0);

        },
      
        broadcast: function (slideNo) {//initCanvas, room, SlideNo, SlideHistories, length) {

            setTimeout(function () {
                 var jsonstring = JSON.stringify(canvas.toJSON());
               var lz = lzw_encode(jsonstring); // LZString.compressToUTF16(jsonstring);


               
// var lz = lzw_encode(slidehstories); // LZString.compressToUTF16(jsonstring);

 //alert(JSON.stringify( slidehstories).length+'   '+lz.length);
				  boardhub.server.send(room, slideNo, lz);

                    modified = false;
               
            }, 0);


            //$('#divChatWindow').text(canvas.toDataURL());
        }

    };
    return boardFunctions;
});

//End UX Functions 


var img = new Image();
img.onload = function () {
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0
    });
};
img.src = "../../content/board.jpg"

var isDown = false;
var line;
function drawRectangle(x, y) {

    var rect = new fabric.Rect({

        left: x - 50,
        top: y - 50,
        fill: boardctx.getBackColor(),
        width: 100,
        height: 100,
        stroke: boardctx.getstrokeColor()

    });
    canvas.add(rect);

}

function drawCircle(x, y) {
    var circle = new fabric.Circle({

        left: x - 50,
        top: y - 50,
        fill: isfill?  boardctx.getBackColor():'transparent',
        radius: 50,
        stroke : boardctx.getstrokeColor()



    });
    canvas.add(circle);
}
function drawTriangle(x, y) {
    var triangle = new fabric.Triangle({

        left: x - 50,
        top: y - 50,
        fill: 'transparent',
        width: 100,
        height: 100,
        stroke: 'red'



    });
    canvas.add(triangle);

}
function drawText(x, y, text, foreground, background) {
    var text = new fabric.IText('Write Something', {

        fontFamily: 'adobe arabic',
        left: x,
        top: y,
        fill: boardctx.getstrokeColor()
    });
    text.on('editing:exited', function () {
        modified = true;
    });
    canvas.add(text);

}
function drawLine(points) {
    line = new fabric.Line(points, {

        strokeWidth: 5,
        fill: 'red',
        stroke: 'red',
        originX: 'center',
        originY: 'center'
    });
    canvas.add(line);
}

canvas.on('object:selected', function (obj) { 

    var target = obj.target;
	
	if (target.get('type')=='path'){
	
	return;
	}
    var fill = target.getFill() ?target.getFill(): target.fill ;
    var stroke = target.getStroke()?target.getStroke() : target.fill;
	
	
     var isobjfill =  fill!='transparent';
	 
		 boardctx.setisFill(isobjfill);
	
     boardctx.setbackColor(stroke);
		 
	 
    //   alert(obj.target.getFill());
});
canvas.on("object:modified", function (obj) {

    modified = true;
});
canvas.on("object:removed", function (obj) {
    modified = true;
});
canvas.on("object:added", function (options) {
    if (options.target) {

        var target = options.target;
        
        target.id = uid++;
        if (!canvas.isDrawingMode)
        canvas.setActiveObject(target);
        //canvas.renderAll();
        modified = true;
    }
});
canvas.on('mouse:up', function (options) {
    isDown = false;
    if (modified)
        boardctx.saveslidehistory();
    //canvas.toDataURL("image/png");
});

canvas.on("mouse:move", function (options) {
    // showtooltip(options);
    if (isDown) {
        return;
    }
    switch (currenttool) {
        case "line":
            if (!isDown) return;
            var pointer = options.e;
            //canvas.selection = false;
            line.set({ x2: pointer.x - canvas._offset.left, y2: pointer.y - canvas._offset.top });
            canvas.renderAll();
            break;
    }
});
canvas.on('after:selection:cleared', function () {
    boardctx.setbackColor(boardctx.getBackColor(), true);
 

});
canvas.on('mouse:down', function (options) {

    if (currenttool == 'pen') {
        canvas.isDrawingMode = true;
        return;
    } else {

        canvas.isDrawingMode = false;
    }
    isDown = isDown ? false : true;
    var pointer = canvas.getPointer(options.e);
    var xpos = options.e.clientX - canvas._offset.left;
    var ypos = options.e.clientY - canvas._offset.top;

    var points = [xpos, ypos, xpos, ypos];

    switch (currenttool) {
        case "rectangle":
            drawRectangle(xpos, ypos);
            currenttool = "select";
            break;
        case "circle":
            drawCircle(xpos, ypos);
            currenttool = "select";
            break;
        case "triangle":
            drawTriangle(xpos, ypos);
            currenttool = "select";
            break;
        case "line":
            drawLine(points);

            break;
        case "text":
            drawText(xpos, ypos, "Sample Text", null, null);
            currenttool = "select";
            break;
        case "pen":
            canvas.isDrawingMode = true;

    }


});



var boardctx = new Board;



var currenttool = 'select';