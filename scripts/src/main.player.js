window.onload = function() {
    Crafty.init(400, 336);

    //main scene
    Crafty.scene('main', function() {
        //load sprites
        Crafty.sprite(16, '/assets/sprites.png', {
            player : [0, 3]
        });

        Crafty
            .e('2D, DOM, player, Ape, RightControls')
            .attr({x : 16, y: 304, z: 1})
            .rightControls(1)
            .ape()
            ;
    });

    //here the scene code Loading
    Crafty.load(['/assets/sprites.png'], function() {
        Crafty.scene('main');
    });
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
            'RIGHT_ARROW': 0,
            'DOWN_ARROW': 90
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
            });
    }
});