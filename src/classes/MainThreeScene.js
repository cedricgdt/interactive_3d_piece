import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import CubeFloor from './CubeFloor'

import simpleFrag from '../shaders/simple.frag'
import simpleVert from '../shaders/simple.vert'

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
        this.raycaster
        this.intersects = []
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        this.scene = new THREE.Scene()

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 8, 4)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = config.controls
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0

        //DUMMY CUBE + SIMPLE GLSL SHADER LINKAGE
        const shaderMat = new THREE.ShaderMaterial({
            vertexShader: simpleVert,
            fragmentShader: simpleFrag,
        })
        // const cube = new THREE.Mesh(new THREE.BoxGeometry(), shaderMat)
        // this.scene.add(cube)

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()


        CubeFloor.init(this.scene)

        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        window.addEventListener("mousemove", this.onMouseMove)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        CubeFloor.update(this.intersects)
        this.renderer.render(this.scene, this.camera);
        this.raycaster.setFromCamera( this.mouse, this.camera ); 
    }

    onMouseMove(e) {
        this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        this.intersects = this.raycaster.intersectObjects( this.scene.children[0].children );
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance