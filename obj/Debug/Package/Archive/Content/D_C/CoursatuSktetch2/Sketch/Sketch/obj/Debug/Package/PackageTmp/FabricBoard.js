/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/fabric.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/linq.js" />
/// <reference path="D:\CoursatuSktetch\Sketch\Sketch\Scripts/json-patch-duplex.js" />
var boardhub = $.connection.boardHub;
var modified = false;
var timeline = [];
var playMode = false;
var currentPlayerTime = 0;
var currentTimeLineIndex = 0;
//server
$(document).ready(function () {
    boardhub.client.broadcastCanvas = function (message, room) {

        var canvasJSON = JSON.parse(message);
        var currentjson = canvas.toJSON();
        var diff = jsonpatch.compare(currentjson, canvasJSON);

        jsonpatch.apply(currentjson, diff);
        canvas.loadFromJSON(canvasJSON);
        canvas.deactivateAll();
    }


    $.connection.hub.start().done(function () {
        alert("connection hub started");

    });
});

//end server






var starttime = new Date();



function ctool(tool) {
    currenttool = tool;

}
var uid = 0;
var slideid = 0;
var currentslide = 0;
var currentJSON = {};
var canvascontainer = $("#canvascontainer");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}




var canvas = new fabric.Canvas('canvas2');
canvas.selection = false;
window.addEventListener("resize", windowresize);

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
    boardctx.newslide(); var $box = $('#colorPicker');
    $box.tinycolorpicker();
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
var BoardSlide = (function (slideno) {
    this.SlideNo = slideno;
    this.initialCanvas = {};
    this.SlideHistories = [];

});
var Board = (function () {
    var slides = [];
    var currentslide;
    var boardFunctions = {
        newslide: function () {

            var slideboard = new BoardSlide(++slideid);
            if (!currentslide) {
                slideboard.initialCanvas = canvas.toJSON();
            }
            slides.push(slideboard);
            canvas.clear();
            $('#cbp-spmenu-s1').append('<a href="#" slide=' + slideid.toString() + ' onclick="boardctx.selectslide(' + slideid + ');"><div class="thumbnail"><img src=' + canvas.toDataURL() + ' alt="" /></div></a>');
            this.selectslide(slideid);
        },
        addslide: function (backgroundurl) {




            try {
                var img = new Image();
                img.crossOrigin = 'anonymous';

                img.src = backgroundurl;

                img.onload = function () {
                    var slideboard = new BoardSlide(++slideid);

                    var fimg = new fabric.Image(img);
                    fimg.setWidth(canvas.width);
                    fimg.setHeight(canvas.height);
                    canvas.setBackgroundImage(fimg, canvas.renderAll.bind(canvas));
                    canvas.renderAll();
                    slideboard.initialCanvas = canvas.toJSON();
                    slides.push(slideboard);
                    canvas.clear();
                    $('#cbp-spmenu-s1').append('<a href="#" slide=' + slideid.toString() + ' onclick="boardctx.selectslide(' + slideid + ');"><div class="thumbnail"><img src=' + canvas.toDataURL() + ' alt="" /></div></a>');
                    boardctx.selectslide(slideid);
                }
            } catch (wx) {
                alert(wx.message);
            }



        },
        getTimeLine: function () {
            var slide = Enumerable.From(slides).Select("$.SlideHistories ").ToArray();
            var merged = [].concat.apply([], slide);

            timeline = Enumerable.From(merged).OrderBy("$.time").ToArray();
            $('#divChatWindow').text(JSON.stringify(timeline));
        },
        playTimeLine() {
            playMode = true;

            //var currentTimeLine = Enumerable.From(timeline).First('$.time <  ' + currentTime);

            alert('start playing');
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

                //canvas.loadFromJSON(initialCanvas);

                //this.saveslidehistory();
            }
            canvas.loadFromJSON(JSON.stringify(initialCanvas), canvas.renderAll.bind(canvas));
            // setbgImage(initialCanvas.src);
            this.broadcast();
        },
        saveslidehistory: function () {

            if (currentslide) {

                var slidehistory = new SlideHistory(currentslide.SlideNo);

                var newJSON = canvas.toJSON();
                var diffrence = jsonpatch.compare(currentJSON, newJSON);
                var currenttime = new Date();

                var timestamp = (currenttime - starttime) / 100;
                slidehistory.canvas = diffrence;
                slidehistory.time = timestamp;
                currentslide.SlideHistories.push(slidehistory);
                $('a[slide=' + currentslide.SlideNo + ']').find('img').attr('src', canvas.toDataURL());
            }
            this.broadcast();
            this.getTimeLine();
        },
        broadcast: function () {


            boardhub.server.sendCanvas(JSON.stringify(canvas.toJSON()), room);
            modified = false;
        }

    };
    return boardFunctions;
});

