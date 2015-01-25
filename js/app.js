window.onload = app;

// runs when the DOM is loaded
function app(){
    "use strict";

    // load some scripts (uses promises :D)
    loader.load(
        //css
        {url: "./dist/style.css"},
        //js
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/lodash.min.js"}
        // {url: "./bower_components/backbone/backbone.js"}
    ).then(function(){
        document.querySelector("html").style.opacity = 1;
        // start app?
        var id = function(element){

            return document.getElementById(element);

        };

        var ground = id('ground');
        var groundPosition = {
            x:0,
            y:0
        }

        var hero   = {
            id :id('guy') ,
            x  :20 ,
            y  :ground.offsetHeight ,
            velocity : 20
        }
        
        var plotObject = function(obj , coordinates) {
            // we relocated our origin point from top left to bottom left to be congruent with a classical schema
            // we also relocated our origin point of placed objects to the bottom left.
            obj.style.left = coordinates.x  + 'px';
            obj.style.top  = document.querySelector('body').offsetHeight - coordinates.y - obj.offsetHeight + 'px';
        };
        plotObject(ground  , groundPosition );
        plotObject(hero.id , hero );

        document.onkeydown=function(e){
            
            var evtobj = window.event? event : e

            if(evtobj.keyCode==37){
                hero.x += -5;
            }
            
            if(evtobj.keyCode==39){
                hero.x += 5;
            }

            plotObject(hero.id , hero );
            
           
        }

        document.onkeyup = function() {
            
            var evtobj = window.event? event : e

            if(evtobj.keyCode==38 && hero.velocity===20) {

                var gravity  = -1;

                var jump = setInterval(function(){
                    
                    hero.y += hero.velocity;
                    
                    plotObject(hero.id , hero );
                    
                    hero.velocity += gravity;

                    if (hero.velocity<=-21){
                        hero.velocity = 20;
                        clearInterval(jump);
                    }

                } , 20);
            }

        }
    })

}