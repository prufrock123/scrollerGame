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

        var Game = function(){
            var self = this
            self.tick = function() {

                hero.reDraw()
                GameObjects.forEach(function(obj){obj.reDraw()})
                setTimeout(self.tick , 5);

            }
            this.tick();
        };
        var GameObjects = [];
        var GameObject = function(node) {

            // this.startCoo

            this.nextCoordinates = {
                x  :0 ,
                y  :0
            };
            if(node){
                this.node = node;
                this.node.style.left = '0px';
                this.node.style.top  = document.querySelector('body').offsetHeight - this.height() + 'px';
            }
        };

        GameObject.prototype = {

            height : function(){return this.node.offsetHeight;} ,
            width  : function(){return this.node.offsetWidth;} ,
            left   : function(){return parseInt(this.node.style.left , 10);} ,
            top    : function(){return parseInt(this.node.style.top , 10);} ,
            moveTo : function(obj){

                this.node.style.left = this.left() + obj.x  + 'px';
                this.node.style.top  = this.top() - obj.y + 'px';
                
            } ,
            next   : function(newCoordinates) {

                if (typeof newCoordinates.x == 'number')
                    this.nextCoordinates.x = newCoordinates.x;
                if (typeof newCoordinates.y == 'number'){
                    this.nextCoordinates.y = newCoordinates.y;
                }

            } ,
            reDraw : function(){
                
                if (this.node.id=='guy')
                    $('body, html').scrollLeft(this.left()-400);
                
                if (this.isFalling) {console.log(this.isFalling)
                    this.nextCoordinates.y -= 1;
                }

                this.node.style.left = this.left() + this.nextCoordinates.x  + 'px';
                this.node.style.top  = this.top() - this.nextCoordinates.y + 'px';
                this.handleCollision()

            } ,
        
            handleCollision : function() {
                
                var self = this;

                var Collides  = false;
                
                var myLeft   = self.left();
                var myTop    = self.top();
                var myRight  = myLeft + self.width();
                var myBottom = self.top() + self.height();

                GameObjects.forEach(function(obj) {
                    
                    if(self.node.id == obj.node.id)
                        return;
                    
                    var theirLeft   = obj.left();
                    var theirTop    = obj.top();
                    var theirRight  = obj.left() + obj.width();
                    var theirBottom = obj.top()  + obj.height();

                    Collides = myBottom > theirTop   &&
                               myLeft   < theirRight &&
                               myRight  > theirLeft &&
                               myTop    < theirBottom;

                    if (typeof self.velocity === 'number' && Collides ){// when our bottom collides with this objects top
                        
                        var hitBottom = myBottom - theirTop<theirBottom - myTop
                        var diff = hitBottom ? myBottom - theirTop : theirBottom - myTop

                        var YShallow = (Math.abs(diff)<Math.abs(theirLeft - myRight)) &&
                                       (Math.abs(diff)<Math.abs(myLeft-theirRight))
                        
                        var fromLeft = Math.abs(myLeft-theirRight)>Math.abs(theirLeft - myRight)

                        self.isFalling = true;
                        
                        console.log(myBottom - theirTop,theirBottom - myTop,
                                    theirLeft - myRight,myLeft-theirRight , obj.node.id)

                        if(YShallow){
                            
                            // collision is resolved only on the shallow axis

                            if (myBottom > theirTop && hitBottom) {
                                console.log('hit bottom',myBottom - theirTop)
                                self.isFalling = false;

                                // player has fallen into a block, pull them out
                                self.moveTo({y:myBottom - theirTop});

                            }

                            if (myTop < theirBottom && !hitBottom){
                        // self.isFalling = true;
                            
                                console.log('top',obj.node.id); // collides with (for later use)
                                // player hit from below, so they are in a jump, therefore gravity is in effect
                                // player has gone into a block from below, pull them out
                                self.moveTo({y:myTop-theirBottom});
                                // self.next({y:0})

                            }
                                self.next({y:0})

                        }
                        else {
                            
                            self.isFalling = true;

                            if(myRight > theirLeft && fromLeft){
                            
                                console.log('right',obj.node.id); // collides with (for later use)
                            
                                self.moveTo({x:theirLeft - myRight});
                            }
        
                            if(myLeft < theirRight && !fromLeft) {
                            
                                console.log('left',obj.node.id); // collides with (for later use)
                            
                                self.moveTo({x:theirRight-myLeft});
                            }
                        }

                    }
                })
            }

        };

        GameObjects.push(new GameObject(id('ground')));
        var ground = GameObjects[0];
        ground.next({x:0,y:0});




        var Combatant   = function(node){
            this.velocity = 0
            this.node = node;

            //starting coordinates
            this.node.style.left = '20px';
            this.node.style.top  = document.querySelector('body').offsetHeight  - this.height() + 'px';

        };
        
        Combatant.prototype = new GameObject();
        
        Combatant.prototype.goLeft = function(speed) {

            // this.next({y:-1});
            this.isFalling = true;
            this.next({x:speed})

        };
        Combatant.prototype.goRight = function(speed) {
            
            // this.next({y:-1});
            this.isFalling = true;
            this.next({x:speed});

        };
        Combatant.prototype.jump = function(speed) {
            
            if(this.isFalling)
                return

            this.isFalling = true;
            
            this.next({y:20}); //set intitial upward thrust to 20

        };
        var hero = new Combatant(id('guy'));
        [// object map
            'w                                              w' ,
            'w                                              w' ,
            'w                                              w' ,
            'w                                              w' ,
            'w                                              w' ,
            'w                                      w       w' ,
            'w                                      w       w' ,
            'w                              wwww    w       w' ,
            'w                                      w       w' ,
            'w    w                                         w' ,
            'w    wwwww  w    w    wwwww                    w' ,
            'w h                                            w'
        ].reverse().forEach(function(line , row){

            line.split('').forEach(function(char , col) {
                
                if(char==='w') {
                    
                    $('<div class="wall" id="row'+ row +'col'+ col +'"></div>')
                        .appendTo('body')
                        .css({width:'50px' , height:'50px'});

                    GameObjects.push(new GameObject(id('row'+ row +'col'+ col)))
                    GameObjects[GameObjects.length-1].moveTo({x:col * 48 , y:row * 48})
                }
                if(char==='h') {
                    hero.moveTo({x:col*50,y:row*50})
                }

            });

        });
        document.onkeydown=function() {
            
            var evtobj = window.event

            if(evtobj.keyCode==37){
                evtobj.preventDefault();
                hero.goLeft(-5)
            }

            if(evtobj.keyCode==39){
                evtobj.preventDefault();
                hero.goRight(5)
            }

            if(evtobj.keyCode==38 )
                hero.jump()


        }
        document.onkeyup = function() {
            
            var evtobj = window.event

            if(evtobj.keyCode==37){
                evtobj.preventDefault();
                hero.goLeft(0)
            }
            
            if(evtobj.keyCode==39){
                evtobj.preventDefault();
                hero.goRight(0)
            }

            evtobj.preventDefault();
        }

        var g = new Game();
    })

}