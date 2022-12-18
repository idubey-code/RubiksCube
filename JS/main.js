import * as THREE from 'three';
import { TrackballControls } from 'https://threejs.org/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { Line2 } from './modules/Line2.js';
import { LineMaterial } from './modules/LineMaterial.js';
import { LineGeometry } from './modules/LineGeometry.js';
import { LineSegments2 } from './modules/LineSegments2.js';
import { LineSegmentsGeometry } from './modules/LineSegmentsGeometry.js';

var scene, camera, renderer, ambientLight, light, controls, rotations, rotMap;
var solve = true;
var [lineMats, allCubes, shuffleList, rotHist] = Array.from({ length: 4 }, () => []);
// var [lineMats, topLayer, bottomLayer, leftLayer, rightLayer, frontLayer, backLayer] = 
// 															Array.from({ length: 7 }, () => []);

function getCube(colorPallete){

 	var geometry = new THREE.BoxGeometry( 10, 10, 10 ).toNonIndexed(); 

	var material = new THREE.MeshBasicMaterial( { vertexColors: true, 
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

function getLayer(cubes,face){

	var layer = [];

	switch(face){

	case "top":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.y > -1) {
				layer.push(cubes[i]);
			}
		}
		break;

	case "bottom":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.y < -21) {
				layer.push(cubes[i]);
			}
		}
		break;

	case "left":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.x < -10) {
				layer.push(cubes[i]);
			}
		}
		break;

	case "right":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.x > 10) {
				layer.push(cubes[i]);
			}
		}
		break;

	case "front":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.z > -1) {
				layer.push(cubes[i]);
			}
		}
		break;

	case "back":
		for (var i = 0; i < cubes.length; i++) {
			if (cubes[i].position.z < -21) {
				layer.push(cubes[i]);
			}
		}
		break;

	default:
		console.log("Error in function getLayer. Input face is invalid.");

	}

	return layer;

};

var u = function rotU(scene,cubes){

	var layer = getLayer(cubes,"top");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.y -= Math.PI/2;
	layerObject.position.set(-11,0,-11);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("U");

};

var uDash = function rotUDash(scene,cubes){

	var layer = getLayer(cubes,"top");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.y += Math.PI/2;
	layerObject.position.set(11,0,-11);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("U'");

};

var d = function rotD(scene,cubes){

	var layer = getLayer(cubes,"bottom");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.y += Math.PI/2;
	layerObject.position.set(11,0,-11);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("D");

};

var dDash = function rotDDash(scene,cubes){

	var layer = getLayer(cubes,"bottom");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.y -= Math.PI/2;
	layerObject.position.set(-11,0,-11);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("D'");

};

var l = function rotL(scene,cubes){

	var layer = getLayer(cubes,"left");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.position.set(0,-22,0);
	layerObject.rotation.x += Math.PI/2;

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("L");

};

var lDash = function rotLDash(scene,cubes){

	var layer = getLayer(cubes,"left");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.x -= Math.PI/2;
	layerObject.position.set(0,0,-22);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("L'");

};

var r = function rotR(scene,cubes){

	var layer = getLayer(cubes,"right");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.x -= Math.PI/2;
	layerObject.position.set(0,0,-22);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("R");

};

var rDash = function rotRDash(scene,cubes){

	var layer = getLayer(cubes,"right");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.x += Math.PI/2;
	layerObject.position.set(0,-22,0);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("R'");

};

var f = function rotF(scene,cubes){

	var layer = getLayer(cubes,"front");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.z -= Math.PI/2;
	layerObject.position.set(11,-11,0);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("F");

};

var fDash = function rotFDash(scene,cubes){

	var layer = getLayer(cubes,"front");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.z += Math.PI/2;
	layerObject.position.set(-11,-11,0);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("F'");

};

var b = function rotB(scene,cubes){

	var layer = getLayer(cubes,"back");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.z += Math.PI/2;
	layerObject.position.set(-11,-11,0);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("B");

};

var bDash = function rotBDash(scene,cubes){

	var layer = getLayer(cubes,"back");

	var layerObject = new THREE.Object3D();

	layerObject.rotation.set( 0, 0, 0 );
	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		layerObject.attach(layer[i]);
	}

	layerObject.rotation.z -= Math.PI/2;
	layerObject.position.set(11,-11,0);

	layerObject.updateMatrixWorld({force:true});

	for (var i = 0; i < layer.length; i++) {
		scene.attach(layer[i]);
	}

	rotHist.push("B'");

};

function shuffle(shuffleList){
	
	for (let i = 0; i < shuffleList.length; i++){
		setTimeout(function() {
			rotations[shuffleList[i]](scene,allCubes);
		}, 100*(i+1));
	}

	solve = false;

};

