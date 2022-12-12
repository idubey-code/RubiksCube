import * as THREE from 'three';
import { TrackballControls } from 'https://threejs.org/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { Line2 } from '/../JS/modules/Line2.js';
import { LineMaterial } from '/../JS/modules/LineMaterial.js';
import { LineGeometry } from '/../JS/modules/LineGeometry.js';
import { LineSegments2 } from '/../JS/modules/LineSegments2.js';
import { LineSegmentsGeometry } from '/../JS/modules/LineSegmentsGeometry.js';

 var scene, camera, renderer, ambientLight, light, controls, topSide,pivot;
 var lineMats = [];
 var topLayer = [];
 var middleLayer = [];
 var bottomLayer = [];
 var leftLayer = [];
 var middleVerticalLayer = [];
 var rightLayer = [];

 function getCube(colorPallete){

 	var geometry = new THREE.BoxGeometry( 10, 10, 10 ).toNonIndexed(); 

	var material = new THREE.MeshLambertMaterial( { vertexColors: true, 
	                                              polygonOffset: true, 
	                                              polygonOffsetFactor: 1, 
	                                              polygonOffsetUnits: 1} );

	var positionAttribute = geometry.getAttribute( 'position' );
        
    var colors = [];
    var color = new THREE.Color();
        
    for ( let i = 0; i < positionAttribute.count; i += 6 ) {
        
            color.set( colorPallete[(i/6)] );
            
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
        
    }

    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    var mesh = new THREE.Mesh( geometry, material );

    var edges = new THREE.EdgesGeometry( geometry );

    var lineMat = new LineMaterial( {

	  color: 0x000000,
	  linewidth: 2,

	} );

	var lineGeom = new LineSegmentsGeometry().fromEdgesGeometry( edges );

	var line = new Line2( lineGeom, lineMat );
	line.computeLineDistances();
	line.scale.set( 1, 1, 1 );

	return [mesh, lineMat, line];

};

