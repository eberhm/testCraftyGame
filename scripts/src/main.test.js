//require.config({baseUrl:"/scripts"});

window.onload = function() {
    Crafty.init(400, 336);

    var a = Crafty.e("2D,DOM,Collision,WiredHitBox,Color")
        .attr({x:50, y:50, h: 16, w: 16, z: 2})
        .color('#FCE')
        .collision(new Crafty.polygon([-16,-16],[-16,32],[32, 32], [32, -16]));

    var b = Crafty.e("2D,DOM,Color, tcolision")
        .attr({x:60, y:60, h: 16, w: 16, z: 300})
        .color('#F00');
        //.collision();

    console.log(a.hit('tcolision'));

};