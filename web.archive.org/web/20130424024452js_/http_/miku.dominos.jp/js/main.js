$.easing.def = "easeInOutQuad";

// Preload
function preload (fileList) {
    var i = '';

    for (i in fileList) {
        i = fileList[i];

        (function (file) {
            var obj = new Image();
            obj.src = file;
        })(i);
    }
}

// Scroll
function scroll (r, t) {
    // TODO 精度上げ
    if (r === t) {
        return;
    } else {
        $(window).scrollTop(r);
        if (Math.abs(t - r) < 10) {
            setTimeout(function() {
                scroll(t, t);
            }, 16);
        } else {
            setTimeout(function() {
                scroll((t - r) / 7 + r, t);
            }, 16);
        }
    }
}

// Slide Module
$.fn.initSlide = function (parameter, additionalInit) {
    // Init closure
    var self = this,
        $film = $('.slideFilm', this), // The film that moves
        $items = $('.slideItem', this), // Collection of items
        $indicator = $('.slideIndicator', this),
        length = $items.length,
        onSlide = 0, // 0 for the first item
        slideInterval = parameter.interval ? parameter.interval : false,
        duration = typeof parameter.duration === 'number' ? parameter.duration : 500;

    this.timer = null; // Timer for automatic sliding
    this.fadeNeeded = !!parameter.fadeNeeded; // If fade transition is needed

    // Init
    $film.append($items.eq(0).clone()) // Duplicate
        .css('width', (length + 2) * 100 + '%'); // Init size

    if ($indicator.length) {

        var html = $indicator.html(),
            i = length;
        
        // Fill inidcator items
        while (i--) {
            html += '<li></li>';
        }

        $indicator.html(html);

        // Light the first item
        $indicator.addClass('on0')
            .children(':not(.inner)').eq(0).addClass('on');

        $indicator.delegate('li', 'click', function (e) {
            var clickedListItem = $(e.target).is('li') ? $(e.target) : $(e.target).parents('li').eq(0);

            if (slideInterval) {
                clearTimeout(self.timer);
                self.timer = setTimeout(self.autoSlide, slideInterval);
            }

            self.gotoSlide(clickedListItem.prevAll(':not(.inner)').length);
        });
    }

    if (additionalInit) {
        additionalInit();
    }

    // Bind ctrl
    this.nextSlide = function () {
        this.gotoSlide(onSlide + 1);
    };

    this.prevSlide = function () {
        this.gotoSlide(onSlide - 1);
    };

    this.gotoSlide = function (num) {
        var fadeNeeded = this.fadeNeeded,
            filmTurningNeeded = false,
            filmTurningCallback = function () {
            $film.css('left', 0);
            onSlide = 0;

            defaultCallback();
        },
            defaultCallback = function () {
            self.updateIndicator(onSlide);
        };

        // Check if turning action is needed
        // Standardize the number
        if (num !== 0 && num % length === 0) {
            filmTurningNeeded = true;
        } else {
            num = num >= 0 ? num % length : num % length + length;
            filmTurningNeeded = false;
        }

        onSlide = num;

        if (this.fadeNeeded) {
            $film.animate({
                opacity: 0
            }, {
                duration: 100,
                queue: true
            });
        }

        if (filmTurningNeeded) {
            $film.animate({
                left: (length * -100) + '%'
            }, {
                duration: duration,
                queue: true,
                complete: filmTurningCallback
            });
        } else {
            $film.animate({
                left: (num * -100) + '%'
            }, {
                duration: duration,
                queue: true,
                complete: defaultCallback
            });
        }

        if (this.fadeNeeded) {
            $film.animate({
                opacity: 1
            }, {
                duration: 100,
                queue: true
            });
        }
    };

    this.autoSlide = function () {
        self.nextSlide();
        self.timer = setTimeout(self.autoSlide, slideInterval);
    };

    if ($indicator.length) {

        this.updateIndicator = function (num) {
            var i = 0;

            // Validate num value
            if (num >= length || num < 0) {
                throw Error ('slideWidget.updateIndicator: num value exceeds the range');
            } else {
                $indicator.children(':not(.inner)').eq(num).addClass('on')
                    .siblings().removeClass('on');

                for (; i < length; i++) {
                    if ($indicator.hasClass('on' + i)) {
                        $indicator.removeClass('on' + i);
                    }
                }
                $indicator.addClass('on' + num);
            }
        };
    }

    return this;
};

// Usage of slide module
var appSlide = $('.appSlide');
appSlide.initSlide({interval: 7000}, function () {
    appSlide.find('.slideIndicator').delegate('li', 'click', function (e) {
        var clickedListItem = $(e.target).is('li') ? $(e.target) : $(e.target).parents('li').eq(0),
            $indicator = appSlide.find('.slideIndicator');
        var i = 0;

        for (; i < 5; i++) {
            if ($indicator.hasClass('on' + i)) {
                $indicator.removeClass('on' + i);
            }
        }

        $indicator.addClass('on' + clickedListItem.prevAll(':not(.inner)').length);
    });
});
clearTimeout(appSlide.timer);
appSlide.timer = setTimeout(appSlide.autoSlide, 7000);

var bikeSlide = $('.bikeSlide');
bikeSlide.initSlide({duration: 0, fadeNeeded: true}, function () {
    bikeSlide.find('.slideIndicator').children().each(function (i) {
        var html = '<img src="./img/bikeSlide/0' + (i + 1) + '_s.png" width="50" height="50">';
        $(this).html(html);
    });

    bikeSlide.find('.slideIndicator').delegate('li', 'click', function (e) {
        var clickedListItem = $(e.target).is('li') ? $(e.target) : $(e.target).parents('li').eq(0);

        clickedListItem.addClass('on').siblings().removeClass('on');
    });
});

// Bind scroll
$('.navbar').delegate('a', 'click', function (e) {
    var self = $(this),
        href = self.attr('href'),
        recent = $(window).scrollTop() - 0;
    var target = $(href).offset().top - 25;

    target = target < 0 ? 0 : target;

    if ($(window).width() > 640) {
        target = target === 0 ? 0 : target + 110;
    }

    scroll(recent, target);

    return false;
});
/*
     FILE ARCHIVED ON 02:44:52 Apr 24, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:13:30 May 15, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  load_resource: 562.629
  esindex: 0.016
  exclusion.robots: 0.19
  exclusion.robots.policy: 0.18
  PetaboxLoader3.datanode: 209.814 (4)
  captures_list: 973.506
  RedisCDXSource: 418.615
  PetaboxLoader3.resolve: 550.393 (4)
  CDXLines.iter: 16.444 (3)
  LoadShardBlock: 534.021 (3)
*/