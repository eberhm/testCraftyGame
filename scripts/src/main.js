window.onload = function() {
    Crafty.init(400, 336);

    //here the scene code Loading
    Crafty.scene('loading', function() {
        Crafty.load(['/assets/sprites.png'], function() {
            Crafty.scene('main');
        });

        //Crafty.background('#000');
        Crafty.e('DOM, 2D, Text').attr({x: 150, y: 150, h: 30, w:100}).text('LOADING...').css({'text-align':'center'});
    });

    //main scene
    Crafty.scene('main', function() {
        var player1, player2;

        generateWorld();

        player1 = Crafty
            .e('2D, DOM, player, Ape, LeftControls, TimeBomb')
            .attr({x : 16, y: 304, z: 1})
            .leftControls(1)
            .ape()
            .setBombTime(1000);

        /*
        player2 = Crafty
            .e('2D, DOM, player, Ape, RightControls')
            .attr({x : 368, y: 16, z: 1})
            .rightControls(1)
            .ape();
            */

    });

    //loading scene call
    Crafty.scene('loading');
};

var generateWorld = function() {
    var i, j, grassType;

    //load sprites
    Crafty.sprite(16, '/assets/sprites.png', {
        grass1 : [0, 0],
        grass2 : [1, 0],
        grass3 : [2, 0],
        grass4 : [3, 0],
        flower : [0, 1],
        bush1 : [0, 2],
        bush2 : [1, 2],
        player: [0, 3],
        enemy : [0, 3],
        banana : [4, 0],
        empty : [4, 0]

    });

    //generate green
    for (i = 25 ; i--; ) {
        for (j = 21; j--; ) {

            //grass
            grassType = Crafty.math.randomInt(1, 4);
            Crafty
                .e('2D, DOM, grass'+grassType)
                .attr({
                    x : 16 * i,
                    y : 16 * j,
                    z : 1
                });

            //border bushes
            if (0 === i || 0 === j || 24 === i || 20 === j) {
                Crafty
                    .e('2D, DOM, solid, bush' + Crafty.math.randomInt(1, 2))
                    .attr({
                        x : i * 16,
                        y : j * 16,
                        z : 2
                    });
            }

            //flowers
            if (24 > i && 20 > j && 0 < i && 0 < j
                && Crafty.math.randomInt(0, 50) > 30
                && !(i === 1 && j >= 16)
                && !(i === 23 && j <= 4)) {
                Crafty.e('2D, DOM, solid, flower, SpriteAnimation')
                    .attr({x : 16 * i, y : 16 * j, z: 100})
                    .animate('wind', 0, 1, 3)
                    //.animate('wind', 80, -1)
                    .bind('explode', function() {
                        this.destroy();
                    });
            }

            if (0 === i % 2 && 0 === j % 2) {
                Crafty
                    .e('2D, DOM, solid, bush'+Crafty.math.randomInt(1, 2))
                    .attr({x : i * 16, y: j * 16, z : 200});
            }



        }
    }
};

//components
Crafty.c('LeftControls', {
    init: function () {
        this.requires('Multiway');
    },
    leftControls : function(speed) {
        this.multiway(speed, {W:-90, S:90, D:0, A:180});
        return this;
    }
});

Crafty.c('RightControls', {
    init : function() {
        this.requires('Multiway');
    },
    rightControls : function(speed) {
        return this.multiway(speed, {
            'LEFT_ARROW': 180,
            'UP_ARROW': -90,
            'RIGHT_ARROW': 90,
            'DOWN_ARROW': 0
    });
    }
});

Crafty.c('Ape', {
    init : function() {},
    ape : function() {
        return this.requires('SpriteAnimation, Collision, Grid')
            .animate('walk_left', 6, 3, 8)
            .animate('walk_right', 9, 3, 11)
            .animate('walk_up', 3, 3, 5)
            .animate('walk_down', 0, 3, 2)
            .bind('NewDirection', function(direction) {
                if (direction.x < 0) {
                    if (!this.isPlaying('walk_left')) {
                        this.stop().animate('walk_left', 10, -1);
                    }
                }
                if (direction.x > 0) {
                    if (!this.isPlaying('walk_right')) {
                        this.stop().animate('walk_right', 10, -1);
                    }
                }
                if (direction.y > 0) {
                    if (!this.isPlaying('walk_down')) {
                        this.stop().animate('walk_down', 10, -1);
                    }
                }
                if (direction.y < 0) {
                    if (!this.isPlaying('walk_up')) {
                        this.stop().animate('walk_up', 10, -1);
                    }
                }
                if (!direction.x && !direction.y) {
                    this.stop();
                }
            }).bind('Moved', function(from) {
                if (this.hit('solid')) {
                    this.attr({x: from.x, y: from.y});
                }
            }).onHit('fire', function() {
                this.destroy();
                // Subtract life and play scream sound
            });
    }
});

Crafty.c('TimeBomb', {
    init : function() {
        this.bind('KeyDown', function(e) {
            if (Crafty.keys.SPACE === e.keyCode) {
                this.setBomb(this._timeBomb);
            }
        });
    },
    setBombTime : function(ms) {
        this._timeBomb = ms;
    },
    setBomb : function(ms) {
        console.log("Bomb placed");
        //create a bullet entity
        var bomb = Crafty.e('2D, DOM, banana, Collision, WiredHitBox')
        .attr({
            x : this._x,
            y : this._y,
            h : 17,
            w : 17,
            z : 300
        }).collision(
            [-16, -16],[-16,32],[32,32], [32, -16]);

        setTimeout(function() {

            var hits = bomb.onHit('flower', function(hits) {
                var i;
                for (i in hits) {
                    hits[i].obj.destroy();
                }
            });
            bomb.destroy();
        }, ms);
    }
});