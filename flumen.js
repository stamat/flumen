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


    $.fn.flumen = function(o){
        var $slider = $(this);
        $slider.kinetic();

        var $ch = $slider.children();
        var items = $ch.length;
        $slider.prepend($ch.clone().addClass('clone'));
        $slider.append($ch.clone().addClass('clone'));

        var $first_child = $($ch[0]);
        var $last_child = $($ch[$ch.length-1]);
        var sw = $slider.width();

        var start = $first_child.offset().left;


        var pos = [];
        $slider.children().addClassIncrement(null, function(i, $elem) {
              pos.push($elem.offset().left);
        });

        console.log(pos);
        $slider.scrollLeft(start);

        var end_pos = pos[items*3-1] + $last_child.width() - sw - 50;


        $slider.scroll(function(e) {
          //console.log($slider.scrollLeft());
          if ($slider.scrollLeft() <= 50) {
            $(this).trigger('flumina.start', o);
            $slider.scrollLeft(pos[items-1]-$slider.scrollLeft());
          }

          if ($slider.scrollLeft() >= end_pos) {
              $(this).trigger('flumina.end', o);
              $slider.scrollLeft(pos[items-1]+ (end_pos - $slider.scrollLeft()));
          }
        });
    };

})(jQuery);
