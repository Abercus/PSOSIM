import React, { Component } from 'react';
import { number, func, string, shape } from 'prop-types';
import * as THREE from 'three';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import OrbitControlsFactory from 'three-orbit-controls';

import Population from '../pso/population';
import { throttle } from '../util';
import { generateRandom, testOptimizationFunction } from '../pso/math';

import './style.css'

const OrbitControls = OrbitControlsFactory(THREE);

export default class Canvas extends Component {

    static propTypes = {
      particlesNumber: number.isRequired,
      topology: string.isRequired,
      omega: number.isRequired,
      phiP: number.isRequired,
      phiG: number.isRequired,
      speed: number.isRequired,
      optimizationFunction: func.isRequired,
      optimizationParams: shape({
         xMin: number.isRequired,
         xMax: number.isRequired,
         yMin: number.isRequired,
         yMax: number.isRequired,
         speed: number.isRequired,
         cameraHeight: number.isRequired,
         particleSize: number.isRequired,
      }).isRequired,

      landscapeFlatness: number.isRequired,
      playbackSpeed: number.isRequired,
      landscapeOpacity: number.isRequired,

      onImprovement: func.isRequired,
    }

    constructor() {
      super();
      this.segments = 200;
      this.prevBest = null;
    }

    updateParticles = throttle(() => {
      this.pop.updateFn(this.props.omega, this.props.phiP, this.props.phiG, this.props.speed);

      this.particleSystem.geometry.verticesNeedUpdate = true;
      if (!this.CLICKABLE_DEMO) {
        this.sphere.position.x = this.pop.gBest.x;
        this.sphere.position.y = this.pop.gBest.y;
        this.sphere.position.z = this.pop.gBest.z * this.zScale();

        for (var i = 0; i < this.particles.vertices.length; i++) {
          this.particles.vertices[i].z *= this.zScale();
        }
      }

      this.checkImproved();
    })

    checkImproved = throttle(() => {
      if (this.prevBest === null || this.pop.gBestNumerical < this.prevBest) {
        this.props.onImprovement({
          epoch: this.pop.epoch,
          value: this.pop.gBestNumerical,
        });
      }
      this.prevBest = this.pop.gBestNumerical;
    }, 1000)

    startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }

    animate() {
      var rem = this.animate.bind(this);

      var now = Date.now();
      var elapsed = now - this.then;
      // Can do this better. SetTimeout shouldn't be a good idea
      if (elapsed > this.fpsInterval) {
          this.then = now - (elapsed % this.fpsInterval);
          this.updateParticles();

          this.renderer.render(this.scene, this.camera);
      }
      requestAnimationFrame(rem);
    }

    zScale(landscapeFlatness = this.props.landscapeFlatness) {
      return ((100 - landscapeFlatness) / 100);
    }

    // FROM HERE ADDITIONS.. RELOCATE.

    createCircleTexture(color, size) {
      var matCanvas = document.createElement('canvas');
      matCanvas.width = matCanvas.height = size;
      var matContext = matCanvas.getContext('2d');
      // create texture object from canvas.
      var texture = new THREE.Texture(matCanvas);
      // Draw a circle
      var center = size / 2;
      matContext.beginPath();
      matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
      matContext.closePath();
      matContext.fillStyle = color;
      matContext.fill();
      // need to set needsUpdate
      texture.needsUpdate = true;
      // return a texture made from the canvas
      return texture;
    }


    // FINISH ADDITIONS!!!! END
    trackResize() {
        this.resizeSensor = new ResizeSensor(this.root, () => {
            this.camera.aspect = this.root.offsetWidth/this.root.offsetHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        });
    }

    get xRange() {
      return this.props.optimizationParams.xMax - this.props.optimizationParams.xMin;
    }

    get yRange() {
      return this.props.optimizationParams.yMax - this.props.optimizationParams.yMin;
    }

    resetSimulation() {
        const { xMin, xMax, yMin, yMax, speed, cameraHeight, particleSize } = this.props.optimizationParams;


        if (this.interval) {
          window.clearInterval(this.interval);
          this.interval = undefined;
        }

        if (this.props.optimizationParams.demoMode) {
          this.CLICKABLE_DEMO = true;
          console.log("Demo mode turned on");
        } else {
          this.CLICKABLE_DEMO = false;
          console.log("Demo mode turned off");
        }


        if (!this.previousOptFunct || this.previousOptFunct !== this.props.optimizationFunction.toString()) {

            this.controls.position = this.controls.position0;
            this.createGraph();

            this.scene.remove(this.sphere);
            this.sphere.material.dispose();
            this.sphere.geometry.dispose();

            var geometry = new THREE.SphereGeometry(particleSize * 0.7, 32, 32);
            var material = new THREE.MeshBasicMaterial({
              color: 0xffff00,
              transparent:true,
              opacity:0.5
            });
            this.sphere = new THREE.Mesh( geometry, material );
            this.scene.add(this.sphere);
            this.camera.position.set(0, 0, cameraHeight);
            this.camera.lookAt(new THREE.Vector3(0,0,0));

        }
        this.previousOptFunct = this.props.optimizationFunction.toString();
        this.prevBest = null;

        this.scene.remove(this.particleSystem);
        if (this.particles) {
          for (var i=0; i<this.particles.length; i++) {
            this.particles[i] = undefined;
          }
        }
        this.particles = new THREE.Geometry();

        this.pMaterial = new THREE.PointsMaterial({
          size: particleSize,
          map: this.CLICKABLE_DEMO ? this.createCircleTexture('#ffffff', 256) :
            this.createCircleTexture('#e60000', 256),
          transparent: true,
          depthWrite: false
        })
        var pZ = null;

        for (var p = 0; p < this.props.particlesNumber; p++) {
          var pX = generateRandom(xMin, xMax),
            pY = generateRandom(yMin, yMax);
            if (this.CLICKABLE_DEMO) {
              pZ = 0;
            } else {
              pZ = this.props.optimizationFunction(pX, pY) * this.zScale();
            }

            var particle = new THREE.Vector3(pX, pY, pZ);
            //particle.velocity = new THREE.Vector3((Math.random()*1024-512 - pX)/2, (Math.random()*1024-512 - pY)/2, 0);

            particle.velocity = new THREE.Vector3(
              generateRandom(-speed, speed),
              generateRandom(-speed, speed),
              0);

            if (this.CLICKABLE_DEMO) {
              particle.bestNumerical = testOptimizationFunction(particle,
                this.sphere.position);
            } else {
              particle.bestNumerical = this.props.optimizationFunction(pX, pY);
            }
            particle.pBest = new THREE.Vector3(pX, pY, pZ);

            // add it to the geometry
            this.particles.vertices.push(particle);
        }
        if (this.particleSystem) {
          this.particleSystem.material.dispose();
        }
        this.particleSystem = new THREE.Points(
            this.particles,
            this.pMaterial);
        this.particleSystem.sortParticles = true;

        const bounds = [xMin, xMax, yMin, yMax];
        if (this.CLICKABLE_DEMO) {
          this.pop = new Population(this.particles.vertices, false, this.props.topology, speed, ...bounds);
          this.pop.set_optimization_goal(this.sphere.position);
        } else {
          this.pop = new Population(this.particles.vertices, true, this.props.topology, speed, ...bounds);
          this.pop.set_optimization_function(this.props.optimizationFunction);
        }
        this.particleSystem.geometry.verticesNeedUpdate = true;
        this.scene.add(this.particleSystem);

                // Those either.
        if (this.CLICKABLE_DEMO) {
          this.initDemoMode();
        }
    }


    initDemoMode() {

      // Add mousedown event
    // Set random interval to pick new locations.. Move this stuff.
      this.interval = setInterval(() => {
          var x = Math.random() * 2000 - 1000;
          var y = Math.random() * 2000 - 1000;
          var z = 0
          this.pop.set_optimization_goal({x:x,
              y:y, z:z});
          this.sphere.position.x = x;
          this.sphere.position.y = y;
          this.sphere.position.z = z;
        },
        15000);
    }


    setupVisualization() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // Save orbit controls position

        const light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        this.scene.add(light);

        this.scene.add( new THREE.AxisHelper() );
        // wireframe for xy-plane

        var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, wireframe: true, side:THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(2000,2000);
        this.floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
        this.floor.position.z = -0.01;
        // rotate to lie in x-y plane
        // floor.rotation.x = Math.PI / 2;
        this.scene.add(this.floor);
        // bgcolor
        this.renderer.setClearColor( 0xbebebe, 1 );
    }

    setupLandscapeColors(graphGeometry) {
      ///////////////////////////////////////////////
      // calculate vertex colors based on Z values //
      ///////////////////////////////////////////////
      graphGeometry.computeBoundingBox();
      const zMin = graphGeometry.boundingBox.min.z;
      const zMax = graphGeometry.boundingBox.max.z;
      const zRange = zMax - zMin;
      var color, point, face, numberOfSides, vertexIndex;
      // faces are indexed using characters
      var faceIndices = [ 'a', 'b', 'c', 'd' ];
      // first, assign colors to vertices as desired
      for ( var i = 0; i < graphGeometry.vertices.length; i++ ) {
        point = graphGeometry.vertices[ i ];
        color = new THREE.Color( 0x0000ff );
        color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
        graphGeometry.colors[i] = color; // use this array for convenience
      }
      // copy the colors as necessary to the face's vertexColors array.
      for ( i = 0; i < graphGeometry.faces.length; i++ ) {
        face = graphGeometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ )
        {
          vertexIndex = face[ faceIndices[ j ] ];
          face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
        }
      }
    }

    createGraph() {
      const zFunc = this.props.optimizationFunction;

      const meshFunction = (x, y) => {
        x = this.xRange * x + this.props.optimizationParams.xMin;
        y = this.yRange * y + this.props.optimizationParams.yMin;
        var z = zFunc(x,y);
        if (isNaN(z))
          return new THREE.Vector3(0,0,0); // TODO: better fix
        else
          return new THREE.Vector3(x, y, z);
      };

      // true => sensible image tile repeat...
      const graphGeometry = new THREE.ParametricGeometry(meshFunction, this.segments, this.segments, true );
      this.setupLandscapeColors(graphGeometry);


      // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
      const wireTexture =  new THREE.TextureLoader().load( 'images/square.png' );
      wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
      wireTexture.repeat.set( 40, 40 );

      //const normMaterial = new THREE.MeshNormalMaterial();
      //const shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      const wireMaterial = new THREE.MeshBasicMaterial({
        map: wireTexture,
        vertexColors: THREE.VertexColors,
        side:THREE.DoubleSide,
        transparent:true,
        opacity: 0.5,
      });
      //const vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

      if (this.graphMesh) {
        this.scene.remove(this.graphMesh);
        this.graphMesh.material.dispose();
        this.graphMesh.geometry.dispose();
        this.graphMesh = undefined;
        // renderer.deallocateObject( graphMesh );
      }

      wireMaterial.map.repeat.set( this.segments, this.segments );

      this.graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
      this.graphMesh.doubleSided = true;
      // Rescl
      console.log(this.graphMesh.geometry.vertices);
      for (let vertice of this.graphMesh.geometry.vertices) {
        vertice.z = zFunc(vertice.x, vertice.y) * this.zScale();
      }

      this.scene.add(this.graphMesh);
    }


    addMousedownEvent() {
      this.renderer.domElement.addEventListener("mousedown", (event) => {
          event.preventDefault();
          if (this.CLICKABLE_DEMO) {
            var viewport_size = this.renderer.getSize ();
            var mouse = new THREE.Vector3();
            mouse.x = ( event.offsetX / viewport_size.width) * 2 - 1;
            mouse.y = - ( event.offsetY / viewport_size.height ) * 2 + 1;
            mouse.z = 0;
            mouse.unproject( this.camera );
            var dir = mouse.sub( this.camera.position ).normalize();
            var distance = - this.camera.position.z / dir.z;
            var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
            this.sphere.position.x = pos.x;
            this.sphere.position.y = pos.y;
            this.pop.set_optimization_goal({
                x: this.sphere.position.x,
                y: this.sphere.position.y,
                z: 0 });
          }
        }, false);
      }

    setupScene() {
        // Set true for clickable demo
        this.CLICKABLE_DEMO = false;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          75, this.root.offsetWidth/this.root.offsetHeight, 0.1, 100000 );

        this.camera.up.set(0,0,1);
        this.renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias:true});
        this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        this.root.appendChild(this.renderer.domElement);

        // We won't need those otherwise.

        this.ballGeom = new THREE.SphereGeometry( 5, 32, 32 );
        this.ballMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent:true, opacity:0.7} );
        this.sphere = new THREE.Mesh( this.ballGeom, this.ballMaterial );
        this.scene.add(this.sphere);

        this.addMousedownEvent();


        /*
        if (this.CLICKABLE_DEMO) {
          this.camera.position.set(0, 0, 500);
        } else {
          // Set camera depending on task
          this.camera.position.set(0, 0, 700);
        }
        */

        this.setupVisualization();
        this.resetSimulation();


        this.startAnimating(40);
    }

    componentDidMount() {
        this.trackResize();
        this.setupScene();
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.playbackSpeed !== this.props.playbackSpeed) {
        this.updateParticles.setWait(1000 / nextProps.playbackSpeed);
      }
      if (nextProps.landscapeFlatness !== this.props.landscapeFlatness) {
        const zFunc = this.props.optimizationFunction;
        for (let vertice of this.graphMesh.geometry.vertices) {
          vertice.z = zFunc(vertice.x, vertice.y) * this.zScale(nextProps.landscapeFlatness);
        }
        this.graphMesh.geometry.verticesNeedUpdate = true;
      }
      if (nextProps.landscapeOpacity !== this.props.landscapeOpacity) {
        this.graphMesh.material.opacity = nextProps.landscapeOpacity / 100;
        this.graphMesh.material.needsUpdate = true;
      }
    }

    render() {
        return <div className="Canvas" ref={root => { this.root = root; }}></div>
    }
}
