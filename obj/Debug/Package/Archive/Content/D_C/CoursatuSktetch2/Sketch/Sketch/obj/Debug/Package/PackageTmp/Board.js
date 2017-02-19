
var fillcolor = "white";

 
var currentText = '';
var _currentImage = '';
function ctool(tool) {
    currenttool = tool;
}
var currenttool = 'select';

var prevTool = 'select';
function selectshape() {
    prevTool = currenttool;
    currenttool = "select";
    
    
}


selectshape();
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var board = (function (window) {

    var crayonBackgroundImage = new Image();

    crayonBackgroundImage.src = "../images/crayon-background.png";
    var currentId = 0;
    var currentList = [];
    var boxes2 = [];
    var selectionHandles = [];
    var currentImage = new Image();
    currentImage.src = "";
    var canvas;
    var ctx;
    var WIDTH;
    var HEIGHT;
    var INTERVAL = 2;
    var isDrag = false;
    var isResizeDrag = false;
    var expectResize = -1;
    var mx, my;
    var canvasValid = false;
    var shadowSel = null;
    var mySel = null;
    var mySelColor = '#CC0000';
    var mySelWidth = 3;
    var mySelBoxColor = 'darkred';
    var mySelBoxSize = 7;
    var ghostcanvas;
    var currentbox = null;
    var gctx;
    var signal;
    var offsetx, offsety;
    var currentpaths = [];
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

    var Box2 = (function () {
        this.x = 0; this.y = 0; this.w = 4; this.h = 1; this.fill = '#fff';
        this.index = -1;
        this.tool = currenttool;
        this.stroke = fillcolor;
        this.deleted = false;
        this.canresize = true;
        this.index = 0;
        this.paths = [];
        if (this.index = -1) {
            var _id = currentId++;
            currentList.push(_id);
        }

        var retObject = {
            draw: function (context, optionalColor) {
                if (this.x + this.w == 3)
                    return;
                 
                if (context === gctx)
                { context.fillStyle = 'black'; }
                else { context.fillStyle = this.fill; context.strokeStyle = "yellow"; context.lineWidth = 3; }
                if (this.x > WIDTH || this.y > HEIGHT)
                    return;
                if (this.x + this.w < 0 || this.y + this.h < 0) return;
                context.beginPath();

                if (this.tool == 'rectangle') {
                    context.fillRect(this.x, this.y, this.w, this.h);
                }
                else if (this.tool == "circle") {
                    context.arc(this.x + (this.w / 2), this.y + (this.w / 2), this.w / 2, 0, 2 * Math.PI, true);
                    this.h = this.w;
                }
                else if (this.tool == "image") {
                    try {
                        var newImage = new Image();
                        newImage.crossOrigin = 'anonymous';
                        if (this.fill == 'white')
                            this.fill = _currentImage;

                        newImage.src = this.fill;
                        context.drawImage(newImage, this.x, this.y, this.w, this.h);

                    } catch (ex) {


                    }

                }
                else if (this.tool == "pen1") {
                    context.fillStyle = this.fill;
                    context.moveTo(this.paths[0].x, this.paths[0].y);
                   
                    for (var i = 0; i < this.paths.length; i++) {
                        context.lineTo(this.paths[i].x, this.paths[i].y);
                    }
                    context.closePath();
                    context.fill();
                    ctx.stroke();
                }
                else if (this.tool == "text") {

                    context.lineStyle = "#ffff00";
                    if (this.stroke == 'white')
                        this.stroke = $('#input-16').val();
                    $('.input__field').val('');
                    context.font = "35px Georgia ";
                    if (this.w < 200) this.w = 200;
                    context.fillText(this.stroke, this.x + 20, this.y + 30, this.w, 100);




                }
                else if (this.tool == "pen") {
       

                    DrawPen(this.paths, this.x, this.y, this.stroke);

                }
                context.lineWidth = 4;

                context.lineTo(this.x, this.y);
                context.fill();
                if (shadowSel === this && currenttool == "select") {
                    if (shadowSel == mySel) {
                        shadowSel = null;
                    }
                    context.strokeStyle = "#eee";
                    context.lineWidth = mySelWidth;
                    context.strokeRect(this.x, this.y, this.w, this.h);
                    var half = mySelBoxSize / 2;
                    selectionHandles[0].x = this.x - half;
                    selectionHandles[0].y = this.y - half;
                    selectionHandles[1].x = this.x + this.w / 2 - half;
                    selectionHandles[1].y = this.y - half;
                    selectionHandles[2].x = this.x + this.w - half;
                    selectionHandles[2].y = this.y - half;
                    selectionHandles[3].x = this.x - half;
                    selectionHandles[3].y = this.y + this.h / 2 - half;
                    selectionHandles[4].x = this.x + this.w - half;
                    selectionHandles[4].y = this.y + this.h / 2 - half;
                    selectionHandles[6].x = this.x + this.w / 2 - half;

                    selectionHandles[6].y = this.y + this.h - half;
                    selectionHandles[5].x = this.x - half;
                    selectionHandles[5].y = this.y + this.h - half;
                    selectionHandles[7].x = this.x + this.w - half;
                    selectionHandles[7].y = this.y + this.h - half;
                    context.fillStyle = "orange";

                    for (var i = 0; i < 8; i++) {
                        var cur = selectionHandles[i];
                        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
                    }
                }
                if (mySel === this && currenttool == "select") {

                    context.strokeStyle = "darkgreen";
                    context.lineWidth = mySelWidth;
                    context.strokeRect(this.x, this.y, this.w, this.h);
                    var half = mySelBoxSize / 2;
                    selectionHandles[0].x = this.x - half;
                    selectionHandles[0].y = this.y - half;
                    selectionHandles[1].x = this.x + this.w / 2 - half;
                    selectionHandles[1].y = this.y - half;
                    selectionHandles[2].x = this.x + this.w - half;
                    selectionHandles[2].y = this.y - half;
                    selectionHandles[3].x = this.x - half;
                    selectionHandles[3].y = this.y + this.h / 2 - half;
                    selectionHandles[4].x = this.x + this.w - half;
                    selectionHandles[4].y = this.y + this.h / 2 - half;
                    selectionHandles[6].x = this.x + this.w / 2 - half;

                    selectionHandles[6].y = this.y + this.h - half;
                    selectionHandles[5].x = this.x - half;
                    selectionHandles[5].y = this.y + this.h - half;
                    selectionHandles[7].x = this.x + this.w - half;
                    selectionHandles[7].y = this.y + this.h - half;
                    context.fillStyle = "darkorange";
                    for (var i = 0; i < 8; i++) {
                        var cur = selectionHandles[i];
                        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
                    }
                }
            }
        };
        return retObject;
    });


    function addRect(x, y, w, h, fill, stroke, tool, path, resize, outside) {

        var rect = new Box2;
        rect.canresize = resize;
        rect.x = x;
        rect.y = y;
        rect.w = w
        rect.h = h;
        rect.stroke = stroke;
        rect.fill = fill;
        rect.deleted = false;
        rect.tool = tool;
        rect.paths = path;
        rect.index = boxes2.length;
        boxes2.push(rect);
        if (outside == false)
            signal.server.send(rect, '@ViewBag.Room');

        invalidate();
    }



    $(document).ready(function () {
        var chat = $.connection.boardHub;
        signal = chat;
        chat.client.broadcastMessage = function (message, room) {
            //                      alert(message);
            if (room == '@ViewBag.Room') {
                var rect = message;
                boxes2 = [];
                mainDraw();
                //if (currentList.indexOf(rect.index)==-1) {
                for (var i = 0 ; i < rect.length; i++) {


                    if (!rect[i].deleted)
                        var newrect = addRect(rect[i].x, rect[i].y, rect[i].w, rect[i].h, rect[i].fill, rect[i].stroke, rect[i].tool, rect[i].paths, rect[i].canresize, true);
                }

                invalidate();
            }
        }

        $.connection.hub.start().done(function () {


        });
    });
    function init2() {

        selectshape();

        canvas = document.getElementById('canvas2');
        canvas.height = $(document).height();
        canvas.width = $(document).width();
        HEIGHT = canvas.height;
        WIDTH = canvas.width;
        ctx = canvas.getContext('2d');
        ghostcanvas = document.createElement('canvas');
        ghostcanvas.height = HEIGHT;
        ghostcanvas.width = WIDTH;
        gctx = ghostcanvas.getContext('2d');
        canvas.onselectstart = function () { return false; }//

        if (document.defaultView && document.defaultView.getComputedStyle) {
            stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
            stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
            styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
            styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
        }
        setInterval(mainDraw, INTERVAL);
        canvas.onmousedown = myDown;

        canvas.onmouseup = myUp;
        canvas.ondblclick = myDblClick;
        canvas.onmousemove = myMove;

        for (var i = 0; i < 8; i++) {
            var rect = new Box2;
            selectionHandles.push(rect);

        }

    }
    function clear(c) {
        c.clearRect(0, 0, WIDTH, HEIGHT);

    }
    function mainDraw() {

        if (canvasValid == false) {
            clear(ctx);

            var l = boxes2.length;
            for (var i = 0; i < l; i++) {
                if (!boxes2[i].deleted) {
                    boxes2[i].draw(ctx);
                }
            }//
            canvasValid = true;

        }
    }
    function DrawImmage(imagesrc) {
        var imageObj = new Image();
        imageObj.crossOrigin = 'anonymous';
        imageObj.onload = function () {
            ctx.drawImage(imageObj, 0, 0);
        };
        imageObj.src = imagesrc;
    }
    function DrawPen(path, x, y, color) {
         
        if (path != undefined)
            if (path.length < 1)
                return;
        ctx.strokeStyle = color;


        ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(path[1].x + x, path[1].y + y);
    //  alert(currentpaths.length);
        for (var j = 1; j < path.length; ++j) {

            //ctx.rec(path[j].x + x, path[j].y + y);
            ctx.fillRect(path[j].x + x, path[j].y + y, 5, 5);
        }

        ctx.stroke();
        ctx.closePath();
    }

    function updatebox(box) {
        try {
            signal.server.send(box, '@ViewBag.Room');
        }
        catch (err) {
            alert(err);

        }
    }
    function myMove(e) {
        if (!isDrag && currenttool == "select" && mySel == null) {
            getMouse(e);

            if (expectResize !== -1) {
                isResizeDrag = true;
                return;
            }
            clear(gctx);
            var l = boxes2.length;
            var found = false;

            for (var i = l - 1; i >= 0; i--) {
                shadowSel = null;
                boxes2[i].draw(gctx, 'black');
                var imageData = gctx.getImageData(mx, my, 1, 1);
                var index = (mx + my * imageData.width) * 4;
                if (imageData.data[3] > 0) {
                    shadowSel = boxes2[i];
                    found = true;
                    $('#divChatWindow').html('found ' + i.toString());

                    if (currenttool == "delete") {
                        boxes2[i].deleted = true;
                    }
                    currentbox = i;
                    offsetx = mx - shadowSel.x;
                    offsety = my - shadowSel.y;
                    shadowSel.x = mx - offsetx;
                    shadowSel.y = my - offsety;
                    isDrag = false;
                    invalidate();
                    clear(gctx);
                    return;

                }
            }

        }
        if (isDrag) {
            getMouse(e);
            if (mySel != null) {
                mySel.x = mx - offsetx; mySel.y = my - offsety; invalidate();
            }
            if (currenttool == "pen" && isDrag) {
                pos = getMouse(e);
                currentpaths.push(pos); // Append point tu current path.
                DrawPen(currentpaths, 0, 0);
            }
        } else if (isResizeDrag) {
            var oldx = mySel.x; var oldy = mySel.y;
            switch (expectResize) {
                case 0: mySel.x = mx;
                    mySel.y = my;
                    mySel.w += oldx - mx;
                    mySel.h += oldy - my;
                    break; case 1: mySel.y = my;
                        mySel.h += oldy - my; break;
                case 2: mySel.y = my;
                    mySel.w = mx - oldx;
                    mySel.h += oldy - my;
                    break; case 3: mySel.x = mx;
                        mySel.w += oldx - mx; break
                        ; case 4: mySel.w = mx - oldx;
                            break;
                case 5: mySel.x = mx;
                    mySel.w += oldx - mx;
                    mySel.h = my - oldy;
                    break; case 6:
                        mySel.h = my - oldy;
                        break; case 7: mySel.w = mx - oldx; mySel.h = my - oldy; break;
            }
            invalidate();
        }
        getMouse(e);

        if (mySel !== null && !isResizeDrag) {
            if (boxes2[currentbox] != undefined) {
                if (boxes2[currentbox].canresize) {
                    for (var i = 0; i < 8; i++) {
                        var cur = selectionHandles[i];
                        if (mx >= cur.x && mx <= cur.x + mySelBoxSize && my >= cur.y && my <= cur.y + mySelBoxSize) {
                            expectResize = i; invalidate();
                            switch (i) {
                                case 0: this.style.cursor = 'nw-resize';
                                    break; case 1: this.style.cursor = 'n-resize'; break;
                                case 2: this.style.cursor = 'ne-resize'; break;
                                case 3: this.style.cursor = 'w-resize'; break;
                                case 4: this.style.cursor = 'e-resize'; break;
                                case 5: this.style.cursor = 'sw-resize'; break;
                                case 6: this.style.cursor = 's-resize'; break;
                                case 7: this.style.cursor = 'se-resize'; break;
                            }
                            return;

                        }
                    }
                }
            }
            isResizeDrag = false;
            expectResize = -1;
            this.style.cursor = 'auto';
        }

    }
    function myDown(e) {
        var param = getParameterByName('main');

        if (param == 'true') {
            if (currenttool == "pen") {
                var pos = getMouse(e);

                isDrag = true;
                currentpaths.push([pos]);



            }
            else if (currenttool == "select" || currenttool == "delete") {
                getMouse(e);
                if (expectResize !== -1) {
                    isResizeDrag = true;
                  
                    return;
                }
                clear(gctx);
                var l = boxes2.length;
                for (var i = l - 1; i >= 0; i--) {
                    boxes2[i].draw(gctx, 'black');
                    var imageData = gctx.getImageData(mx, my, 1, 1);
                    var index = (mx + my * imageData.width) * 4; if (imageData.data[3] > 0) {

                        mySel = boxes2[i];

                        if (currenttool == "delete") {

                            boxes2[i].deleted = true;
                        }
                        currentbox = i;
                        offsetx = mx - mySel.x;
                        offsety = my - mySel.y;
                        mySel.x = mx - offsetx;
                        mySel.y = my - offsety;
                        isDrag = true;
                        invalidate();
                        clear(gctx);
                        return;
                    }
                }

            }


            else {
                myDblClick(e);
                return;
            }
            mySel = null;

            currentbox = null;
            clear(gctx);
            invalidate();
        }
    }

    function myUp(e) {
        if (mySel != null) {


            updatebox(boxes2);
        }

        isDrag = false;
        isResizeDrag = false;
        expectResize = -1;
        if (currenttool == "pen") {
           
            var x = currentpaths[1].x;
            var y = currentpaths[1].y;
            var x2 = currentpaths[1].x;
            var y2 = currentpaths[1].y;

            for (var j = 1; j < currentpaths.length; ++j) {
                if (currentpaths[j].x < x)
                    x = currentpaths[j].x;
                if (currentpaths[j].y < y)
                    y = currentpaths[j].y;
                if (currentpaths[j].x > x2)
                    x2 = currentpaths[j].x;
                if (currentpaths[j].y > y2)
                    y2 = currentpaths[j].y;
            }

            var width = x2 - x;
            var height = y2 - y;
            var pos = getPosition(x, y);
            for (var j = 0; j < currentpaths.length; j++) {
                currentpaths[j].x -= x;
                currentpaths[j].y -= y;
            }
            mySel = addRect(pos.x, y, width, height, 'transparent', fillcolor, currenttool, currentpaths, false, false);
           
            if (currenttool != "pen")
                selectshape();
            currentpaths = [];
            updatebox(boxes2);

        }

    }
    function myDblClick(e) {
        getMouse(e);
        var width = 50;
        var height = 50;

        addRect(mx - (width / 2), my - (height / 2), width, height, fillcolor, fillcolor, currenttool, null, true, false);
        selectshape();
        myDown(e);
    }

    function invalidate() {
        canvasValid = false;
    }
    function getPosition(px, py) {

     
        var element = canvas, offsetX = 0, offsetY = 0;
        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            }
            while ((element = element.offsetParent));
        }
        offsetX += stylePaddingLeft;
        offsetY += stylePaddingTop;
        offsetX += styleBorderLeft;
        offsetY += styleBorderTop;
        mx = px - offsetX;
        my = py - offsetY
        return {
            x: mx,
            y: my
        };
    }
    function getMouse(e) {
         
       // $("#divChatWindow").html(JSON.stringify(boxes2));
        var element = canvas, offsetX = 0, offsetY = 0;
        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            }
            while ((element = element.offsetParent));
        }
        offsetX += stylePaddingLeft;
        offsetY += stylePaddingTop;
        offsetX += styleBorderLeft;
        offsetY += styleBorderTop;
        mx = e.pageX - offsetX;
        my = e.pageY - offsetY
        return {
            x: mx,
            y: my
        };
    }
    window.init2 = init2;
}
)(window);