"use strict";
var Application = function () {
    
    var CVS_HEIGHT,
        CVS_WIDTH,
        cvs,
        ctx,
        game,
        gameTime;

    this.mouse_position = {
            x: null,
            y: null,
            raz: function () { this.x = null; this.y = null; }
        };
        
    this.init = function() {

        cvs = document.getElementById("cvs");
        cvs.onclick = this.captureMouseClick.bind(this);
        ctx = cvs.getContext("2d");
        CVS_HEIGHT = cvs.height = 700; // window.innerHeight - 10;
        CVS_WIDTH = cvs.width = 1200; // window.innerWidth - 10;

        gameTime = new GameTime();

        game = new Game(ctx);
        game.width = CVS_WIDTH;
        game.height = CVS_HEIGHT;
        game.init().start();

        this.boucleDeJeu();
    };

    var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    this.boucleDeJeu = function() {
        requestAnimFrame(this.boucleDeJeu.bind(this));
        this.update();
        this.render();
    };


    this.update = function() { 
        gameTime.update();
        game.update(gameTime, this.mouse_position);
    };

    this.render = function() {
        ctx.clearRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
        game.render();
    };

    this.captureMouseClick = function(event) {
        
        // gets the click coordinates
        var x, y;
        
        if (event.x != undefined && event.y != undefined) {
                x = event.x;
                y = event.y;
        }	
        else { // Firefox method to get the position
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= cvs.offsetLeft; 
        y -= cvs.offsetTop;

        this.mouse_position.x = x;
        this.mouse_position.y = y;

    };

};