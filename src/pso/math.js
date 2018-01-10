import * as THREE from 'three';


export function mod(n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

export function addition(v1,v2) {
  return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
}

export function addition_w(w,v1,v2) {
  return new THREE.Vector3(w*(v1.x+v2.x), w*(v1.y+v2.y), w*(v1.z+v2.z));
}

// Neither
export function addition_2(v1,v2) {
    return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z);
}
// With inertia
export function addition_2_w(w,v1,v2) {
    return new THREE.Vector3(w*(v1.x)+v2.x, w*(v1.y)+v2.y, v1.z);
}
// With constriction factor
export function addition_3_w(w,v1,v2) {
    return new THREE.Vector3(w*(v1.x+v2.y), w*(v1.y+v2.y), v1.z);
}

export function subtract(v1,v2,c,rand1) {
  return new THREE.Vector3(c*rand1*(v1.x-v2.x), c*rand1*(v1.y-v2.y), c*rand1*(v1.z-v2.z));
}

export function subtract_2(v1,v2,c,rand1) {
    return new THREE.Vector3(c*rand1*(v1.x-v2.x), c*rand1*(v1.y-v2.y), v1.z);
}

export function euclidDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2)
    + Math.pow(p1.y - p2.y, 2)
    + Math.pow(p1.z - p2.z, 2));
}

export function testOptimizationFunction(p, opt_vector) {
  return euclidDistance(p, opt_vector);
}

export function generateRandom(min, max) {
  return  Math.random()*(min - max) + max;
}
