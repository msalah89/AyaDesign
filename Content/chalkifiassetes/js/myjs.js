$(document).ready(function () {

    $("#link-1").hover(function () {
        $("#img-hover").css({"display": "block"});
    },
            function () {
                $("#img-hover").css({"display": "none"});
            });

    $("#link-2").hover(function () {
        $("#hover-2").css({"display": "block"});
    },
            function () {
                $("#hover-2").css({"display": "none"});
            });
    $("#link-3").hover(function () {
        $("#hover-3").css({"display": "block"});
    },
            function () {
                $("#hover-3").css({"display": "none"});
            });
             $("#link-4").hover(function () {
        $("#hover-4").css({"display": "block"});
    },
            function () {
                $("#hover-4").css({"display": "none"});
            });
    $("#link-5").hover(function () {
        $("#hover2").css({"display": "block"});
    },
            function () {
                $("#hover2").css({"display": "none"});
            });

      

    (function () {

        [].slice.call(document.querySelectorAll('.tabs')).forEach(function (el) {
            new CBPFWTabs(el);
        });

    })();


    $(".text").click(function () {
        $('.toolbtn').removeClass("border-style");
        $(".text").addClass("border-style");
    });
    $(".pincle").click(function () {
        $('.toolbtn').removeClass("border-style");
        $(".pincle").addClass("border-style");
    });

    $(".line").click(function () {
        $('.toolbtn').removeClass("border-style");

        $(".line").addClass("border-style");
    });
    $(".square").click(function () {
        $('.toolbtn').removeClass("border-style");
        $(".square").addClass("border-style");
          });
    $(".circle").click(function () {
        $('.toolbtn').removeClass("border-style");
        $(".circle").addClass("border-style");
       });
    $(".btn-2").click(function () {
        $(".btn-2").addClass("filter-style");
        $(".btn-1").removeClass("filter-style");
        $(".btn-3").removeClass("filter-style");
    });
    $(".btn-3").click(function () {
        $(".btn-3").addClass("filter-style");
        $(".btn-2").removeClass("filter-style");
        $(".btn-1").removeClass("filter-style");
    });
    
        	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			method: "POST",
			data: $(this).serialize(),
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
		}).done(function(data){
			form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
		});
	});
});
