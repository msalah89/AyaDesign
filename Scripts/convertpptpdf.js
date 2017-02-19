var convertAPIs = [

    'https://do.convertapi.com/PowerPoint2Image',
    //'https://do.convertapi.com/Lotus2Image',
    //'https://do.convertapi.com/SnapShot2Image',

    'https://do.convertapi.com/Pdf2Image',
    //'https://do.convertapi.com/Xps2Image',
    //'https://do.convertapi.com/Word2Image',
    //'https://do.convertapi.com/RichText2Image',
    //'https://do.convertapi.com/Publisher2Image',
    //'https://do.convertapi.com/Excel2Image',
    //'https://do.convertapi.com/Text2Image',
    //'https://do.convertapi.com/OpenOffice2Image',
    //'https://do.convertapi.com/Email2Image',

];

//Configuration map ext -> {'apiUrl' : url, 'outputFormats' : [ext1, ext2, ...]}
var convertConfig = false;


// onload :)
$(document).ready(function() {

    getImagesDemo();
    $('#file').change(function() {

        onFileSelect();
    });

    function addSlide(slide) {

        boardctx.addslide('image', slide);




    }

    $('#addslides').click(function() {

        var slidearray = $('#slidepicker').val().toString().split(',');
        addImageList(slidearray);
        if (slidearray.length > 0) {

            // myLoop();
        }
        // addSlide(slidearray[i]);
        // boardctx.addslide(slidearray[i]);


    });

    $('#form').submit(function(event) {
        event.preventDefault();
        convertFile();
    });

});


/**
 * Browser support check
 */
function checkBrowser() {

    if (!window.FormData) {
        return false;
    }



    return false;
}


/**
 * File selection handler
 * Load config if required and fill select control for step2
 */
function onFileSelect() {

    var filename = $('#file').val();
    var ext = filename.substr(filename.indexOf('.', filename) + 1);
    if (!ext) {
        alert('Can not convert selected file: converted file should have extension');
        return;
    }

    if (convertConfig) {
        selectFormat(ext);
    } else {
        loadConvertConfig(0, function() {
            selectFormat(ext);
        });
    }
}

//Select available formats for conversion
function selectFormat(ext) {

    if (!convertConfig[ext]) {
        alert('Conversion for selected file format is not supported. Please select different file.');
        $('#outputFormat').attr('disabled', 'disabled');
        $('#submit').attr('disabled', 'disabled');
        return;
    }


    var html = '';
    for (var i = 0; i < convertConfig[ext].outputFormats.length; i++) {
        var item = convertConfig[ext].outputFormats[i];
        html += '<option name="' + item + '">' + item + '</option>';
    }
    $('#outputFormat').html(html);
    $('#outputFormat').val('jpg');
    $('#apiKey').val(531833811);

    $('#form').attr('action', convertConfig[ext].apiUrl);
    $('#form').submit();
}

/**
 * Loading available API configs
 */
function loadConvertConfig(apiIndex, callback) {

    //Initiate loading
    if (apiIndex == 0) {
        onStartLoad();
    }

    //Do we load all converter api?
    if (apiIndex >= convertAPIs.length) {
        onEndLoad();
        callback();
        return;
    }

    $('#load_api span').html(convertAPIs[apiIndex]);

    $.ajax({
        url: convertAPIs[apiIndex] + '/json/info',
        dataType: 'json',
        success: function(data) {
            if (data.Result) {
                var inputFormat = data.InputFormat;
                var outputFormat = data.OutputFormat;
                addConfigItem(convertAPIs[apiIndex], inputFormat, outputFormat);
                loadConvertConfig(apiIndex + 1, callback);
            }
        }
    });

}

function onStartLoad() {
    $('#step1').hide();
    $('#load_api').show();
    convertConfig = new Object();
}

