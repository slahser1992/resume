import React, {Component, Fragment} from "react";
import * as THREE from "three";
import {GPUComputationRenderer} from "gpucomputationrender-three";
import {fragmentShaderPosition, fragmentShaderVelocity, birdFS, birdVS} from "./shaderText";
import {PositionUniform, VelocityUniform, BirdsUniform} from "./interface"

let hash: number = Number(document.location.hash.substr(1));
const WIDTH = hash || 32;
const BIRDS = WIDTH * WIDTH;

class BirdGeometry extends THREE.BufferGeometry {

  private v: number = 0;
  private triangles: number = BIRDS * 3;
  private points: number = this.triangles * 3;
  static wingsSpan = 20;

  private updateVertex(matrix: number[]) {
    for (let i = 0; i < matrix.length; i++) {
      // @ts-ignore
      this.vertices.array[this.v++] = matrix[i];
    }
  };

  private updateBirdsVertex() {
    for (let i = 0; i < BIRDS; i++) {
      // Body
      this.updateVertex(
        [
          0, -0, -20,
          0, 4, -20,
          0, 0, 30
        ]
      );
      // Left Wing
      this.updateVertex(
        [
          0, 0, -15,
          -BirdGeometry.wingsSpan, 0, 0,
          0, 0, 15
        ]
      );
      // Right Wing
      this.updateVertex(
        [
          0, 0, 15,
          BirdGeometry.wingsSpan, 0, 0,
          0, 0, -15
        ]
      );
    }
  };

  private updateBirds() {
    for ( let v = 0; v < this.triangles * 3; v ++ ) {
      const i = ~ ~ ( v / 3 );
      const x = ( i % WIDTH ) / WIDTH;
      const y = ~ ~ ( i / WIDTH ) / WIDTH;
      const c = new THREE.Color(
        0x444444 +
        ~ ~ ( v / 9 ) / BIRDS * 0x666666
      );
      // @ts-ignore
      this.birdColors.array[ v * 3 ] = c.r;
      // @ts-ignore
      this.birdColors.array[ v * 3 + 1 ] = c.g;
      // @ts-ignore
      this.birdColors.array[ v * 3 + 2 ] = c.b;
      // @ts-ignore
      this.references.array[ v * 2 ] = x;
      // @ts-ignore
      this.references.array[ v * 2 + 1 ] = y;
      // @ts-ignore
      this.birdVertex.array[ v ] = v % 9;
    }
  };

  vertices: THREE.BufferAttribute =
    new THREE.BufferAttribute(new Float32Array(this.points * 3), 3);
  birdColors: THREE.BufferAttribute =
    new THREE.BufferAttribute(new Float32Array(this.points * 3), 3);
  references: THREE.BufferAttribute =
    new THREE.BufferAttribute(new Float32Array(this.points * 2), 2);
  birdVertex: THREE.BufferAttribute =
    new THREE.BufferAttribute(new Float32Array(this.points), 1);

  constructor() {
    super();

    this.addAttribute('position', this.vertices);
    this.addAttribute('birdColor', this.birdColors);
    this.addAttribute('reference', this.references);
    this.addAttribute('birdVertex', this.birdVertex);

    this.updateBirdsVertex();
    this.updateBirds();
    this.scale(0.2, 0.2, 0.2);
  }
}

class Background extends Component<{}>{

