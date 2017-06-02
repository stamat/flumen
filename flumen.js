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

        var is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
        var is_safari = navigator.userAgent.indexOf("Safari") > -1 && !is_chrome;
        var is_mobile = false; //initiate as false
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) is_mobile = true;

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
            'mousewheel': true,
            'speed': 300,
            'margin': 0,
            'resize_timeout': 200,
            'events': {}
        };
        o.elem = $slider;

        if (is_safari || is_mobile) {
            $slider.css('overflow-x', 'auto');
            o.mousewheel = false;
        }

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

                // We can now use the get visible slides function in order to see how many slides we need to clone on each side on every resize
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
                if (!is_mobile) {
                    $slider.kinetic({
                        y: false
                    });
                }

                if (o.mousewheel) {
                    $slider.mousewheel(function(event) {
                        $slider.scrollLeft($slider.scrollLeft() + event.deltaX);
                    });
                }
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
