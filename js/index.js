import {TextureToSpriteLoader} from "./SpriteLoader.js";
import * as dat from '../../ThreeJS_Anim/node_modules/dat.gui/build/dat.gui.module.js';

const FPS = 60;
let duration = 20;
const step = 1 / (FPS);
let BallTrackSprite;
let ShouldSpin = true;
let time = 0;
const NUMBER_COUNT = 36;
const DesiredNumber = 3;
const SpinCount = 1;

const Angle = 0.1745;
const NumberSequence = [6,21,13,36,11,30,8,23,5,24,18,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26,0,32,15,19,4,21,2,25,17,34];

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function easeBackout(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
}

function RotateObject(t, delta) {
    t += delta;
    if (t < 0 || t > 1) t = -t;
    BallTrackSprite.material.rotation = -lerp(0, Math.PI / 2, ease(t));
}

class WebGLCore {
    constructor(RendererConfigs, CameraConfigs) {
        this.width = RendererConfigs.windowWidth;
        this.height = RendererConfigs.windowHeight;
        this.scene = {};
        this.camera = {};
        this.renderer = {};
        this.controls = {};
        this.clock = {};
        this.RendererConfigs = RendererConfigs;
        this.CameraConfigs = CameraConfigs;
    }

    init() {
        // initializing Core components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.CameraConfigs.fov, this.CameraConfigs.aspectRatio, this.CameraConfigs.far, this.CameraConfigs.near);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.controls = new THREE.TrackballControls(this.camera);
        this.clock = new THREE.Clock();
        this.renderer.setSize(this.RendererConfigs.windowWidth, RendererConfigs.windowHeight);

        // scene background setup
        this.scene.background = new THREE.Color(this.RendererConfigs.sceneColor);
        this.camera.position.z = 120;
        this.camera.position.y = 20;
        document.body.appendChild(this.renderer.domElement);

        // light setup
        let light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 200, 0);
        this.scene.add(light);

        if (this.RendererConfigs.drawGridLines) {
            let grid = new THREE.GridHelper(100, 20, 0x444444, 0xff0000);
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            this.scene.add(grid);
        }

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 200, 100);
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 120;
        this.scene.add(light);

        // Window resize callback
        window.addEventListener('resize', () => this.OnWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        let ElapsedTime = this.clock.getElapsedTime();
        time += step;
        if (BallTrackSprite) {
            if (ShouldSpin) {
                BallTrackSprite.material.rotation = lerp(0, Math.PI * 2 * SpinCount + NumberSequence.indexOf(DesiredNumber) * Angle, easeOutQuart(time / duration));
                console.log(ElapsedTime, time / duration);
            }
        }

        if (time > duration) {
            if (ShouldSpin) {
                console.log(NumberSequence.indexOf(DesiredNumber) * Angle, DesiredNumber);
                console.log('Final Rotation: ' + BallTrackSprite.material.rotation);
            }
            ShouldSpin = false;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    SpriteLoad() {
        this.scene.add(TextureToSpriteLoader.load('Textures/1.png', new THREE.Vector3(240, 240, 1)));
        this.scene.add(TextureToSpriteLoader.load('Textures/2.png', new THREE.Vector3(230, 230, 1)));
        BallTrackSprite = TextureToSpriteLoader.load('Textures/3.png', new THREE.Vector3(180, 180, 1));
        // BallTrackSprite.material.rotation = -0.17;
        this.scene.add(BallTrackSprite);
        this.scene.add(TextureToSpriteLoader.load('Textures/4.png', new THREE.Vector3(245, 245, 1)));
        this.scene.add(TextureToSpriteLoader.load('Textures/5.png', new THREE.Vector3(100, 100, 1)));
    }
}


let CameraConfigs = {
    fov: 95,
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 1,
    far: 2000
};

let RendererConfigs = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    sceneColor: 0xd3d3d3,
    drawGridLines: false
};

let WebGLCoreWrapper = new WebGLCore(RendererConfigs, CameraConfigs);
WebGLCoreWrapper.init();
WebGLCoreWrapper.animate();
WebGLCoreWrapper.SpriteLoad();

const gui = new dat.GUI({resizable: false});


let FizzyText = function () {
    this.explode = function () {
        // Spin Roulette
        ShouldSpin = !ShouldSpin;
    };
};

window.onload = function () {
    let layers = new FizzyText();
    gui.add(layers, 'explode');
};