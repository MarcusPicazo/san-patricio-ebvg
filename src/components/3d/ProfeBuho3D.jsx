import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ProfeBuho3D({ action = 'idle', showCauldron = false }) {
  const mountRef = useRef(null);
  const owlGroupRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const headRef = useRef(null);
  
  // ¡LA SOLUCIÓN! Guardamos la acción en una referencia que no dispara re-renderizados del Canvas
  const actionRef = useRef(action);

  // Actualizamos la referencia silenciosamente cuando cambias la prop
  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setClearColor(0x000000, 0); 
    renderer.domElement.style.backgroundColor = 'transparent';

    renderer.setSize(400, 400);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.objectFit = 'contain';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; 
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdf80, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0x4ade80, 2, 20);
    backLight.position.set(-3, 2, -4);
    scene.add(backLight);

    const matBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.7 });
    const matLightBlue = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.8 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const matBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });

    const owlGroup = new THREE.Group();
    owlGroupRef.current = owlGroup;

    const bodyGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const body = new THREE.Mesh(bodyGeom, matBlue);
    body.scale.set(1, 1.2, 0.9);
    body.castShadow = true;
    owlGroup.add(body);

    const bellyGeom = new THREE.SphereGeometry(1.1, 32, 32);
    const belly = new THREE.Mesh(bellyGeom, matLightBlue);
    belly.position.set(0, -0.3, 0.5);
    belly.scale.set(1, 1.1, 0.8);
    owlGroup.add(belly);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.5, 0);
    headRef.current = headGroup;
    owlGroup.add(headGroup);

    const eyeGeom = new THREE.SphereGeometry(0.35, 32, 32);
    const pupilGeom = new THREE.SphereGeometry(0.15, 32, 32);

    const rightEye = new THREE.Mesh(eyeGeom, matWhite);
    rightEye.position.set(0.4, 0.4, 1.1);
    const rightPupil = new THREE.Mesh(pupilGeom, matBlack);
    rightPupil.position.set(0, 0, 0.25);
    rightEye.add(rightPupil);
    headGroup.add(rightEye);

    const leftEye = new THREE.Mesh(eyeGeom, matWhite);
    leftEye.position.set(-0.4, 0.4, 1.1);
    const leftPupil = new THREE.Mesh(pupilGeom, matBlack);
    leftPupil.position.set(0, 0, 0.25);
    leftEye.add(leftPupil);
    headGroup.add(leftEye);

    const beakGeom = new THREE.ConeGeometry(0.2, 0.5, 4);
    const beak = new THREE.Mesh(beakGeom, matOrange);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.1, 1.3);
    headGroup.add(beak);

    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 1.15, 0.1);
    hatGroup.rotation.x = -0.1;
    hatGroup.rotation.z = 0.1;

    const brimGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
    const brim = new THREE.Mesh(brimGeom, matGreen);
    hatGroup.add(brim);

    const topGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const top = new THREE.Mesh(topGeom, matGreen);
    top.position.y = 0.8;
    hatGroup.add(top);

    const bandGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 32);
    const band = new THREE.Mesh(bandGeom, matBlack);
    band.position.y = 0.2;
    hatGroup.add(band);

    const buckleGeom = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const buckle = new THREE.Mesh(buckleGeom, matGold);
    buckle.position.set(0, 0.2, 0.85);
    hatGroup.add(buckle);
    headGroup.add(hatGroup);

    const wingGeom = new THREE.SphereGeometry(0.6, 32, 32);

    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-1.3, 0, 0);
    const lWing = new THREE.Mesh(wingGeom, matBlue);
    lWing.scale.set(0.3, 1.4, 0.8);
    lWing.position.set(-0.2, -0.6, 0);
    leftWingPivot.add(lWing);
    owlGroup.add(leftWingPivot);
    leftWingRef.current = leftWingPivot;

    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(1.3, 0, 0);
    const rWing = new THREE.Mesh(wingGeom, matBlue);
    rWing.scale.set(0.3, 1.4, 0.8);
    rWing.position.set(0.2, -0.6, 0);
    rightWingPivot.add(rWing);
    owlGroup.add(rightWingPivot);
    rightWingRef.current = rightWingPivot;

    const anchorGroup = new THREE.Group();
    anchorGroup.add(owlGroup);
    scene.add(anchorGroup);

    let liquidRef = null;
    if (showCauldron) {
      anchorGroup.position.set(0, 1.5, -1.5); 
      const cauldronGroup = new THREE.Group();
      cauldronGroup.position.set(0, -0.4, 1.5); 

      const bowlGeom = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const matIron = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.6 });
      const bowl = new THREE.Mesh(bowlGeom, matIron);

      const rimGeom = new THREE.TorusGeometry(1.8, 0.15, 32, 32);
      const rim = new THREE.Mesh(rimGeom, matIron);
      rim.rotation.x = Math.PI / 2;

      const liquidGeom = new THREE.CylinderGeometry(1.7, 1.7, 0.05, 32);
      const matLiquid = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 0.6
      });
      const liquid = new THREE.Mesh(liquidGeom, matLiquid);
      liquid.position.y = -0.1;
      liquidRef = liquid;

      const cauldronLight = new THREE.PointLight(0x34d399, 3, 10);
      cauldronLight.position.set(0, 1, 0);
      
      cauldronGroup.add(cauldronLight);
      cauldronGroup.add(bowl);
      cauldronGroup.add(rim);
      cauldronGroup.add(liquid);
      scene.add(cauldronGroup);

      camera.position.z = 11;
      camera.position.y = 1;
      camera.lookAt(0, 0.5, 0); 
    } else {
      camera.position.z = 8.5;
      camera.position.y = 1.2;
      camera.lookAt(0, 1.2, 0);
    }

    let frameId;
    const startTime = Date.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (Date.now() - startTime) * 0.001;
      const currentAction = actionRef.current; // Leer el estado actual sin reconstruir

      if (owlGroupRef.current) {
        owlGroupRef.current.position.y = Math.sin(t * 2) * 0.1;

        if (currentAction === 'idle') {
          leftWingRef.current.rotation.z = Math.sin(t * 1.5) * 0.1;
          rightWingRef.current.rotation.z = Math.sin(t * 1.5) * 0.1;
          headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
          headRef.current.rotation.z = 0;
          owlGroupRef.current.rotation.y = 0;
        } else if (currentAction === 'cheer') {
          owlGroupRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.5;
          leftWingRef.current.rotation.z = Math.abs(Math.sin(t * 15)) * 0.8;
          rightWingRef.current.rotation.z = -Math.abs(Math.sin(t * 15)) * 0.8;
          headRef.current.rotation.y = 0;
          owlGroupRef.current.rotation.y = Math.sin(t * 5) * 0.3;
        } else if (currentAction === 'wrong') {
          headRef.current.rotation.z = Math.sin(t * 15) * 0.1;
          leftWingRef.current.rotation.z = -0.2;
          rightWingRef.current.rotation.z = 0.2;
        }
      }

      if (showCauldron && liquidRef) {
        liquidRef.position.y = -0.1 + Math.sin(t * 3) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.forceContextLoss();
      renderer.dispose();
    };
    // El array vacío asegura que ESTO SOLO CORRA 1 VEZ, eliminando el parpadeo blanco.
  }, [showCauldron]);

  return (
    <div className="relative flex justify-center items-center w-full h-full bg-transparent">
      <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
      <div ref={mountRef} className="w-full h-full drop-shadow-2xl relative z-10 pointer-events-none bg-transparent" />
    </div>
  );
}