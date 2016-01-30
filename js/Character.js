
function Character(_game, _x, _y) {

    this.game = _game;

    // position
    this.x = _x;
    this.y = _y;

    // size
    this.width = 30;
    this.height = 30;
    
    this.life = this.game.gameRules.character.life.get();
    this.speed = this.game.gameRules.character.speed.get();

    // point de destination lorsqu'il est en mouvement
    this.destX = 0;
    this.destY = 0;
    this.distToTarget = 0;
    
    this.state = 0; // 0 : IDLE | 1 : MOVING 
    
    // délai entre deux attaques
    this.attackDelay = this.game.gameRules.character.attackDelay.get();
    this.lastAttack = 0;
    this.attackSpeed = this.game.gameRules.character.attackSpeed.get();
    this.attackDamage = this.game.gameRules.character.attackDamage.get();
    // portée de l'attaque
    this.attackRange = this.game.gameRules.character.attackRange.get();
}

Character.prototype.getX = function() {
    return this.x;
};
Character.prototype.getY = function() {
    return this.y;
};
Character.prototype.getWidth = function() {
    return this.width;
};
Character.prototype.getHeight = function() {
    return this.height;
};

Character.prototype.update = function(time) {
    
    if (this.state == 1) { // MOVING
        this.distToTarget = Math.sqrt(Math.pow(this.x - this.destX,2) + Math.pow(this.y - this.destY,2));
        if (this.distToTarget < this.speed) {
            // arrive à destination
            this.x = this.destX;
            this.y = this.destY;
            this.state = 0;
            return;
        }
        // collision avec un autre personnage
        for (var i in this.game.characters) {
            if (this.game.characters[i] != this && this.game.characters[i].collidesWith(this.x + (this.destX - this.x) / this.distToTarget * this.speed, this.y+(this.destY - this.y) / this.distToTarget * this.speed, this.width, this.height)) {
                // contournement ou pause
                return;
            }
        }
        this.x += (this.destX - this.x) / this.distToTarget * this.speed;
        this.y += (this.destY - this.y) / this.distToTarget * this.speed;
    }
    else { // IDLE
        // is it performing the shaman ritual ?
        if (this.game.shaman.isInShamanCircle(this.x, this.y)) {
            return;
        }
        
        // detect closest ennemy 
        if (time.time - this.lastAttack > this.attackDelay) {
            var closestEnnemy = null;
            var shortestDistance = this.attackRange + 1;
            for (var i in this.game.ennemies) {
                var distance = this.distanceTo(this.game.ennemies[i].x, this.game.ennemies[i].y); 
                if (this.game.ennemies[i].life > 0 && distance < this.attackRange && distance < shortestDistance) {
                    closestEnnemy = this.game.ennemies[i];
                    shortestDistance = distance;
                }
            }
            if (closestEnnemy != null) {
                this.game.addProjectile(this.x, this.y, closestEnnemy.x, closestEnnemy.y, this.attackSpeed, this.attackDamage, true);
                this.lastAttack = time.time;
            }
        }
        
        
    }
};

Character.prototype.goTo = function(_toX, _toY) {
    this.destX = _toX;
    this.destY = _toY;
    this.state = 1;
};


Character.prototype.collidesWith = function(_x,_y, _w, _h) {
return  !(this.x + this.width / 2 < _x - _w/2 ||
            this.x - this.width / 2 > _x + _w/2 ||
            this.y - this.height / 2 > _y + _h / 2 ||
            this.y + this.height / 2 < _y - _h / 2); 
}

Character.prototype.distanceTo = function(_x,_y) {
    return  Math.sqrt(Math.pow(this.x-_x,2)+Math.pow(this.y-_y,2)); 
}

                    
Character.prototype.render = function() {

    // dessin d'un cercle autour du personnage pour le repérer
    if (this.game.selectedCharacter == this) {
        this.game.context.globalAlpha = 0.4;
        this.game.context.fillStyle = "#88FF88";
        this.game.context.beginPath();
        this.game.context.arc(this.x, this.y, this.attackRange, 0, 2*Math.PI);
        this.game.context.fill();
        this.game.context.globalAlpha = 1;
    }
    this.game.context.fillStyle = "#00FF00";
    this.game.context.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
    
    this.game.context.fillStyle = "#000000";
    this.game.context.fillRect(this.x-this.width/2, this.y-this.height/2 - 10, this.width * this.life / this.game.gameRules.character.life.get(), 5)
    
};