window.onload = function() {

	scene = new THREE.Scene();

	var fov = 40;
	var ratio = window.innerWidth / window.innerHeight;
	var zNear = 1;
	var zFar = 10000;
	camera = new THREE.PerspectiveCamera(fov, ratio, zNear, zFar);
	camera.position.set( -90, 70, 100);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	ambientLight = new THREE.AmbientLight();
	scene.add( ambientLight );

	light = new THREE.DirectionalLight( 0xffffff, 5.0 );
	light.position.set( 10, 100, 10 );
	scene.add( light );

	controls = new OrbitControls( camera, renderer.domElement );

	// Rubik's cube color pallete for reference
	var colorPallete = ['#009b48',  //Green
						'#ffffff', //White
						'#ffd500', //Yellow
						'#b71234', //Red
						'#0046ad', //Blue
						'#ff5800'];  //Orange


	//------------------------------------------ Front Layer ---------------------------------------------

	//-----Front Top----------
	
	//Left
	var [C1, lMat1, L1] = getCube(['#000000','#ffffff','#ffd500','#000000','#0046ad','#000000']);
	lineMats.push(lMat1);
	C1.position.set(-11,0,0);
	L1.position.set(-11,0,0);
	topLayer.push(C1);
	topLayer.push(L1);
	scene.add( C1 );
	scene.add( L1 );

	//Middle
	var [C2, lMat2, L2] = getCube(['#000000','#000000','#ffd500','#000000','#0046ad','#000000']);
	lineMats.push(lMat2);
	C2.position.set(0,0,0);
	L2.position.set(0,0,0);
	topLayer.push(C2);
	topLayer.push(L2);
	scene.add( C2 );
	scene.add( L2 );

	//Right
	var [C3, lMat3, L3] = getCube(['#009b48','#000000','#ffd500','#000000','#0046ad','#000000']);
	lineMats.push(lMat3);
	C3.position.set(11,0,0);
	L3.position.set(11,0,0);
	topLayer.push(C3);
	topLayer.push(L3);
	scene.add( C3 );
	scene.add( L3 );

	//-----Front Middle----------
	
	//Left
	var [C4, lMat4, L4] = getCube(['#000000','#ffffff','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat4);
	C4.position.set(-11,-11,0);
	L4.position.set(-11,-11,0);
	scene.add( C4 );
	scene.add( L4 );

	//Middle
	var [C5, lMat5, L5] = getCube(['#000000','#000000','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat5);
	C5.position.set(0,-11,0);
	L5.position.set(0,-11,0);
	scene.add( C5 );
	scene.add( L5 );

	//Right
	var [C6, lMat6, L6] = getCube(['#009b48','#000000','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat6);
	C6.position.set(11,-11,0);
	L6.position.set(11,-11,0);
	scene.add( C6 );
	scene.add( L6 );

	//-----Front Bottom----------
	
	//Left
	var [C7, lMat7, L7] = getCube(['#000000','#ffffff','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat7);
	C7.position.set(-11,-22,0);
	L7.position.set(-11,-22,0);
	scene.add( C7 );
	scene.add( L7 );

	//Middle
	var [C8, lMat8, L8] = getCube(['#000000','#000000','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat8);
	C8.position.set(0,-22,0);
	L8.position.set(0,-22,0);
	scene.add( C8 );
	scene.add( L8 );

	//Right
	var [C9, lMat9, L9] = getCube(['#009b48','#000000','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat9);
	C9.position.set(11,-22,0);
	L9.position.set(11,-22,0);
	scene.add( C9 );
	scene.add( L9 );

	//----------------------------------------EO First Layer----------------------------------------------

	//------------------------------------------ Middle Layer --------------------------------------------

	//-----Middle Top----------
	
	//Left
	var [C10, lMat10, L10] = getCube(['#000000','#ffffff','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat10);
	C10.position.set(-11,0,-11);
	L10.position.set(-11,0,-11);
	topLayer.push(C10);
	topLayer.push(L10);
	scene.add( C10 );
	scene.add( L10 );

	//Middle
	var [C11, lMat11, L11] = getCube(['#000000','#000000','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat11);
	C11.position.set(0,0,-11);
	L11.position.set(0,0,-11);
	topLayer.push(C11);
	topLayer.push(L11);
	scene.add( C11 );
	scene.add( L11 );

	//Right
	var [C12, lMat12, L12] = getCube(['#009b48','#000000','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat12);
	C12.position.set(11,0,-11);
	L12.position.set(11,0,-11);
	topLayer.push(C12);
	topLayer.push(L12);
	scene.add( C12 );
	scene.add( L12 );

	//-----Middle Middle----------
	
	//Left
	var [C13, lMat13, L13] = getCube(['#000000','#ffffff','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat13);
	C13.position.set(-11,-11,-11);
	L13.position.set(-11,-11,-11);
	scene.add( C13 );
	scene.add( L13 );

	//Middle
	var [C14, lMat14, L14] = getCube(['#000000','#000000','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat14);
	C14.position.set(0,-11,-11);
	L14.position.set(0,-11,-11);
	scene.add( C14 );
	scene.add( L14 );

	//Right
	var [C15, lMat15, L15] = getCube(['#009b48','#000000','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat15);
	C15.position.set(11,-11,-11);
	L15.position.set(11,-11,-11);
	scene.add( C15 );
	scene.add( L15 );

	//-----Middle Bottom----------
	
	//Left
	var [C16, lMat16, L16] = getCube(['#000000','#ffffff','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat16);
	C16.position.set(-11,-22,-11);
	L16.position.set(-11,-22,-11);
	scene.add( C16 );
	scene.add( L16 );

	//Middle
	var [C17, lMat17, L17] = getCube(['#000000','#000000','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat17);
	C17.position.set(0,-22,-11);
	L17.position.set(0,-22,-11);
	scene.add( C17 );
	scene.add( L17 );

	//Right
	var [C18, lMat18, L18] = getCube(['#009b48','#000000','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat18);
	C18.position.set(11,-22,-11);
	L18.position.set(11,-22,-11);
	scene.add( C18 );
	scene.add( L18 );

	//----------------------------------------EO Middle Layer---------------------------------------------

	//------------------------------------------ Back Layer --------------------------------------------

	//-----Back Top----------
	
	//Left
	var [C19, lMat19, L19] = getCube(['#000000','#ffffff','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat19);
	C19.position.set(-11,0,-22);
	L19.position.set(-11,0,-22);
	topLayer.push(C19);
	topLayer.push(L19);
	scene.add( C19 );
	scene.add( L19 );

	//Middle
	var [C20, lMat20, L20] = getCube(['#000000','#000000','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat20);
	C20.position.set(0,0,-22);
	L20.position.set(0,0,-22);
	topLayer.push(C20);
	topLayer.push(L20);
	scene.add( C20 );
	scene.add( L20 );

	//Right
	var [C21, lMat21, L21] = getCube(['#009b48','#000000','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat21);
	C21.position.set(11,0,-22);
	L21.position.set(11,0,-22);
	topLayer.push(C21);
	topLayer.push(L21);
	scene.add( C21 );
	scene.add( L21 );

	//-----Back Middle----------
	
	//Left
	var [C22, lMat22, L22] = getCube(['#000000','#ffffff','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat22);
	C22.position.set(-11,-11,-22);
	L22.position.set(-11,-11,-22);
	scene.add( C22 );
	scene.add( L22 );

	//Middle
	var [C23, lMat23, L23] = getCube(['#000000','#000000','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat23);
	C23.position.set(0,-11,-22);
	L23.position.set(0,-11,-22);
	scene.add( C23 );
	scene.add( L23 );

	//Right
	var [C24, lMat24, L24] = getCube(['#009b48','#000000','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat24);
	C24.position.set(11,-11,-22);
	L24.position.set(11,-11,-22);
	scene.add( C24 );
	scene.add( L24 );

	//-----Back Bottom----------
	
	//Left
	var [C25, lMat25, L25] = getCube(['#000000','#ffffff','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat25);
	C25.position.set(-11,-22,-22);
	L25.position.set(-11,-22,-22);
	scene.add( C25 );
	scene.add( L25 );

	//Middle
	var [C26, lMat26, L26] = getCube(['#000000','#000000','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat26);
	C26.position.set(0,-22,-22);
	L26.position.set(0,-22,-22);
	scene.add( C26 );
	scene.add( L26 );

	//Right
	var [C27, lMat27, L27] = getCube(['#009b48','#000000','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat27);
	C27.position.set(11,-22,-22);
	L27.position.set(11,-22,-22);
	scene.add( C27 );
	scene.add( L27 );

	//----------------------------------------EO Back Layer-------------------------------------------------

	topSide = new THREE.Object3D();
		for (var i = 0; i < topLayer.length; i++) {
			topSide.add(topLayer[i]);
		}

	scene.add(topSide);

	var rot = 0;

	renderer.domElement.onclick = function(e){

			rot += 1.57;

			if (rot < 6.28) {

				topSide.rotation.y += rot;

				if (rot === 1.57) {
					topSide.position.set(11,0,-11);
				}

				if (rot === 3.14) {
					topSide.position.set(-11,0,-11);
				}

				if (rot === 4.71) {
					topSide.position.set(0,0,-22);
				}

			}

			else {

				topSide.rotation.y -= (6.28 - 3.14);
				topSide.position.set(0,0,0);
				rot = 0;
			}

		};


	animate();

};

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	for (var i = 0; i < lineMats.length; i++) {
		lineMats[i].resolution.set( window.innerWidth, window.innerHeight );
	}
	renderer.render( scene, camera );

};