  private camera: THREE.PerspectiveCamera =
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 3000);
  private scene: THREE.Scene =
    new THREE.Scene();
  private renderer: THREE.WebGLRenderer =
    new THREE.WebGLRenderer();
  private gpuCompute: GPUComputationRenderer =
    new GPUComputationRenderer(WIDTH, WIDTH, this.renderer);
  private velocityVariable: any;
  private positionVariable: any;
  private positionUniforms : PositionUniform = {};
  private velocityUniforms: VelocityUniform = {};
  private BOUNDS = 800;
  private BOUNDS_HALF = this.BOUNDS / 2;
  private last = performance.now();
  private mouseX = 0;
  private mouseY = 0;
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;

  private birdUniforms: BirdsUniform = {
    "color": { value: new THREE.Color( 0xff2200 ) },
    "texturePosition": { value: null },
    "textureVelocity": { value: null },
    "time": { value: 1.0 },
    "delta": { value: 0.0 }
  };

  private initBirds() {
    const geometry = new BirdGeometry();

    // ShaderMaterial
    const material = new THREE.ShaderMaterial( {
      uniforms: this.birdUniforms,
      vertexShader: birdVS,
      fragmentShader: birdFS,
      side: THREE.DoubleSide
    } );
    const birdMesh = new THREE.Mesh( geometry, material );
    birdMesh.rotation.y = Math.PI / 2;
    birdMesh.matrixAutoUpdate = false;
    birdMesh.updateMatrix();
    this.scene.add( birdMesh );
  }

  private initComputeRenderer() {
    const dtPosition = this.gpuCompute.createTexture();
    const dtVelocity = this.gpuCompute.createTexture();
    this.fillPositionTexture( dtPosition );
    this.fillVelocityTexture( dtVelocity );
    this.velocityVariable = this.gpuCompute.addVariable(
      "textureVelocity", fragmentShaderVelocity, dtVelocity);
    this.positionVariable = this.gpuCompute.addVariable(
      "texturePosition", fragmentShaderPosition, dtPosition);
    this.gpuCompute.setVariableDependencies(
      this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    this.gpuCompute.setVariableDependencies(
      this.positionVariable, [this.positionVariable, this.velocityVariable]);
    this.positionUniforms = this.positionVariable.material.uniforms;
    this.velocityUniforms = this.velocityVariable.material.uniforms;
    this.positionUniforms[ "time" ] = { value: 0.0 };
    this.positionUniforms[ "delta" ] = { value: 0.0 };
    this.velocityUniforms[ "time" ] = { value: 1.0 };
    this.velocityUniforms[ "delta" ] = { value: 0.0 };
    this.velocityUniforms[ "testing" ] = { value: 1.0 };
    this.velocityUniforms[ "separationDistance" ] = { value: 1.0 };
    this.velocityUniforms[ "alignmentDistance" ] = { value: 1.0 };
    this.velocityUniforms[ "cohesionDistance" ] = { value: 1.0 };
    this.velocityUniforms[ "freedomFactor" ] = { value: 1.0 };
    this.velocityUniforms[ "predator" ] = { value: new THREE.Vector3() };
    this.velocityVariable.material.defines.BOUNDS = this.BOUNDS.toFixed( 2 );
    this.velocityVariable.wrapS = THREE.RepeatWrapping;
    this.velocityVariable.wrapT = THREE.RepeatWrapping;
    this.positionVariable.wrapS = THREE.RepeatWrapping;
    this.positionVariable.wrapT = THREE.RepeatWrapping;
    const error = this.gpuCompute.init();

    if ( error !== null ) {
      console.error( error );
    }
  }

  private fillPositionTexture(texture: THREE.Texture) {
    const theArray = texture.image.data;
    for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
      const x = Math.random() * this.BOUNDS - this.BOUNDS_HALF;
      const y = Math.random() * this.BOUNDS - this.BOUNDS_HALF;
      const z = Math.random() * this.BOUNDS - this.BOUNDS_HALF;
      theArray[ k ] = x;
      theArray[ k + 1 ] = y;
      theArray[ k + 2 ] = z;
      theArray[ k + 3 ] = 1;
    }
  }


  private fillVelocityTexture( texture: THREE.Texture ) {
    const theArray = texture.image.data;
    for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;
      theArray[ k ] = x * 10;
      theArray[ k + 1 ] = y * 10;
      theArray[ k + 2 ] = z * 10;
      theArray[ k + 3 ] = 1;
    }
  }

  constructor(props: object) {
    super(props);

    this.camera.position.z = 350;
    this.camera.lookAt(0, 0, 0);

    this.scene.background = new THREE.Color(0xFFFFFF);
    this.scene.fog = new THREE.Fog(0xFFFFFF, 100, 1000);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  componentDidMount() {
    const container: HTMLElement =
      document.getElementById("gl-container") as HTMLElement;
    container.appendChild(this.renderer.domElement);
    this.run();
  }

  private init() {

    this.initComputeRenderer();
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
    window.addEventListener( 'resize', this.onWindowResize, false );
    const effectController = {
      separation: 20.0,
      alignment: 20.0,
      cohesion: 20.0,
      freedom: 0.75
    };
    this.velocityUniforms[ "separationDistance" ].value = effectController.separation;
    this.velocityUniforms[ "alignmentDistance" ].value = effectController.alignment;
    this.velocityUniforms[ "cohesionDistance" ].value = effectController.cohesion;
    this.velocityUniforms[ "freedomFactor" ].value = effectController.freedom;
    this.initBirds();
  }

  private GLRender() {
    const now = performance.now();
    let delta = ( now - this.last ) / 1000;
    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    this.last = now;
    this.positionUniforms.time.value = now;
    this.positionUniforms.delta.value = delta;
    this.velocityUniforms.time.value = now;
    this.velocityUniforms.delta.value = delta;
    this.birdUniforms.time.value = now;
    this.birdUniforms.delta.value = delta;
    this.velocityUniforms.predator.value.set(0.5 * this.mouseX / this.windowHalfX, - 0.5 * this.mouseY / this.windowHalfY, 0 );
    this.mouseX = 10000;
    this.mouseY = 10000;
    this.gpuCompute.compute();
    this.birdUniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
    this.birdUniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  private onDocumentMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;
  };

  private onDocumentTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.mouseX = event.touches[0].pageX - this.windowHalfX;
      this.mouseY = event.touches[0].pageY - this.windowHalfY;
    }
  };

  private onDocumentTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.mouseX = event.touches[0].pageX - this.windowHalfX;
      this.mouseY = event.touches[0].pageY - this.windowHalfY;
    }
  };

  public run() {
    this.init();
    this.animate();
  }

  private animate = () => {
    this.GLRender();
    requestAnimationFrame(this.animate)
  };


  render() {
    return (
      <Fragment>
        <div id={"gl-container"} style={{ position: "fixed", overflow: "hidden" }}/>
      </Fragment>
    )
  }
}

export default Background
