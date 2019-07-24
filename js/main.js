// // initial setup
//
// class WebGLCore {
//     constructor(windowWidth, windowHeight)
//     {
//         this.windowWidth = windowWidth;
//         this.windowHeight = windowHeight;
//         this.scene = {};
//         this.camera = {};
//         this.renderer = {};
//         this.controls = {};
//         this.clock = {};
//
//         init();
//     }
//
//     static init()
//     {
//         scene = new THREE.Scene();
//         clock = new THREE.Clock();
//         camera = new THREE.PerspectiveCamera(90, WINDOW_WIDTH / WINDOW_HEIGHT, 1, 2000);
//         renderer = new THREE.WebGLRenderer({ antialias: true });
//         controls = new THREE.TrackballControls( camera );
//         renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
//     }
// }
//
// class TextureToSpriteLoader {
//
//     static load(TexturePath, scale)
//     {
//         let spriteMap = new THREE.TextureLoader().load(TexturePath);
//         let spriteMaterial = new THREE.SpriteMaterial({
//             map: spriteMap,
//             color: 0xffffff,
//         });
//         let sprite = new THREE.Sprite(spriteMaterial);
//         sprite.scale.set(scale.x, scale.y, scale.z);
//         // WebGLCore.scene.add(sprite);
//     }
// }
//
// const WINDOW_HEIGHT = window.innerHeight;
// const WINDOW_WIDTH = window.innerWidth;
// let mixer, scene, clock, camera, renderer, controls;
//
//
// function initWebGLCore(){
//     scene = new THREE.Scene();
//     clock = new THREE.Clock();
//     camera = new THREE.PerspectiveCamera(90, WINDOW_WIDTH / WINDOW_HEIGHT, 1, 2000);
//     // camera = new THREE.OrthographicCamera(90, WINDOW_WIDTH / WINDOW_HEIGHT, 1, 2000);
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     controls = new THREE.TrackballControls( camera );
//     renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
// }
//
// function SetSceneSettings()
// {
//     scene.background = new THREE.Color( 0xa0a0a0 );
//     // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
//     camera.position.z = 120;
//     camera.position.y = 20;
//     document.body.appendChild(renderer.domElement);
// }
//
// function importTextureAsSprite()
// {
//     // TextureToSpriteLoader.load('Textures/1.png', new THREE.Vector3(210,210,1));
//     // TextureToSpriteLoader.load('Textures/3.png', new THREE.Vector3(200,200,1));
// }
//
// function InitGround()
// {
//     let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xa8a8a8, depthWrite: false } ) );
//     mesh.receiveShadow = true;
//     scene.add( mesh );
// }
//
// function InitGridHelper()
// {
//     let grid = new THREE.GridHelper( 100, 20, 0x000000, 0x000000 );
//     grid.material.opacity = 0.2;
//     grid.material.transparent = true;
//     scene.add( grid );
// }
//
// function InitLight()
// {
//     let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
//     light.position.set( 0, 200, 0 );
//     scene.add( light );
//
//     light = new THREE.DirectionalLight( 0xffffff );
//     light.position.set( 0, 200, 100 );
//     light.castShadow = true;
//     light.shadow.camera.top = 180;
//     light.shadow.camera.bottom = - 100;
//     light.shadow.camera.left = - 120;
//     light.shadow.camera.right = 120;
//     scene.add( light );
// }
//
// function LoadAnimation()
// {
//     let loader = new THREE.FBXLoader();
//     loader.load('3d/Ball_Anim.fbx', function(object)
//     {
//         console.log(object);
//
//         mixer = new THREE.AnimationMixer( object );
//
//         let action = mixer.clipAction( object.animations[ 0 ] );
//         action.play();
//
//         object.traverse( function ( child ) {
//             if( child.material ) {
//                 // Mesh Material
//                 child.material = new THREE.MeshPhongMaterial( { color: 0xc60d36 } );
//             }
//         } );
//         scene.add(object);
//     });
// }
//
// WebGLCore.init();
//
// initWebGLCore();
// SetSceneSettings();
// // InitGround();
// // InitGridHelper();
// InitLight();
// importTextureAsSprite();
// // LoadAnimation();
// // rendering loop
// function animate() {
//     requestAnimationFrame( animate );
//
//     let delta = clock.getDelta();
//     let ElapsedTime = clock.getElapsedTime();
//
//     // if(ElapsedTime > 3 && ElapsedTime < 6)
//     // {
//     //     RotationSpeed = Math.PI / 64;
//     // }
//     // else if(ElapsedTime > 6 && ElapsedTime < 9)
//     // {
//     //     RotationSpeed = Math.PI / 128;
//     // }
//     // else
//     // {
//     //     RotationSpeed = 0;
//     // }
//
//     if ( mixer ) mixer.update( delta );
//
//     controls.update();
//     renderer.render( scene, camera );
// }
// animate();