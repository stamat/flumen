# flumen
flumen - Fluid jQuery Carousel

This is a super simple responsive carousel plugin that doesn't snap to the slides. I've seen a lot of feature requests on already existing carousel plugins asking for a free flowing carousel, so I've decided to make one.


## Dependencies
* jQuery 1.8+ - https://github.com/jquery/jquery
* jQuery.kinetic - https://github.com/davetayls/jquery.kinetic
* jquery-mousewheel [optional] - https://github.com/jquery/jquery-mousewheel


## Usage

    $('.selector').flumen({
      arrows: true //example option
    });


## Options

    'loop' [default: true]

    'center' [default: true]

    'fluid' [default: true]

    'arrows' [default: false]

    'dots' [default: false]

    'mousewheel' [default: false]

    'speed' [default: 300]

## Functons
    $('.selector').trigger('flumen.next');

    $('.selector').trigger('flumen.prev');

    $('.selector').trigger('flumen.goto', slide_number);


## Events

    'flumen.start' - reaces the start

    'flumen.end' - reaches an end

    'flumen.beforechange' - before the slide changes on next or prev or goto

    'flumen.afterchange' - after the slide changes on next or prev or goto

    'flumen.slide' - slide comes into focus


## Name
Flumen, Fluminis - River or Flowing Fluid on Latin

Fauré: Super Flumina Babylonis
https://www.youtube.com/watch?v=7LCsLDgapFc