//End UX Functions 


function boardTools(fillcolor, strokecolor, font, fontsize, fontstyle, isfill) {


    this.fillcolor = ko.observable(fillcolor || "#FFFFFF");

    this.isfill = ko.observable(isfill || false);
    this.strokecolor = ko.observable(strokecolor || "#FFFFFF");
    this.font = ko.observable(font || "");;
    this.fontsize = ko.observable(fontsize || 0);;
    this.fontstyle = ko.observable(fontstyle || "");;
}
function boardViewModel() {
    this.StyleTools = new boardTools("#FF0000", null, null, null, null, false);
}
var boardVM = new boardViewModel()
ko.applyBindings(boardVM);


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
        fill: boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent',
        width: 100,
        height: 100,
        stroke: !boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent'

    });
    canvas.add(rect);

}

function drawCircle(x, y) {
    var circle = new fabric.Circle({

        left: x - 50,
        top: y - 50,
        fill: boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent',
        radius: 50,
        stroke: !boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent'



    });
    canvas.add(circle);
}
function drawTriangle(x, y) {
    var triangle = new fabric.Triangle({

        left: x - 50,
        top: y - 50,
        fill: boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent',
        width: 100,
        height: 100,
        stroke: !boardVM.StyleTools.isfill() ? boardVM.StyleTools.fillcolor() : 'transparent'



    });
    canvas.add(triangle);

}
function drawText(x, y, text, foreground, background) {
    var text = new fabric.IText('Write Something', {

        fontFamily: 'adobe arabic',
        left: x,
        top: y,
        fill: boardVM.StyleTools.fillcolor()
    });
    text.on('editing:exited', function () {
        modified = true;
    });
    canvas.add(text);

}
function drawLine(points) {
    line = new fabric.Line(points, {

        strokeWidth: 5,
        fill: boardVM.StyleTools.fillcolor(),
        stroke: boardVM.StyleTools.fillcolor(),
        originX: 'center',
        originY: 'center'
    });
    canvas.add(line);
}
function showtooltip(option) {
    if (option.target) {
        var xpos = option.target.left + canvas._offset.left + option.target.width / 2;
        var ypos = option.target.top + canvas._offset.top - option.target.height - 10;

        $('.tooltip-content').css('top', ypos);
        $('.tooltip-content').css('left', xpos);

        $('.tooltip-content').addClass('showtooltip');

    }
}
canvas.on("object:modified", function (obj) {
    modified = true;
});
canvas.on("object:removed", function (obj) {
    modified = true;
});
canvas.on("object:selected", function (obj) {
    if (obj) {

    }
});
canvas.on("after:render", function () { canvas.calcOffset() });
canvas.on("object:added", function (options) {
    if (options.target) {

        var target = options.target;
        target.id = uid++;
        canvas.setActiveObject(target);
        canvas.renderAll();
        modified = true;
    }
});
canvas.on('mouse:up', function (options) {
    isDown = false;
    if (modified)
        boardctx.saveslidehistory();
    canvas.toDataURL("image/png");
});
$(document).mousemove(function () {
    if (currenttool != "pen") canvas.isDrawingMode = false;

});
canvas.on("mouse:move", function (options) {
    showtooltip(options);
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
canvas.on('mouse:down', function (options) {
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