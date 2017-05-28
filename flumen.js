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

        var o = {
            'loop': true,
            'center': true,
            'fluid': true,
            'arrows': false,
            'dots': false,
            'mousewheel': false,
            'speed': 300
        }

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
                    'outerWidth': owidth
                }

                if ($elem.hasClass('cloned')) {
                    o.map[i].cloned = true;
                }
            }
        }

        console.log(o);

        $(window).resize(calc);
        calc();


        var start = o.map[o.items].start;
        $slider.scrollLeft(start);

        var end_pos = o.map[o.items*3-1].start + o.map[o.items*3-1].width - o.width - 50;

        $slider.scroll(function(e) {
          if ($slider.scrollLeft() <= 50) {
            $(this).trigger('flumina.start', o);
            $slider.scrollLeft(o.map[o.items].start - $slider.scrollLeft() + 50);
          }

          if ($slider.scrollLeft() >= end_pos) {
              $(this).trigger('flumina.end', o);
              $slider.scrollLeft(o.map[o.items*2-1].start + o.map[o.items*2-1].width -o.width-50);
          }
        });
    };

})(jQuery);
