import * as THREE from 'three';


export function mod(n, m) {
  // Mod function with positive remainder. n mod m
  let r = n % m;
  // If remainder is less than 0 then add divisor to it.
  return Math.floor(r >= 0 ? r : r + m);
};

// Addition without inertia coefficient
export function addition(v1, v2) {
  return new THREE.Vector3(v1.x + v2.x, v1.y + v2.y, v1.z);
}
// Addition with inertian coefficient
export function addition_w(w, v1, v2) {
  return new THREE.Vector3(w * (v1.x) + v2.x, w * (v1.y) + v2.y, v1.z);
}

export function subtract(v1, v2, c, rand) {
  // C is the global/personal coefficient, rand is between [0,1]
  return new THREE.Vector3(c * rand * (v1.x - v2.x), c * rand * (v1.y - v2.y), v1.z);
}

export function euclidDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2));
}

export function generateRandom(min, max) {
  return Math.random() * (min - max) + max;
}
