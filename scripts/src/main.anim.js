window.onload = function() {
    Crafty.init(400, 336);

    //here the scene code Loading
    Crafty.load(['/assets/sprites.png'], function() {
        Crafty.scene('main');
    });

    //main scene
    Crafty.scene('main', function() {
        //loading sprites sheet
        //load sprites
        Crafty.sprite(16, '/assets/sprites.png', {
            grass1 : [0, 0],
            grass2 : [1, 0],
            grass3 : [2, 0],
            grass4 : [3, 0],
            bush1  : [0, 2],
            flower : [0, 1]
        });

        Crafty.e('2D, DOM, solid, grass1')
            .attr({x : 16 * 5, y : 16 * 5, z: 50});

        Crafty.e('2D, DOM, solid, flower, SpriteAnimation')
            .attr({x : 16 * 5, y : 16 * 5, z: 100})
            .animate('wind', 0, 1, 3)
            .animate('wind', 80, -1);
    });
};