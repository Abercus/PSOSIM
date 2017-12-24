import React, { Component } from 'react';
import * as THREE from 'three';
import ResizeSensor from 'css-element-queries/src/ResizeSensor.js';

import './style.css'


export default class Canvas extends Component {
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;

        this.renderer.render(this.scene, this.camera);
    }

    trackResize() {
        this.resizeSensor = new ResizeSensor(this.root, () => {
            console.log(this.root.offsetWidth, this.root.offsetHeight)
            this.camera.aspect = this.root.offsetWidth/this.root.offsetHeight;
            this.camera.updateProjectionMatrix();
        
            this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.root.offsetWidth/this.root.offsetHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        this.root.appendChild(this.renderer.domElement);

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        this.camera.position.z = 5;

        this.animate();
    }

    componentDidMount() {
        this.trackResize();
        this.setupScene();
    }

    render() {
        return <div className="Canvas" ref={root => { this.root = root; }}></div>
    }

}