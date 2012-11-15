/**
 * jQuery makeanime v1.0 - 2012-11-14
 * (c) 2012 Tomoyuki Tsujmioto
 * license: www.opensource.org/licenses/mit-license.php
 */
;(function($) {

  $.fn.makeanime = function(options){

    var elements = this;

    // marge default option and argument option
    var opts = $.extend({}, $.fn.makeanime.defaults, options);

    // list of animation elements
    var animeElements = {};

    // list of each animation elements size(width/height)
    var defaultSize = {};

    /**
     * setCSS
     *
     * @description
     * set default css value
     *
     * @param {string} id [ ID you want to set default CSS value ]
     */
    var setCSS = function(id){
      animeElements[id]
        .hide()
        .css({width  : defaultSize[id].width,
              height : defaultSize[id].height
              })
        ;
    };

    /**
     * [nextscene]
     * @description
     * callback function for loop/next animation
     * @param  {object} elements [Parent Element you want to do animation]
     */
    var nextscene = function(elements){
      $(elements).find("img").each(function(index, Ele){
        jEle = $(Ele);
        animeElements[this.id] = $(this);
        if( defaultSize[this.id] == "", defaultSize[this.id] == undefined){
          defaultSize[this.id] = { width: animeElements[this.id].width(),
                                   height: animeElements[this.id].height()
                                  };
        }
        setCSS(this.id);
        createAnimation( $(this) ,opts);
      });
    }

   /**
     * [createAnimation]
     * @description
     * make jQuery animation setting and excute animation
     * @param  {object} jEle [target(jQuery Element) you want to animation ]
     */
    var createAnimation = function (jEle,opts){

      option = {};
      option.startinit   = $.extend({}, opts["defaultAnime"].startinit,   opts[jEle[0].id].startinit);
      option.startAnime  = $.extend({}, opts["defaultAnime"].startAnime,  opts[jEle[0].id].startAnime);
      option.finishAnime = $.extend({}, opts["defaultAnime"].finishAnime, opts[jEle[0].id].finishAnime);



      /**
       * [createArgument]
       * @description
       * create object of jQuery animation
       *
       * @param  {object} jEle [target jQuery element]
       * @param  {object} opt [animation setting information]
       * @return {object}     [object for jQuery animation ]
       */
      function createArgument(jEle,opt){

        // structure
        tmpObj = {
          startinit:{},
          startAnime:{delay:0,
                      anime:{},
                      option:{}
                    },
          finishAnime:{delay:0,
                       anime:{},
                       option:{}}
        };

        for (var i in opt){
          // i is [startinit/startAnime/finishAnime]

          for (var j in opt[i]){
            // j is [left/top/width/height/opacity/dulation/delay/.......]

            val = "";
            if( opt[i][j] != "" && opt[i][j] != "undefined"){

              // if value is sise of % , it will change value properly
              val = opt[i][j];
              if(String(val).indexOf("%") > 0 ){
                val = String(val).replace("%","");
                val = defaultSize[jEle[0].id][j] * val / 100;
              }

              if( i === "startAnime" || i === "finishAnime"){
                switch (j) {
                  case "delay":
                    tmpObj[i][j] = val;
                    break;
                  case "duration":
                  case "easing":
                  case "queue":
                  case "complete":
                    tmpObj[i].option[j] = val;
                    break;
                  case "nextsecne":
                   tmpObj[i].option.complete = function(){
                      nextscene(val);
                    };
                    break;
                  default:
                    tmpObj[i].anime[j] = val;
                    break;
                }
              }else{
                tmpObj[i][j] = val;
              }
            }
          }
        }
        return tmpObj;
      }

      arg = {};
      arg = createArgument(jEle, option);

      jEle.queue(function(){
            $(this).css(arg.startinit)
                   .dequeue();
           })
          .delay(arg.startAnime.delay)
          .animate( arg.startAnime.anime,
                    arg.startAnime.option)
          .delay( opts.timeShowToDelay + arg.finishAnime.delay)
          .animate( arg.finishAnime.anime,
                    arg.finishAnime.option)
          ;
    };



    // Main process
    $(elements).find("img").each(function(index, Ele){
      jEle = $(Ele);
      animeElements[this.id] = $(this);
      defaultSize[this.id] = { width: animeElements[this.id].width(),
                               height: animeElements[this.id].height()
                              };

      setCSS(this.id);
      createAnimation( $(this) ,opts);
    });

    return this;

  };


  // Default Options
  $.fn.makeanime.defaults = {
    timeShowToDelay : 6000,
    defaultAnime : {
      startinit : {
        top    : "",
        left   : "",
        width  : "",
        height : ""
      },
      startAnime : {
        delay   : 0,
        opacity : 'show',
        top     : "",
        left    : "",
        width   : "",
        height  : "",
        duration: 1000,
        easing  : "swing",
        queue   : true,
        complete: function(){}
      },
      finishAnime : {
        delay   : 500,
        opacity : 'hide',
        top     : "",
        left    : "",
        width   : "",
        height  : "",
        duration: 600,
        easing  : "swing",
        queue   : true,
        complete: function(){}
      }
    }
  };

  //////////////////////////////////////////

  // how to use //
  ////////////////////////////////
  // ANIMATION CONFIG (example) //
  ////////////////////////////////
  // var browserW = document.documentElement.clientWidth;
  // var centerW = browserW/2;
  /**
   * [jQuery animation setting]
   * @type {Object}
   *
   * startinit   : Setting for position of elements before each elements process animation
   * startAnime  : Setting for fadeIn animation
   * finishAnime : Setting for fadeOut animation
   */
  // var exampleSetting = {
  //   "ex1" : {
  //     startAnime : {
  //       delay   : 0,
  //       opacity : 'show',
  //       duration: 1000,
  //       easing  : "swing"
  //     },
  //     finishAnime : {
  //       delay   : 0,
  //       opacity : 'hide',
  //       duration: 600,
  //       easing  : "swing",
  //       nextsecne: "#scene2"
  //     }
  //   },
  //   "ex2" : {
  //     startinit : {
  //       top    : 125,
  //       left   : centerW + 700,
  //       width  : "110%",
  //       height : "110%"
  //     },
  //     startAnime : {
  //       delay   : 300,
  //       opacity : 'show',
  //       top     : 105,
  //       left    : centerW-20,
  //       width   : "100%",
  //       height  : "100%",
  //       duration: 300,
  //       easing  : "swing"
  //     },
  //     finishAnime : {
  //       delay   : 500,
  //       opacity : 'hide',
  //       left    : centerW-200,
  //       width   : "80%",
  //       height  : "80%",
  //       duration: 400,
  //       easing  : "easeOutQuart",
  //       nextsecne: "#scene1"
  //     }
  //   }
  // };
  // $("#scene1").makeanime(animeSetting);

})(jQuery);