
function sphere(){

    class Track{
        constructor(id) {
            this.id = id;
            this.branches=[];
        }
        get_branches(){
            return this.branches;
        }
    }

    class Branch{
        constructor(id, ams_ite,mother_track) {
            this.id = id;
            this.ams_ite= ams_ite;
            this.mother_track= mother_track;
            this.points=[];
        }
        get_points(){
            return this.points;
        }
    }

    class Point{
        constructor(x,y,z,energy,w,v) {
            this.position = new THREE.Vector3(x,y,z);
            this.energy = energy;
            this.weight = w;
            this.volume= v;
        }
        get_position(){
            return this.position;
        }
    }

    var tracks=[];
    var container, stats;
    var camera, scene, renderer, particle;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // load AMS tracks
    readCSV(tracks);

    //console.log(" nb of track ",tracks.length);
    // animate tracks forward
    forward(tracks);
    //animate();

    function forward(tracks) {

        var geometry = new THREE.Geometry();
        var MAX_POINTS = tracks.length;
        console.log("MAX_POINTS :", MAX_POINTS);
        ///*
        var positions = new Float32Array( MAX_POINTS * 3 );
        //geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        var x = y = z = index = 0;
        for ( var i = 0, l = MAX_POINTS-1; i < l; i ++ ) {
            positions[ index ++ ] = x;
            positions[ index ++ ] = y;
            positions[ index ++ ] = z;
            //x += ( Math.random() - 0.5 ) * 100;
            //y += ( Math.random() - 0.5 ) * 100;
            //z += ( Math.random() - 0.5 ) * 100;
        }
        //*/
        //container = document.createElement( 'div' );
        container = document.getElementById( 'SphereDiv' );
        //document.body.appendChild( container );

        // This removes content of div, because when you get back to the slide, it added div windows one after the other
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        console.log("window: ",window.innerWidth, window.innerHeight)
        camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 8;
        scene = new THREE.Scene();

        //var geometry = new THREE.BoxGeometry(100, 100, 10, 1, 1, 1);
        var geometry = new THREE.BoxGeometry(500, 500, 10);
        ///wireframe : opacity of the mesh
        var material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false});
        var linematerial = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth:0, visible:false,transparent:true} );
        linematerial.opacity=0.1;

        var material = new THREE.SpriteMaterial( {
            map: new THREE.CanvasTexture( generateSprite() ),
            blending: THREE.AdditiveBlending
        } );
        var material2 = new THREE.SpriteMaterial( {
            map: new THREE.CanvasTexture( generateSprite2() ),
            blending: THREE.AdditiveBlending
        } );

        for ( var i = 0; i < MAX_POINTS; i++ ) {
            particle = new THREE.Sprite( material );
            line = new THREE.Line( geometry,  linematerial );
            geometry.vertices.push(particle.position);
            branch = tracks[i].get_branches()[0];

            initBranch( particle, line, 0*1000, geometry, branch);
            //scene.add( particle );
        }
        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor( 0x000001 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth/2.0, window.innerHeight/2.0);
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        container.appendChild( renderer.domElement );
        animate();
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
        canvas.width = 16;
        canvas.height = 16;
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
    function generateSprite2() {
        var canvas = document.createElement( 'canvas' );
        //canvas.width = 16;
        //canvas.height = 16;
        canvas.width = 16;
        canvas.height = 16;
        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(255,0,0,1)' );
        gradient.addColorStop( 0.4, 'rgba(64,0,0,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        return canvas;
    }
    function changeCC(canvas) {
        //canvas.width = 16;
        //canvas.height = 16;
        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(255,0,0,1)' );
        gradient.addColorStop( 0.4, 'rgba(64,0,0,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        return canvas;
    }
    function initBranch( particle, line, delay, geometry, branch) {
        var particle = this instanceof THREE.Sprite ? this : particle;
        //var particle = particle ;
        particle.scale.x = particle.scale.y = 0.5;

        var nb_points=branch.get_points().length;

    //    if(nb_points<100)
    //        return 0;
        var verticies=[];
        for (var i=0; i<nb_points; i++){
            var point = branch.get_points()[i];
            var pos=point.get_position();
            pos.z=0;
            verticies.push(pos);
        }

        //particle.position.set();
        //var NBPOS= 10;
        //for(var i=1; i<NBPOS; i++){
        //    var v = new THREE.Vector3(1000*Math.random()-500,1000*Math.random()-500, 0);
        //    verticies.push(v);
        //}

        var linematerial = new THREE.LineBasicMaterial( { color: 'rgba(255,255,255,1)', linewidth:1, transparent:false} );
        //var linematerial = new THREE.LineBasicMaterial( { color: 0xff0000} );
        linematerial.opacity=0.5;

        // Delay
        var delay =100;
        // Particle speed
        speed = 2500.;

        //console.log("KEYES :",particle);
        part_start=delay;
        len = verticies.length;

        function plotBypass(){
            var geo_left= new THREE.Geometry();
            geo_left.vertices.push(new THREE.Vector3(-40,-40,0));
            geo_left.vertices.push(new THREE.Vector3(-40,40,0));
            ln_left= new THREE.Line( geo_left,  linematerial );

            var geo_right= new THREE.Geometry();
            geo_right.vertices.push(new THREE.Vector3(40,-40,0));
            geo_right.vertices.push(new THREE.Vector3(40,40,0));
            ln_right= new THREE.Line( geo_right,  linematerial );

            var geo_top= new THREE.Geometry();
            geo_top.vertices.push(new THREE.Vector3(-40,40,0));
            geo_top.vertices.push(new THREE.Vector3(40,40,0));
            ln_top= new THREE.Line( geo_top,  linematerial );

            var geo_bottom= new THREE.Geometry();
            geo_bottom.vertices.push(new THREE.Vector3(-40,-40,0));
            geo_bottom.vertices.push(new THREE.Vector3(40,-40,0));
            ln_bottom= new THREE.Line( geo_bottom,  linematerial );

            scene.add(ln_left);
            scene.add(ln_right);
            scene.add(ln_top);
            scene.add(ln_bottom);

            var geo_leftout= new THREE.Geometry();
            geo_leftout.vertices.push(new THREE.Vector3(-30,-30,0));
            geo_leftout.vertices.push(new THREE.Vector3(-30,30,0));
            ln_leftout= new THREE.Line( geo_leftout,  linematerial );

            var geo_rightout= new THREE.Geometry();
            geo_rightout.vertices.push(new THREE.Vector3(30,-30,0));
            geo_rightout.vertices.push(new THREE.Vector3(30,30,0));
            ln_rightout= new THREE.Line( geo_rightout,  linematerial );

            var geo_topout= new THREE.Geometry();
            geo_topout.vertices.push(new THREE.Vector3(-30,30,0));
            geo_topout.vertices.push(new THREE.Vector3(30,30,0));
            ln_topout= new THREE.Line( geo_topout,  linematerial );

            var geo_bottomout= new THREE.Geometry();
            geo_bottomout.vertices.push(new THREE.Vector3(-30,-30,0));
            geo_bottomout.vertices.push(new THREE.Vector3(30,-30,0));
            ln_bottomout= new THREE.Line( geo_bottomout,  linematerial );

            scene.add(ln_leftout);
            scene.add(ln_rightout);
            scene.add(ln_topout);
            scene.add(ln_bottomout);
        }

        function addEye(){

            var loader = new THREE.TextureLoader();

            var matEye= new THREE.MeshLambertMaterial({
                map: loader.load('figures/eyemc.jpg')
            });

            //create a plane geometry for the image with a width of 10
            // and a height that preserves the image's aspect ratio
            var geoEye= new THREE.PlaneGeometry(10, 10);


            // combine our image geometry and material into a mesh
            var meshEye = new THREE.Mesh(geoEye, matEye);

            // set the position of the image mesh in the x,y,z dimensions
            meshEye.position.set(6,3.5,0);
            meshEye.rotateZ(Math.PI+Math.PI/7.);
            meshEye.scale.set(0.2,0.2,1);

            // add the image to the scene
            scene.add(meshEye);
            // Add a point light with #fff color, .7 intensity, and 0 distance
            //var light = new THREE.PointLight( 0xffffff, 1, 0 );
            //// Specify the light's position
            //light.position.set(1, 1, 100 );
            //// Add the light to the scene
            //scene.add(light)
            
        }
        //addEye();
        //plotBypass();

        for(var i=1; i<len; i++){
            particle.position.copy(verticies[i-1]);

            dist=Math.sqrt(
                (verticies[i-1].x-verticies[i].x)*(verticies[i-1].x-verticies[i].x)+
                (verticies[i-1].y-verticies[i].y)*(verticies[i-1].y-verticies[i].y)+
                (verticies[i-1].z-verticies[i].z)*(verticies[i-1].z-verticies[i].z));
            /**
             * Time to transport particle from one position to another.
             *          Particles are moved with the same speed.
             */
            time = dist/(speed/700000);
            //console.log("i:", i);
            //console.log("time:", time);
            //console.log("part_start:", part_start);


            var geo= new THREE.Geometry();
            geo.vertices.push(verticies[i-1])
            geo.vertices.push(verticies[i])
            ln= new THREE.Line( geo,  linematerial );
            scene.add(ln);


            new TWEEN.Tween( particle.position )
                .delay(part_start)
                .to(verticies[i],time)
                .start();

            var material2 = new THREE.SpriteMaterial( {
                map: new THREE.CanvasTexture( generateSprite2() ),
                blending: THREE.AdditiveBlending
            } );
             if(i==len-1){
                 //t4killed = new THREE.Sprite( material2 );
                 //t4killed.position.copy(verticies[i]);
                 //t4killed.scale.x = t4killed.scale.y = 0;
                 //scene.add(t4killed);

                // new TWEEN.Tween(t4killed.scale)
                //.delay(part_start+time)
                //.to({x:4,y:4},0)
                //.start();

                // new TWEEN.Tween(particle.scale)
                //.delay(part_start+time)
                //.to({x:0,y:0},0)
                //.start();

                 new TWEEN.Tween(particle.material.color)
                .delay(part_start+time)
                .to({r:0,g:0,b:0},0)
                .start();
            }
//            var v0 = new THREE.Vector3(0,0,0);
//                new TWEEN.Tween( particle.position)
//                .delay(part_start)
//                .to(v0,time)
//                .start();

            //new TWEEN.Tween( ln)
            //    .delay( part_start)
            //    .start();


            part_start=part_start+time

            //new TWEEN.Tween( particle.scale )
            //    .delay( delay )
            //    .to( { x: 0.01, y: 0.01 }, 10000 )
            //    .onComplete( initParticleAndTrack )
            //    .start();
        }
        //new TWEEN.Tween( line.position)
        //    .delay( delay )
        //    .to( { x: X, y: Y, z: Z }, 10000 )
        //    .start();
    }
    //tween.onUpdate(funcion() {
    //        geo.vertices.push(particle.position);
    //});
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
        //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }
    function readCSV(tracks) {
        jQuery.ajaxSetup({async:false});
        jQuery.get('tracks/sphere_analog_tracks.csv', function(data) {
            var lines = data.split("\n");

           var current_track, current_branch;
           for (var i = 0, len = lines.length; i < len; i++) {
                var words=lines[i].split(";")

                // Reading number of tracks
                if (words[0].localeCompare("nb_tracks")==0){
                    var N = parseInt(words[1], 10);
                    //console.log('reading file with ',N,' tracks');
                }

                // Reading track
                if (words[0].localeCompare("track")==0){
                    var id = parseInt(words[1], 10);
                    current_track = new Track(id);
                    tracks.push(current_track);
                    //console.log('reading track with id ',id);
                }

                // Reading branch
                if (words[0].localeCompare("branch")==0){
                    var id = parseInt(words[1], 10);
                    var ams_ite = parseInt(words[3], 10);
                    var mother_track = parseInt(words[4], 10);
                    //console.log(" AMS ite " ,tracks.length, ams_ite)
                    current_branch= new Branch(id,ams_ite,mother_track);
                    current_track.get_branches().push(current_branch);
                    //console.log('reading branch with id ',id);
                }

                // Reading point
                if (words[0].localeCompare("point")==0){
                    var x = parseFloat(words[1], 10);
                    var y = parseFloat(words[2], 10);
                    var z = parseFloat(words[3], 10);

                    var e = parseFloat(words[4], 10);
                    var w = parseFloat(words[5], 10);
                    var v = parseFloat(words[6], 10);
                    current_branch.get_points().push(new Point(x,y,z,e,w,v))
                    //console.log('reading point');
                }
            }
        });
    }
}
