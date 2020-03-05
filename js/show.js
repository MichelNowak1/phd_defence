function show(){

    var container, stats;
    var camera, scene, renderer, particle;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    init();
    animate();

    function init() {
        readCSV()
        var geometry = new THREE.Geometry();
        var MAX_POINTS =50;
        ///*
        var positions = new Float32Array( MAX_POINTS * 3 );
        //geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        var x = y = z = index = 0;
        for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
            positions[ index ++ ] = x;
            positions[ index ++ ] = y;
            positions[ index ++ ] = z;
            //x += ( Math.random() - 0.5 ) * 100;
            //y += ( Math.random() - 0.5 ) * 100;
            //z += ( Math.random() - 0.5 ) * 100;
        }
        //*/
        //container = document.createElement( 'div' );
        container = document.getElementById( 'particlesDIV' );
        //document.body.appendChild( container );
        
        // This removes content of div, because when you get back to the slide, it added div windows one after the other
        while(container.firstChild){
                container.removeChild(container.firstChild);
        }
        console.log("window: ",window.innerWidth, window.innerHeight)
        camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 600;
        scene = new THREE.Scene();

        //var geometry = new THREE.BoxGeometry(100, 100, 10, 1, 1, 1);
        var geometry = new THREE.BoxGeometry(500, 500, 10);

        ///wireframe : opacity of the mesh
        var material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        var linematerial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

        //line = new THREE.Line( geometry,  linematerial );
        //scene.add( line );
        //var positions = line.geometry.attributes.position.array;

        var material = new THREE.SpriteMaterial( {
            map: new THREE.CanvasTexture( generateSprite() ),
            blending: THREE.AdditiveBlending
        } );
        for ( var i = 0; i < MAX_POINTS; i++ ) {
            particle = new THREE.Sprite( material );
            line = new THREE.Line( geometry,  linematerial );
            //initParticle( particle, i * 10 );
            geometry.vertices.push(particle.position);
            initParticleAndTrack( particle, line, 0*1000, geometry);
            scene.add( particle );
            //scene.add( line );
        }
        renderer = new THREE.CanvasRenderer();
        //renderer.setClearColor( 0x000040 );
        renderer.setClearColor( 0x000001 );
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth/2., window.innerHeight/2. );
        renderer.setSize( window.innerWidth/2., window.innerHeight/2. );
        container.appendChild( renderer.domElement );
        stats = new Stats();
        //container.appendChild( stats.dom );
        //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        //document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        //document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        //
        //window.addEventListener( 'resize', onWindowResize, false );
    }
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function generateSprite() {
        var canvas = document.createElement( 'canvas' );
        //canvas.width = 16;
        //canvas.height = 16;
        canvas.width = 32;
        canvas.height = 32;
        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
        gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        return canvas;
    }
    function initParticleAndTrack( particle, line, delay, geometry) {
        var particle = this instanceof THREE.Sprite ? this : particle;
        //var particle = particle ;
        particle.scale.x = particle.scale.y = 32;

        var v0 = new THREE.Vector3(-500,-500,0);
        var v1 = new THREE.Vector3(100,200,0);
        var v2 = new THREE.Vector3(100,-200,0);
        var v3 = new THREE.Vector3(-100,-200,0);
        var v4 = new THREE.Vector3(-100,200,0);
        var verticies = [v0];

        //particle.position.set();
        var NBPOS= 10;
        for(var i=1; i<NBPOS; i++){
            var v = new THREE.Vector3(1000*Math.random()-500,1000*Math.random()-500, 0);
            verticies.push(v);
        }

        // Delay
        var delay =100;
        // Particle speed
        speed = 2500.

        part_start=delay
        for(var i=1, len = verticies.length; i<10; i++){
            particle.position.copy(verticies[i-1]);

            dist=Math.sqrt((verticies[i-1].x-verticies[i].x)*(verticies[i-1].x-verticies[i].x)+(verticies[i-1].y-verticies[i].y)*(verticies[i-1].y-verticies[i].y))
            /**
             * Time to transport particle from one position to another.
             *          Particles are moved with the same speed.
             */
            time = dist/speed*2000
            if(i==1)
                time = dist/speed*6000
            console.log("i:", i);
            console.log("time:", time);
            console.log("part_start:", part_start);

            new TWEEN.Tween( particle.position )
                .delay(part_start)
                .to(verticies[i],time)
                //.easing(TWEEN.Easing.Quadratic.Out)
                //.onComplete( initParticleAndTrack )
                .start();
            part_start=part_start+time

            //new TWEEN.Tween( particle.scale )
            //    .delay( delay )
            //    .to( { x: 0.01, y: 0.01 }, 10000 )
            //    .onComplete( initParticleAndTrack )
            //    .start();
        }
       // new TWEEN.Tween( line )
       //     .delay( delay )
       //     .to( {}, time)
       //     //.onComplete( initParticleAndTrack )
       //     .start();
        //new TWEEN.Tween( line.position)
        //    .delay( delay )
        //    .to( { x: X, y: Y, z: Z }, 10000 )
        //    .start();
    }
    //
    function onDocumentMouseMove( event ) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }
    function onDocumentTouchStart( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }
    function onDocumentTouchMove( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }
    //
    function animate() {
        requestAnimationFrame( animate );
        render();
        //stats.update();
    }
    function render() {
        TWEEN.update();
        camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }
    function readCSV() {

        //d3.csv("../data/tracks.csv", function(data) {
        //      console.log(data[0]);
        //});

    }

}
