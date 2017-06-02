/*!
 * Flumen v1.0.2
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
        if (!$slider.length) {
            return;
        }

        $slider.addClass('flumen');
        var mod = 50;
        var hasFlexbox = 'flex-shrink' in document.body.style;
        var timeout = null; //resize timeout, to trigger it only once on resize.
        var scroll_end_timer = null;

        var fn = {};
        var o = {
            'loop': true,
            'center': true,
            'fluid': true,
            'arrows': false,
            'dots': false,
            'mousewheel': false,
            'speed': 300,
            'margin': 0,
            'resize_timeout': 200,
            'events': {}
        };
        o.elem = $slider;

        var animated = false;
        function goTo(num, speed) {
            var item = o.map[num];

            if (!speed) {
                speed = o.speed;
            }

            var left = item.start;
            if (o.center) {
                left = left - (o.half_width - item.half_width - o.margin);
            }
            animated = true;

            $slider.trigger('flumen.beforechange', o);
            $slider.stop(true).animate({ scrollLeft: left }, speed, function() {
                $slider.trigger('flumen.afterchange', o);
            });
        }
        fn.goTo = goTo;

        //such a lazy thing to do... I'll have to think a bit on how to improve this
        function getCurrentItem() {
            var left = $slider.scrollLeft();
            if (o.center) {
                left = left + o.half_width;
            }

            for (var i in o.map) {
                var item = o.map[i];
                if (left >= item.start && left <= item.outerEnd ) {
                    //console.log(item);
                    return item;
                }
            }

            return null;
        }
        fn.getCurrentItem = getCurrentItem;

        //TODO: Get current visible, get all items currently visible in the viewport,
        // this will be useful for animating the slides with Farsight
        function getCurrentVisibleItems() {
            var left = $slider.scrollLeft();
            var items = [];
            var viewport_end = left + o.width;

            for (var i in o.map) {
                var item = o.map[i];
                if (left < item.end && viewport_end > item.start) {
                    items.push(item);
                }
            }
            return items;
        }

        function resetPosition(num) {
            //console.log(num);
            var item = o.map[num];
            var start = item.start;

            if (o.center) {
                start = start - (o.half_width - item.half_width - o.margin);
            }
            $slider.scrollLeft(start);
        }
        fn.resetPosition = resetPosition;

        function calc() {
            $slider.trigger('flumen.beforeresize', o);
            o.width = $slider.width();

            //this is here because we want to enable removing carousel functionality if the widht of the carousel items is less than the widht of the screen
            if (!o.cloned_left && o.loop) {
                o.cloned_left = o.children.clone(true).addClass('clone clone-left');
                o.cloned_right = o.children.clone(true).addClass('clone clone-right');

                $slider.prepend(o.cloned_left);

                //TODO: we dont really need the right clones, except if we want
                //to make infinite loop regardles of the number of items.
                //Removing them would aid performance, but I'll leave them for now...
                $slider.append(o.cloned_right);

                o.children = $slider.children();
            }


            //preserve scroll positions
            var left = $slider.scrollLeft();
            $slider.scrollLeft(0);

            for (var i = 0; i < o.children.length; i++) {
                var $elem = $(o.children[i]);

                var width = $elem.width();
                var owidth = $elem.outerWidth(true);
                var offset = $elem.position().left;


                var item = {
                    'elem': $elem,
                    'width': width,
                    'start': o.center ? offset : offset - o.margin,
                    'end': o.center ? offset + width : offset + o.margin + width,
                    'outerEnd': offset + owidth,
                    'outerWidth': owidth,
                    'id': i,
                    'num': i % o.items,
                    'half_width': width / 2
                };

                if ($elem.hasClass('clone')) {
                    item.cloned = true;
                } else {
                    o.orig_map[item.num] = item;
                }

                o.map[i] = item;
            }

            if (o.loop) {
                o.end_position = o.map[o.items*3-1].start + o.map[o.items*3-1].width - o.width - mod;
                o.reset_left = o.map[o.items].start + mod;
                o.reset_right = o.map[o.items*2-1].start + o.map[o.items*2-1].width - o.width - mod;
            } else {
                o.end_position = o.map[o.items-1].start + o.map[o.items-1].width - o.width;
            }

            o.half_width = o.width/2;

            $slider.scrollLeft(left);
            $(this).trigger('flumen.afterresize', o);
        }
        fn.calc = calc;

        function onscroll(e) {
            var left = $slider.scrollLeft();

            if (o.loop) {
                if (left <= mod) {
                    $slider.trigger('flumen.start', o);
                    $slider.scrollLeft(o.reset_left);
                }

                if (left >= o.end_position) {
                    $slider.trigger('flumen.end', o);
                    $slider.scrollLeft(o.reset_right);
                }
            } else {
                if (left === 0) {
                    $slider.trigger('flumen.start', o);
                }

                if (left >= o.end_position) {
                    $slider.trigger('flumen.end', o);
                }
            }


            var item = getCurrentItem();
            if (item && (!o.current || o.current.id !== item.id)) {
                o.current = item;
                $slider.trigger('flumen.slide', item, o);
            }

            if (scroll_end_timer) {
                clearTimeout(scroll_end_timer);
            }

            scroll_end_timer = setTimeout(function() {
                $slider.trigger('flumen.stop', o);
                scroll_end_timer = null;
            }, 100);
        }
        fn.onscroll = onscroll;


        $slider.on('flumen.goto', function(event, num) {
            if (o.events.hasOwnProperty('goto')) {
                o.events.goto(event, o);
            }
            fn.goTo(o.start_num+num-1);
        });

        $slider.on('flumen.left', function(event) {
            if (o.events.hasOwnProperty('left')) {
                o.events.left(event, o);
            }
            fn.goTo(o.current.id - 1);
        });

        $slider.on('flumen.recalc', function(event, o) {
            fn.calc();
        });

        $slider.on('flumen.right', function(event) {
            if (o.events.hasOwnProperty('right')) {
                o.events.right(event, o);
            }
            fn.goTo(o.current.id + 1);
        });

        $slider.on('flumen.slide', function(event, item) {
            $slider.find('.flumen-current').removeClass('flumen-current');
            item.elem.addClass('flumen-current');

            if (o.events.hasOwnProperty('slide')) {
                o.events.slide(event, item, o);
            }
        });


        $slider.on('flumen.start', function(event, o) {
            if (o.events.hasOwnProperty('start')) {
                o.events.start(event, o);
            }
        });

        $slider.on('flumen.end', function(event, o) {
            if (o.events.hasOwnProperty('end')) {
                o.events.end(event, o);
            }
        });

        $slider.on('flumen.beforechange', function(event, o) {
            if (o.events.hasOwnProperty('beforechange')) {
                o.events.beforechange(event, o);
            }
        });

        $slider.on('flumen.afterchange', function(event, o) {
            if (o.events.hasOwnProperty('afterchange')) {
                o.events.afterchange(event, o);
            }
        });

        $slider.on('flumen.beforeresize', function(event, o) {
            if (o.events.hasOwnProperty('beforeresize')) {
                o.events.beforeresize(event, o);
            }
        });

        $slider.on('flumen.afterresize', function(event, o) {
            if (o.events.hasOwnProperty('afterresize')) {
                o.events.afterresize(event, o);
            }
        });

        $slider.on('flumen.init', function(event, o) {
            if (o.events.hasOwnProperty('init')) {
                o.events.init(event, o);
            }
        });

        $slider.on('flumen.stop', function(event, o) {
            o.visible = getCurrentVisibleItems();
            $slider.find('.flumen-visible').removeClass('flumen-visible');

            for (var i = 0; i < o.visible.length; i++) {
                o.visible[i].elem.addClass('flumen-visible');
            }

            if (o.events.hasOwnProperty('stop')) {
                o.events.stop(event, o);
            }

            if (o.current.cloned && animated) {
                animated = false;
                fn.resetPosition(o.orig_map[o.current.num].id);
            }
        });

        $slider.on('flumen.remove', function(event, o) {
            //TODO: unbind flumen
        });

        function init() {
            $.extend(o, opt);

            if (!hasFlexbox) {
                $slider.addClass('no-flexbox');
            }

            if (o.fluid) {
                $slider.kinetic();

                $slider.mousewheel(function(event) {
                    $slider.scrollLeft($slider.scrollLeft() + event.deltaX);
                });
            }

            o.children = $slider.children().addClass('flumen-slide');
            o.original = o.children;

            if (o.margin) {
                o.original.css('margin', '0px ' + o.margin + 'px');
            }

            o.items = o.children.length;
            o.children.addClassIncrement();

            o.map = {};
            o.orig_map = {};

            $(window).resize(function(){
                if (!timeout) {
                    timeout = setTimeout(function(){
                        clearTimeout(timeout);
                        timeout = null;
                        fn.calc();
                    }, o.resize_timeout);
                }
            });
            fn.calc();

            //set the start to the original first item
            o.start_num = 0;
            if (o.loop) {
                o.start_num = o.items;
            }
            fn.resetPosition(o.start_num);

            o.current = null;
            $slider.scroll(onscroll);

            if (!o.center && !o.loop) {
                $slider.trigger('scroll');
            }

            $slider.trigger('flumen.init', o);

            return $slider;
        }
        fn.init = init;

        return fn.init();
    };

})(jQuery);
