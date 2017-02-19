function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var isbroadcaster = ismain;
var video_out = document.getElementById("camera");

var here_now = document.getElementById('here-now');

var end_stream = document.getElementById('end');

var streamName;

function stream(form) {
    streamName = room;
    var phone = window.phone = PHONE({
        number: streamName, // listen on username line else random
        publish_key: 'pub-c-e2373b33-72dd-49bd-96f9-156c3baefd03', // Your Pub Key
        subscribe_key: 'sub-c-4b039cba-6f2c-11e5-8a11-0619f8945a4f', // Your Sub Key
        oneway: true,
        broadcast: true,
          ssl : (('https:' == document.location.protocol) ? true : false)

    });
    //phone.debug(function(m){ console.log(m); })
    var ctrl = window.ctrl = CONTROLLER(phone);
    ctrl.ready(function () {

        //		form.stream_submit.hidden="true"; 
        ctrl.addLocalStream(video_out);
        ctrl.stream();


    });


    return false;
}
if (isbroadcaster == 'True') {
    stream(null);
} else {

    watch(null);
}
function watch(form) {
    var num = room;
    var phone = window.phone = PHONE({
        number: "Viewer" + Math.floor(Math.random() * 100), // listen on username line else random
        publish_key: 'pub-c-e2373b33-72dd-49bd-96f9-156c3baefd03', // Your Pub Key
        subscribe_key: 'sub-c-4b039cba-6f2c-11e5-8a11-0619f8945a4f', // Your Sub Key
        oneway: true,
        ssl: (('https:' == document.location.protocol) ? true : false)
    });
    var ctrl = window.ctrl = CONTROLLER(phone);
    ctrl.ready(function () {
        ctrl.isStreaming(num, function (isOn) {
            if (isOn) ctrl.joinStream(num);
            else alert("User is not streaming!");
        });

    });
    ctrl.receive(function (session) {
        session.connected(function (session) {
            video_out.appendChild(session.video);


        });
        session.ended(function (session) { addLog(session.number + " has left."); });
    });

    return false;
}



function end() {
    if (!window.phone) return;
    ctrl.hangup();
    video_out.innerHTML = "";
    //	phone.pubnub.unsubscribe(); // unsubscribe all?
}


function errWrap(fxn, form) {
    try {
        return fxn(form);
    } catch (err) {
        alert("WebRTC is currently only supported by Chrome, Opera, and Firefox");
        return false;
    }
}