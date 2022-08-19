import * as THREE from 'three'
import gsap from 'gsap'

class CubeFloor {
  constructor() {
      this.bind()

      this.cubeGroup = new THREE.Group()
      this.animationRuning = false
      this.params = {
        xNum:50,
        zNum:50,
        wIntensity: 0,
        wMaxIntensity: 2,
        duration: 0.25,
        wStartHeight: 0.1
      }
  }

  init(scene) {
    this.scene = scene
    this.intersects = []
    this.wOrigin = new THREE.Vector3(0,0,0)

    const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial({
      wireframe: false,
    }))

    for (let x = 0; x < this.params.xNum; x++) {
      for (let z = 0; z < this.params.zNum; z++) {
        const clone = cube.clone()
        clone.position.set(x - this.params.xNum / 2, 0, z - this.params.zNum / 2)
        this.cubeGroup.add(clone)
      }
    }
    this.scene.add(this.cubeGroup)
    window.addEventListener('click', this.onMouseDown)
  }

  onMouseDown(e) {
    if (!this.animationRuning) {
      this.animationRuning = true
      gsap.timeline()
      .to(this.params, {
        wIntensity: this.params.wMaxIntensity,
        duration: this.params.duration
      })
      .to(this.params, {
        delay: this.params.duration,
        wIntensity: this.params.wIntensity,
        duration: this.params.duration,
        onComplete: () => {
          console.log("Complete")
          this.animationRuning = false
        }
      })
    }
  }

  update(intersects) {
      if (!this.animationRuning) {
        this.intersects = intersects
        if (this.intersects.length >= 1) {
          this.wOrigin = this.intersects[0].object.position
        }
      }

      let i = 0
      while(i < this.cubeGroup.children.length) {
        const d = this.wOrigin.distanceTo(this.cubeGroup.children[i].position)
        this.cubeGroup.children[i].scale.y = ((Math.sin(Date.now() * 0.01 - d) + 1) * 0.5) * this.params.wIntensity + this.params.wStartHeight
        i++
      }
  }

  bind() {
    this.onMouseDown = this.onMouseDown.bind(this)
  }
}

const _instance = new CubeFloor()
export default _instance