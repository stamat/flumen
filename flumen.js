/*!
 * Flumen v1.0.0
 *
 * License MIT
 *
 * http://stamat.github.io/flumen
 * Copyright 2017 Stamat
 */

(function($){

    //Handy function that loops over the elements and adds an incremental class
    $.fn.addClassIncrement = function(pref, callback) {
        var $this = $(this);

        if (!pref) {
            pref = 'num';
        }

        for (var i = 0; i < $this.length; i++) {
            var $i = $($this[i]);
            $i.data('number', i).addClass(pref+'-'+i);

            if (callback) {
            	callback(i, $i);
            }
        }
        return $this;
    };


    $.fn.flumen = function(opt){
        var $slider = $(this);
        var mod = 50;

        var o = {
            'loop': true,
            'center': true,
            'fluid': true,
            'arrows': false,
            'dots': false,
            'mousewheel': false,
            'speed': 300
        };

        $.extend(o, opt);

        if (o.fluid) {
            $slider.kinetic();

            $slider.mousewheel(function(event) {
                $slider.scrollLeft($slider.scrollLeft() + event.deltaX);
            });
        }

        o.children = $slider.children();
        o.original = o.children;
        o.items = o.children.length;
        o.children.addClassIncrement();

        o.map = {};

        var hasCloned = false;

        function calc() {
            o.width = $slider.width();


            if (!hasCloned) {
                if (!o.cloned_left) {
                    o.cloned_left = o.children.clone(true).addClass('clone');
                    o.cloned_left.addClass('clone-left');
                    o.cloned_right = o.children.clone(true).addClass('clone-right');
                }

                $slider.prepend(o.cloned_left);

                //TODO: we dont really need the right clones, except if we want
                //to make infinite loop regardles of the number of items.
                //Removing them would aid performance, but I'll leave them for now...
                $slider.append(o.cloned_right);

                o.children = $slider.children();

                hasCloned = true;
            }

            for (var i = 0; i < o.children.length; i++) {
                var $elem = $(o.children[i]);

                var width = $elem.width();
                var owidth = $elem.outerWidth(true);
                var offset = $elem.offset().left;

                o.map[i] = {
                    'elem': $elem,
                    'width': width,
                    'start': offset,
                    'end': offset + width,
                    'outerEnd': offset + owidth,
                    'outerWidth': owidth,
                    'num': i,
                    'half_width': width / 2
                };

                if ($elem.hasClass('cloned')) {
                    o.map[i].cloned = true;
                }
            }

            o.end_position = o.map[o.items*3-1].start + o.map[o.items*3-1].width - o.width - mod;
            o.reset_left = o.map[o.items].start + mod;
            o.reset_right = o.map[o.items*2-1].start + o.map[o.items*2-1].width - o.width - mod;
            o.half_width = o.width/2;
        }

        var animating = false;
        var from = 0;
        var to = 0;

        function goTo(num, speed) {
            var item = o.map[num];

            to = num;
            from = o.current.num;

            if (!speed) {
                speed = o.speed;
            }

            var left = item.start;
            if (o.center) {
                left = left - (o.half_width - item.half_width);
            }
            animating = true;
            $slider.stop(true).animate({ scrollLeft: left }, speed, function(){
                animating = false;
            });
        }

        $(window).resize(calc);
        calc();

        //such a lazy thing to do... I'll have to think a bit on how to improve this
        function getCurrentItem() {
            var left = $slider.scrollLeft();
            if (o.center) {
                left = left + o.half_width;
            }

            for (var i in o.map) {
                var item = o.map[i];
                if (left > item.start && left < item.outerEnd ) {
                    return item;
                }
            }

            return null;
        }

        //set the start to the original first item
        var first_item = o.map[o.items];
        var start = first_item.start;

        if (o.center) {
            start = start - (o.half_width - first_item.half_width);
        }
        $slider.scrollLeft(start);


        o.current = null;
        $slider.scroll(function(e) {
            var left = $slider.scrollLeft();

            if (left <= mod) {
                $(this).trigger('flumen.start', o);
                $slider.scrollLeft(o.reset_left);

                if (animating) {
                    goTo(o.items+to, o.speed/2);
                }
            }

            if (left >= o.end_position) {
                $(this).trigger('flumen.end', o);
                $slider.scrollLeft(o.reset_right);

                if (animating) {
                    goTo(o.items*2-1); //this causes an issue, the movement is too fast...
                }
             }

            var item = getCurrentItem();
            if (item && (!o.current || o.current.num !== item.num)) {
                o.current = item;
                $(this).trigger('flumen.slide', o, item);
            }
        });

        $slider.on('flumen.goto', function(event, num){
            goTo(o.items+num-1);
        });

        $slider.on('flumen.left', function(event){
            console.log(o.current.num - 1);
            goTo(o.current.num - 1);
        });

        $slider.on('flumen.right', function(event){
            goTo(o.current.num + 1);
        });

        $(this).trigger('flumen.init', o);
    };

})(jQuery);
