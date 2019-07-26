import {TextureToSpriteLoader} from "./SpriteLoader.js";
import * as dat from '../../ThreeJS_Anim/node_modules/dat.gui/build/dat.gui.module.js';

const FPS = 60;
let duration = 20;
const step = 1 / (FPS);
let BallTrackSprite;
let NumberSprite;
let time = 0;
let DesiredNumber = 18;
const SpinCount = 10;
let Offset = 0;
const GameState = {
    idle: 1,
    spinning: 2
};

let CurrentGameState = GameState.idle;

const SingleNumberAngle = -0.1698;
const NumberSequence = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

class Roulette {
    static Spin(time) {
        if (!BallTrackSprite) return;

        BallTrackSprite.material.rotation = -lerp(Offset, Math.PI * 2 * SpinCount + NumberSequence.indexOf(DesiredNumber) * SingleNumberAngle, easeOutQuart(time / duration));
    }
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

        // light = new THREE.DirectionalLight(0xffffff);
        // light.position.set(0, 200, 100);
        // light.castShadow = true;
        // light.shadow.camera.top = 180;
        // light.shadow.camera.bottom = -100;
        // light.shadow.camera.left = -120;
        // light.shadow.camera.right = 120;
        // this.scene.add(light);

        // Window resize callback
        window.addEventListener('resize', () => this.OnWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (CurrentGameState === GameState.spinning) {
            time += step;
            Roulette.Spin(time);

            if (time > duration) {
                CurrentGameState = GameState.idle;
                time = 0;
                Offset = BallTrackSprite.material.rotation / (Math.PI * 2);
            }
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
        BallTrackSprite = TextureToSpriteLoader.load('Textures/test.png', new THREE.Vector3(180, 180, 1));
        this.scene.add(BallTrackSprite);
        this.scene.add(TextureToSpriteLoader.load('Textures/4.png', new THREE.Vector3(245, 245, 1)));
        this.scene.add(TextureToSpriteLoader.load('Textures/5.png', new THREE.Vector3(100, 100, 1)));
        // NumberSprite = TextureToSpriteLoader.load(('Textures/Num20.png'), new THREE.Vector3(90,90,1));
        // this.scene.add(TextureToSpriteLoader.load('Textures/Num0.png', new THREE.Vector3(100, 100, 1)));
        this.scene.add(NumberSprite);
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

const gui = new dat.GUI();


let FizzyText = function () {
    this.spin = function () {
        // Spin Roulette
        if (CurrentGameState === GameState.spinning) return;
        CurrentGameState = GameState.spinning;
        DesiredNumber = THREE.Math.randInt(0, 36);
        console.log('Desired Number: ' + DesiredNumber);
        // let Angle = Math.PI * 2 * SpinCount + NumberSequence.indexOf(DesiredNumber) * SingleNumberAngle
        // console.log('Desired angle: ' + Angle, Offset, BallTrackSprite.material.rotation);
    };
};

window.onload = function () {
    let layers = new FizzyText({resizable: false});
    gui.add(layers, 'spin');
};