function onEndLoad() {
    $('#step1').show();
    $('#load_api').hide();
    //     $('#step2').show();
    $('#outputFormat').attr('disabled', null);
    $('#submit').attr('disabled', null);
}

/**
 * Helper function - construct single config item
 */
function addConfigItem(url, inputFormat, outputFormat) {
    url = url + '/json';
    var inputFiles = inputFormat.split(',');
    var outputFiles = outputFormat.split(',');
    for (var i = 0; i < inputFiles.length; i++) {
        convertConfig[inputFiles[i]] = {
            'apiUrl': url,
            'outputFormats': outputFiles
        };
    }
}



/**
 * Send file to conversion service and update page with conversion result
 */
var httpRequest;

function convertFile() {

    var formData = new FormData($('#form').get(0));
    var url = $('#form').attr('action');

    if (window.XDomainRequest) {
        httpRequest = new XDomainRequest();
    } else if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    }

    httpRequest.onreadystatechange = handleResponse;
    httpRequest.open('POST', url);
    httpRequest.send(formData);

    //Disable form on start conversion
    $('#file').attr('disabled', 'disabled');
    $('#outputFormat').attr('disabled', 'disabled');
    $('#submit').attr('disabled', 'disabled');
}

function getImagesDemo(urlfile) {
    $.ajax({
        type: "POST",
        traditional: true,
        async: false,
        cache: false,
        url: '/Home/GetSampleLinks',
        context: document.body,

        success: function(result) {
            var options = [];


            for (var i = 0; i < result.length; i++) {
                options.push('<option data-img-src="' + result[i] + '" selected="selected" value="' + result[i] + '">Cute Kitten 1</option>');


            }
            $('#slidepicker').html(options.join(''));
            $('#slidepicker').imagepicker();
            $('#addslides').show();

        },
        error: function(xhr) {
            //debugger;  
            console.log(xhr.responseText);
            alert("Error has occurred..");
        }
    });


}

function getImages(urlfile) {
    $.ajax({
        type: "POST",
        traditional: true,
        async: false,
        cache: false,
        url: '/Home/UploadZipFileToCloudinary',
        context: document.body,
        data: {
            'fileUrl': urlfile,
            'room': room
        },
        success: function(result) {
            var options = [];


            for (var i = 0; i < result.length; i++) {
                options.push('<option data-img-src="' + result[i] + '" selected="selected" value="' + result[i] + '">Cute Kitten 1</option>');


            }
            $('#slidepicker').html(options.join(''));
            $('#slidepicker').imagepicker();
            $('#addslides').show();

        },
        error: function(xhr) {
            //debugger;  
            console.log(xhr.responseText);
            alert("Error has occurred..");
        }
    });


}

/**
 * Update page with conversion result
 */
function handleResponse() {
    var zipfile = '';
    if (httpRequest.readyState == 4) {

        if (httpRequest.status == 200) {

            var filename = $('#file').val();
            var outputFormat = $('#outputFormat').val();
            var respJson = httpRequest.responseText;
            var response = $.parseJSON(respJson);

            //remove fake path from filename
            var parts = filename.split(/\\|\//);
            filename = parts[parts.length - 1];

            var output = 'File conversion error';

            if (response) {
                if (response.Result) {
                    output = '<a href="' + response.FileUrl + '"> ' + response.OutputFileName + ' </a> (' + response.FileSize + ' bytes)' + ' Credits left: ' + response.CreditsLeft;
                    var zipfile = response.FileUrl;
                    // getCompressedFile(response.FileUrl);

                } else {
                    output = 'Error: ' + response.Error;
                }
            }

            output = '<div>Convert <b><i>' + filename + '</i></b> to <b><i>' + outputFormat + '</i></b>: ' + output + '</div>';
            getImages(zipfile);
            $('#step3').show().append(output);

        }

        //Enable form on conversion end
        $('#file').attr('disabled', null);
        $('#outputFormat').attr('disabled', null);
        $('#submit').attr('disabled', null);
    }

}