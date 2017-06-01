# flumen
flumen - Fluid jQuery Carousel

This is a super simple responsive carousel plugin that doesn't snap to the slides. I've seen a lot of feature requests on already existing carousel plugins asking for a free flowing carousel, so I've decided to make one.

**[DEMO](https://stamat.github.io/flumen/ "Demo")**

The distinct features of this carousel are:
* **Free flowing** - doesn't snap to slides
* Centering mode - slides can bleed out the edges and the container doesn't have to have a predefined size, nor the slides have to be the same width
* **Uses CSS3 for slide placement** - instead of calculating the pane width depending on the sum of slides size, and leans onto scroll feature instead of constantly managing, this enables all sorts of freedoms, like not having to worry about the size of the slides and it's container, and we didn't have to add multiple <div/> wrappers to enable the positioning
* **Naturally responsive** - There is no need for implementing responsive breakpoints since the positions are recalculated on every window resize


## Dependencies
* jQuery 1.8+ - https://github.com/jquery/jquery
* jQuery.kinetic - https://github.com/davetayls/jquery.kinetic
* jquery-mousewheel [optional] - https://github.com/jquery/jquery-mousewheel

## Tested on

* IE 10 and 11
* Firefox 12 and 46
* iOS 8.3 Safari (iPhone 4s)
* iOS 10.3 Safari (iPhone 5s)
* Google Chrome 56

**Doesn't work on**: IE 9 and below, I might add the support for them in the future, if I'm ever bored in life... haha! :P

## Usage

    $('.selector').flumen({
      arrows: true //example option
    });


## Options

There are some currently in development options. The first version of this jQuery plugin supports only the features it was specifically designed for. Future updates will bring several switches that will enable this carousel to work like all the other carousel with addition of it's distinct features.

    'margin' [default: 0] - sets spacing between the slides

    'loop' [default: true] //in development

    'center' [default: true] //in development

    'fluid' [default: true] //in development

    'arrows' [default: false] //in development

    'dots' [default: false] //in development

    'mousewheel' [default: false] //in development

    'speed' [default: 300] - goTo, Left and Right movement animation speed

    'resize_timeout' [default: 200] - prevent multiple resize events to be fired

## Functons
    $('.selector').trigger('flumen.next');

    $('.selector').trigger('flumen.prev');

    $('.selector').trigger('flumen.goto', slide_number);

    $('.selector').trigger('flumen.recalc'); - after the images load you can recalculate the positions, this function happens on each window resize

    $('.selector').trigger('flumen.remove'); //in development - should remove all the bindings of Flumen

## Events

    'flumen.start' - reaches the start

    'flumen.end' - reaches the end

    'flumen.stop' - scroll stops

    'flumen.beforechange' - before the slide changes on next or prev or goto

    'flumen.afterchange' - after the slide changes on next or prev or goto

    'flumen.slide' - slide comes into focus

    'flumen.beforeresize' - is triggered before the recalculation

    'flumen.afterresize' - is triggered before the recalculation

## Issues

There are couple of minor issues, and couple of things I was limited with time to do right. So expect the unexpected, and be kind to report the issues:

[https://github.com/stamat/flumen/issues](https://github.com/stamat/flumen/issues)

## Name
Flumen, Fluminis - River or Flowing Fluid on Latin

Fauré: Super Flumina Babylonis
https://www.youtube.com/watch?v=7LCsLDgapFc
