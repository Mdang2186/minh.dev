"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Decal } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

export function Lanyard({ position = [0, 0, 7.5], gravity = [0, -40, 0], fov = 20, transparent = true, profile }: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  profile?: any;
}) {
  return (
    <div className="relative z-10 w-full h-full flex justify-center items-center transform scale-100 origin-center min-h-[600px]">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{
          alpha: transparent,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
          antialias: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          // Handle WebGL context loss gracefully
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          }, false);
          canvas.addEventListener('webglcontextrestored', () => {
            gl.setSize(canvas.width, canvas.height);
          }, false);
        }}
      >
        <ambientLight intensity={1.5} />
        <Physics gravity={gravity as any} timeStep={1 / 60}>
          <Band profile={profile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={0.5} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={0.8} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={0.8} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, profile }: { maxSpeed?: number; minSpeed?: number; profile?: any }) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };

  const { nodes, materials } = useGLTF('/models/card.glb') as any;

  // Use texture loader which handles CORS safely
  const texture = useTexture(profile?.avatarUrl || "/avatar1.png") as THREE.Texture;
  texture.colorSpace = THREE.SRGBColorSpace;
  
  // Calculate card dimensions to perfectly match image aspect ratio without rounded corners
  const { cardW, cardH } = (() => {
    const fixedH = 1.1; // Total physical height
    const img = texture.image as any;
    if (!img || !img.width || !img.height) return { cardW: 0.72, cardH: fixedH };
    
    const imgAspect = img.width / img.height;
    
    // Width is perfectly proportional to height based on image aspect ratio
    return {
      cardW: fixedH * imgAspect,
      cardH: fixedH
    };
  })();

  const roundedRectGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const width = cardW;
    const height = cardH;
    const radius = 0.03;
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    
    const geo = new THREE.ShapeGeometry(shape);
    const uvAttribute = geo.attributes.uv;
    for (let i = 0; i < uvAttribute.count; i++) {
      const u = (uvAttribute.getX(i) - x) / width;
      const v = (uvAttribute.getY(i) - y) / height;
      uvAttribute.setXY(i, u, v);
    }
    return geo;
  }, [cardW, cardH]);

  const smokeTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Linear gradient for longitudinal stripes (varying along Y axis, which maps to V width on MeshLine)
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    
    // Kẻ sọc xanh xám đen trắng, phối như màu khói (blue, grey, black, white, smoky blend)
    gradient.addColorStop(0, '#000000'); // black edge
    gradient.addColorStop(0.15, '#334155'); // dark grey
    gradient.addColorStop(0.3, '#94a3b8'); // light grey
    gradient.addColorStop(0.45, '#ffffff'); // white stripe
    gradient.addColorStop(0.6, '#93c5fd'); // light blue
    gradient.addColorStop(0.75, '#2563eb'); // blue
    gradient.addColorStop(0.9, '#1e293b'); // dark grey
    gradient.addColorStop(1, '#000000'); // black edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add a smoky noise/blur layer
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.arc(
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 50 + 20,
        0,
        Math.PI * 2
      );
      ctx.filter = 'blur(12px)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, []);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  // Very short rope joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.25]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.25]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.25]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    setIsSmall(typeof window !== 'undefined' && window.innerWidth < 1024);
    const handleResize = () => setIsSmall(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current?.geometry?.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  (curve as any).curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as any).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as any).setPointerCapture(e.pointerId);
              if (card.current) {
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              }
            }}
          >
            <mesh position={[0, 0.55, 0]} geometry={roundedRectGeo}>
              <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
            </mesh>
            
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={smokeTexture || texture}
          repeat={[-4, 1]}
          lineWidth={1.2}
        />
      </mesh>
    </>
  );
}