function autoSolve(){

	if (rotHist.length > 0 && !solve) {

		for (let i = rotHist.length - 1; i >= 0; i--){
			setTimeout(function() {
				rotations[rotMap[rotHist[i]]](scene,allCubes);
			}, 100 * (Math.abs(i - rotHist.length) + 1));
		}

	}

	solve = true;

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
	controls.enabled = false;

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
	allCubes.push(C1);
	allCubes.push(L1);
	scene.attach( C1 );
	scene.attach( L1 );

	//Middle
	var [C2, lMat2, L2] = getCube(['#000000','#000000','#ffd500','#000000','#0046ad','#000000']);
	lineMats.push(lMat2);
	C2.position.set(0,0,0);
	L2.position.set(0,0,0);
	allCubes.push(C2);
	allCubes.push(L2);
	scene.attach( C2 );
	scene.attach( L2 );

	//Right
	var [C3, lMat3, L3] = getCube(['#009b48','#000000','#ffd500','#000000','#0046ad','#000000']);
	lineMats.push(lMat3);
	C3.position.set(11,0,0);
	L3.position.set(11,0,0);
	allCubes.push(C3);
	allCubes.push(L3);
	scene.attach( C3 );
	scene.attach( L3 );

	//-----Front Middle----------
	
	//Left
	var [C4, lMat4, L4] = getCube(['#000000','#ffffff','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat4);
	C4.position.set(-11,-11,0);
	L4.position.set(-11,-11,0);
	allCubes.push(C4);
	allCubes.push(L4);
	scene.attach( C4 );
	scene.attach( L4 );

	//Middle
	var [C5, lMat5, L5] = getCube(['#000000','#000000','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat5);
	C5.position.set(0,-11,0);
	L5.position.set(0,-11,0);
	allCubes.push(C5);
	allCubes.push(L5);
	scene.attach( C5 );
	scene.attach( L5 );

	//Right
	var [C6, lMat6, L6] = getCube(['#009b48','#000000','#000000','#000000','#0046ad','#000000']);
	lineMats.push(lMat6);
	C6.position.set(11,-11,0);
	L6.position.set(11,-11,0);
	allCubes.push(C6);
	allCubes.push(L6);
	scene.attach( C6 );
	scene.attach( L6 );

	//-----Front Bottom----------
	
	//Left
	var [C7, lMat7, L7] = getCube(['#000000','#ffffff','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat7);
	C7.position.set(-11,-22,0);
	L7.position.set(-11,-22,0);
	allCubes.push(C7);
	allCubes.push(L7);
	scene.attach( C7 );
	scene.attach( L7 );

	//Middle
	var [C8, lMat8, L8] = getCube(['#000000','#000000','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat8);
	C8.position.set(0,-22,0);
	L8.position.set(0,-22,0);
	allCubes.push(C8);
	allCubes.push(L8);
	scene.attach( C8 );
	scene.attach( L8 );

	//Right
	var [C9, lMat9, L9] = getCube(['#009b48','#000000','#000000','#b71234','#0046ad','#000000']);
	lineMats.push(lMat9);
	C9.position.set(11,-22,0);
	L9.position.set(11,-22,0);
	allCubes.push(C9);
	allCubes.push(L9);
	scene.attach( C9 );
	scene.attach( L9 );

	//----------------------------------------EO First Layer----------------------------------------------

	//------------------------------------------ Middle Layer --------------------------------------------

	//-----Middle Top----------
	
	//Left
	var [C10, lMat10, L10] = getCube(['#000000','#ffffff','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat10);
	C10.position.set(-11,0,-11);
	L10.position.set(-11,0,-11);
	allCubes.push(C10);
	allCubes.push(L10);
	scene.attach( C10 );
	scene.attach( L10 );

	//Middle
	var [C11, lMat11, L11] = getCube(['#000000','#000000','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat11);
	C11.position.set(0,0,-11);
	L11.position.set(0,0,-11);
	allCubes.push(C11);
	allCubes.push(L11);
	scene.attach( C11 );
	scene.attach( L11 );

	//Right
	var [C12, lMat12, L12] = getCube(['#009b48','#000000','#ffd500','#000000','#000000','#000000']);
	lineMats.push(lMat12);
	C12.position.set(11,0,-11);
	L12.position.set(11,0,-11);
	allCubes.push(C12);
	allCubes.push(L12);
	scene.attach( C12 );
	scene.attach( L12 );

	//-----Middle Middle----------
	
	//Left
	var [C13, lMat13, L13] = getCube(['#000000','#ffffff','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat13);
	C13.position.set(-11,-11,-11);
	L13.position.set(-11,-11,-11);
	allCubes.push(C13);
	allCubes.push(L13);
	scene.attach( C13 );
	scene.attach( L13 );

	//Middle
	var [C14, lMat14, L14] = getCube(['#000000','#000000','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat14);
	C14.position.set(0,-11,-11);
	L14.position.set(0,-11,-11);
	allCubes.push(C14);
	allCubes.push(L14);
	scene.attach( C14 );
	scene.attach( L14 );

	//Right
	var [C15, lMat15, L15] = getCube(['#009b48','#000000','#000000','#000000','#000000','#000000']);
	lineMats.push(lMat15);
	C15.position.set(11,-11,-11);
	L15.position.set(11,-11,-11);
	allCubes.push(C15);
	allCubes.push(L15);
	scene.attach( C15 );
	scene.attach( L15 );

	//-----Middle Bottom----------
	
	//Left
	var [C16, lMat16, L16] = getCube(['#000000','#ffffff','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat16);
	C16.position.set(-11,-22,-11);
	L16.position.set(-11,-22,-11);
	allCubes.push(C16);
	allCubes.push(L16);
	scene.attach( C16 );
	scene.attach( L16 );

	//Middle
	var [C17, lMat17, L17] = getCube(['#000000','#000000','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat17);
	C17.position.set(0,-22,-11);
	L17.position.set(0,-22,-11);
	allCubes.push(C17);
	allCubes.push(L17);
	scene.attach( C17 );
	scene.attach( L17 );

	//Right
	var [C18, lMat18, L18] = getCube(['#009b48','#000000','#000000','#b71234','#000000','#000000']);
	lineMats.push(lMat18);
	C18.position.set(11,-22,-11);
	L18.position.set(11,-22,-11);
	allCubes.push(C18);
	allCubes.push(L18);
	scene.attach( C18 );
	scene.attach( L18 );

	//----------------------------------------EO Middle Layer---------------------------------------------

	//------------------------------------------ Back Layer --------------------------------------------

	//-----Back Top----------
	
	//Left
	var [C19, lMat19, L19] = getCube(['#000000','#ffffff','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat19);
	C19.position.set(-11,0,-22);
	L19.position.set(-11,0,-22);
	allCubes.push(C19);
	allCubes.push(L19);
	scene.attach( C19 );
	scene.attach( L19 );

	//Middle
	var [C20, lMat20, L20] = getCube(['#000000','#000000','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat20);
	C20.position.set(0,0,-22);
	L20.position.set(0,0,-22);
	allCubes.push(C20);
	allCubes.push(L20);
	scene.attach( C20 );
	scene.attach( L20 );

	//Right
	var [C21, lMat21, L21] = getCube(['#009b48','#000000','#ffd500','#000000','#000000','#ff5800']);
	lineMats.push(lMat21);
	C21.position.set(11,0,-22);
	L21.position.set(11,0,-22);
	allCubes.push(C21);
	allCubes.push(L21);
	scene.attach( C21 );
	scene.attach( L21 );

	//-----Back Middle----------
	
	//Left
	var [C22, lMat22, L22] = getCube(['#000000','#ffffff','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat22);
	C22.position.set(-11,-11,-22);
	L22.position.set(-11,-11,-22);
	allCubes.push(C22);
	allCubes.push(L22);
	scene.attach( C22 );
	scene.attach( L22 );

	//Middle
	var [C23, lMat23, L23] = getCube(['#000000','#000000','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat23);
	C23.position.set(0,-11,-22);
	L23.position.set(0,-11,-22);
	allCubes.push(C23);
	allCubes.push(L23);
	scene.attach( C23 );
	scene.attach( L23 );

	//Right
	var [C24, lMat24, L24] = getCube(['#009b48','#000000','#000000','#000000','#000000','#ff5800']);
	lineMats.push(lMat24);
	C24.position.set(11,-11,-22);
	L24.position.set(11,-11,-22);
	allCubes.push(C24);
	allCubes.push(L24);
	scene.attach( C24 );
	scene.attach( L24 );

	//-----Back Bottom----------
	
	//Left
	var [C25, lMat25, L25] = getCube(['#000000','#ffffff','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat25);
	C25.position.set(-11,-22,-22);
	L25.position.set(-11,-22,-22);
	allCubes.push(C25);
	allCubes.push(L25);
	scene.attach( C25 );
	scene.attach( L25 );

	//Middle
	var [C26, lMat26, L26] = getCube(['#000000','#000000','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat26);
	C26.position.set(0,-22,-22);
	L26.position.set(0,-22,-22);
	allCubes.push(C26);
	allCubes.push(L26);
	scene.attach( C26 );
	scene.attach( L26 );

	//Right
	var [C27, lMat27, L27] = getCube(['#009b48','#000000','#000000','#b71234','#000000','#ff5800']);
	lineMats.push(lMat27);
	C27.position.set(11,-22,-22);
	L27.position.set(11,-22,-22);
	allCubes.push(C27);
	allCubes.push(L27);
	scene.attach( C27 );
	scene.attach( L27 );

	//----------------------------------------EO Back Layer-------------------------------------------------

	//-------------------------------------------Rotations--------------------------------------------------

	rotations = {"U": u, "U'": uDash, "D": d, "D'": dDash, "L": l, "L'": lDash,
				 "R": r, "R'": rDash, "F": f, "F'": fDash, "B": b, "B'": bDash};

	shuffleList = ["U","F","F","D'","R","R","F","F","U","L","L","U'","R","R","B","B",
				   "F","D","D","R'","U","U","F","F","L","D'","F","R'","B","B"];

	rotMap = {"U": "U'", "U'": "U", "D": "D'", "D'": "D", "L": "L'", "L'": "L",
			  "R": "R'", "R'": "R", "F": "F'", "F'": "F", "B": "B'", "B'": "B"};
		

	renderer.domElement.onclick = function(){ shuffle(shuffleList);};

	document.onkeydown = function(e){
		if (e.keyCode === 32) {
			autoSolve();
		} 
	};

	//-------------------------------------------Animations--------------------------------------------------

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