import {TextureToSpriteLoader} from "./SpriteLoader.js";

class WebGLCore {
    constructor(RendererConfigs, CameraConfigs) {
        this.width = RendererConfigs.window_width;
        this.height = RendererConfigs.window_height;
        this.scene = {};
        this.camera = {};
        this.renderer = {};
        this.controls = {};
        this.RendererConfigs = RendererConfigs;
        this.CameraConfigs = CameraConfigs;
    }

    init() {
        // initializing Core components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.CameraConfigs.fov, this.CameraConfigs.aspectRatio, this.CameraConfigs.far, this.CameraConfigs.near);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = new THREE.TrackballControls( this.camera );
        this.renderer.setSize(this.RendererConfigs.window_width, RendererConfigs.window_height);

        // scene background setup
        this.scene.background = new THREE.Color( this.RendererConfigs.sceneColor );
        this.camera.position.z = 120;
        this.camera.position.y = 20;
        document.body.appendChild(this.renderer.domElement);

        // light setup
        let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );


        let grid = new THREE.GridHelper( 100, 20, 0x444444, 0xff0000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add( grid );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = - 100;
        light.shadow.camera.left = - 120;
        light.shadow.camera.right = 120;
        this.scene.add( light );

        // Window resize callback
        window.addEventListener( 'resize', () => this.OnWindowResize(), false );
    }

    animate()
    {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    OnWindowResize()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }
}


let CameraConfigs = {
    fov : 90,
    aspectRatio : window.innerWidth / window.innerHeight,
    near: 1,
    far: 2000
};

let RendererConfigs = {
    window_width: window.innerWidth,
    window_height: window.innerHeight,
    sceneColor: 0xd3d3d3
};

let WebGLCoreWrapper = new WebGLCore(RendererConfigs, CameraConfigs);
WebGLCoreWrapper.init();
WebGLCoreWrapper.animate();
