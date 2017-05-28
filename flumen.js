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


    $.fn.flumen = function(){

    };

})(jQuery);
