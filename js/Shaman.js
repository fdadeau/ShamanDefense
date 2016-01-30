/** 
 *  Class for the Shaman   
 */
function Shaman(_g) {
    
    // lien vers le jeu
    var game = _g;
    
    // Temps (ms) nécessaire pour qu'il finisse son chargement
    var loadingTime = game.gameRules.shaman.loadingTime.get();
    
    // Temps de chargement courant
    var currentLoadingTime = 0;
    
    // position 
    var x = 140, y = document.getElementById("cvs").height / 2 | 0;
    
    var altarX = x + 50, altarY = y, altarRadius = 70; 
    
    // largeur, hauteur
    var width = 20, height = 20;
    
    // Remise à zéro du temps de chargement
    this.reset = function() {
        currentLoadingTime = 0;
        lastUpdate = 0;
    }

    this.getX = function() {
        return x;
    };
    this.getY = function() {
        return y;
    };
    this.getWidth = function() {
        return width;
    };
    this.getHeight = function() {
        return height;
    };
    
    this.isInShamanCircle = function(_x, _y) {
        return Math.sqrt(Math.pow(altarX - _x,2) + Math.pow(altarY - _y,2)) < altarRadius;
    };
    
    // Mise à jour du shaman
    this.update = function(time) {
        var nbCharactersInPosition = 0;
        for (var i in game.characters) {
            if (game.characters[i].state == 0 && this.isInShamanCircle(game.characters[i].x, game.characters[i].y)) {
                nbCharactersInPosition++;
            }
        }
        if (nbCharactersInPosition == 0) return;
        currentLoadingTime += (time.tick * nbCharactersInPosition / game.gameRules.character.nbStartCharacter.get());
        if (currentLoadingTime >= loadingTime) {
            game.endLevel();
            this.reset();
        }
    };
    
    // Affichage du shaman
    this.render = function() {
        game.context.fillStyle = "#000000";
        game.context.fillRect(x - width/2|0, y - height/2 | 0, width, height);
        game.context.fillStyle = "#FF5555";
        game.context.fillRect(x - width/2|0, (y - height/2 | 0) - 10, width * currentLoadingTime / loadingTime | 0, 5);
    };
    
}