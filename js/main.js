// initial setup

const WINDOW_HEIGHT = window.innerHeight;
const WINDOW_WIDTH = window.innerWidth;
let mixer, scene, clock, camera, renderer, controls;

function initWebGLCore(){
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(90, WINDOW_WIDTH / WINDOW_HEIGHT, 1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    controls = new THREE.TrackballControls( camera );
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function SetSceneSettings()
{
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    camera.position.z = 80;
    camera.position.y = 10;
    document.body.appendChild(renderer.domElement);
}

function InitGround()
{
    let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xa8a8a8, depthWrite: false } ) );
    mesh.receiveShadow = true;
    scene.add( mesh );
}

function InitGridHelper()
{
    let grid = new THREE.GridHelper( 100, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
}

function InitLight()
{
    let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );
}

function LoadAnimation()
{
    let loader = new THREE.FBXLoader();
    loader.load('3d/Ball_Anim.fbx', function(object)
    {
        console.log(object);

        mixer = new THREE.AnimationMixer( object );

        let action = mixer.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {
            if( child.material ) {
                // Mesh Material
                child.material = new THREE.MeshPhongMaterial( { color: 0xc60d36 } );
            }
        } );
        scene.add(object);
    });
}

initWebGLCore();
SetSceneSettings();
InitGround();
InitGridHelper();
InitLight();
LoadAnimation();

// rendering loop
function animate() {
    requestAnimationFrame( animate );

    let delta = clock.getDelta();

    if ( mixer ) mixer.update( delta );

    controls.update();
    renderer.render( scene, camera );
}
animate();