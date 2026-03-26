'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// ─── GLB Model Loader ──────────────────────────────

function GLBModel({ modelUrl, color, secondaryColor }) {
  const { scene } = useGLTF(modelUrl);
  const ref = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Apply color tinting if provided
        if (color && child.material) {
          const mat = child.material.clone();
          mat.color = new THREE.Color(color);
          child.material = mat;
        }
      }
    });
  }, [scene, color]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={2} />
    </Center>
  );
}

// ─── Procedural Sneaker (Fallback) ─────────────────

function ProceduralSneaker({ color = '#1a1a1a', secondaryColor = '#ffffff', isMobile = false }) {
  const group = useRef();
  const segments = isMobile ? 8 : 16; // Reduce polygon count on mobile
  const detailSegments = isMobile ? 6 : 12;

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const mainMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor, roughness: 0.3, metalness: 0.15 });
  const soleMaterial = new THREE.MeshStandardMaterial({ color: '#e8e4df', roughness: 0.7, metalness: 0 });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.2}>
      {/* Sole */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[2.2, 0.25, 0.9, segments, 2, segments]} />
        <primitive object={soleMaterial} attach="material" />
      </mesh>
      {/* Midsole */}
      <mesh position={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[2.1, 0.12, 0.85, segments, 2, segments]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      {/* Upper body */}
      <mesh position={[0.1, 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.75, segments, segments, segments]} />
        <primitive object={mainMaterial} attach="material" />
      </mesh>
      {/* Toe box */}
      <mesh position={[-0.85, -0.05, 0]} castShadow>
        <sphereGeometry args={[0.38, detailSegments, detailSegments, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={mainMaterial} attach="material" />
      </mesh>
      {/* Heel */}
      <mesh position={[0.85, 0.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.55, 0.7, detailSegments / 2, detailSegments / 2, detailSegments / 2]} />
        <primitive object={mainMaterial} attach="material" />
      </mesh>
      {/* Tongue */}
      <mesh position={[0.1, 0.4, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.8, 0.25, 0.45, segments / 2, 2, segments / 2]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      {/* Swoosh / accent strip */}
      <mesh position={[-0.2, 0.05, 0.39]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.02, segments, 1, 1]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.2, 0.05, -0.39]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.02, segments, 1, 1]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      {/* Lace area dots */}
      {!isMobile && [0, 0.2, 0.4].map((x, i) => (
        <mesh key={i} position={[-0.1 + x, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.03, 6, 6]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Lighting Setup ────────────────────────────────

function Lights({ isMobile, color }) {
  return (
    <>
      <ambientLight intensity={isMobile ? 0.6 : 0.4} />
      <spotLight position={[5, 8, 5]} angle={0.3} penumbra={1} intensity={isMobile ? 0.8 : 1.2} castShadow={!isMobile} />
      {!isMobile && (
        <>
          <pointLight position={[-3, 2, -3]} intensity={0.4} color={color || '#4f46e5'} />
          <pointLight position={[3, 1, 3]} intensity={0.3} color="#00d4ff" />
        </>
      )}
    </>
  );
}

// ─── Scene Content ─────────────────────────────────

function SceneContent({ modelUrl, color, secondaryColor, isMobile }) {
  const [modelError, setModelError] = useState(false);
  const [useGlb, setUseGlb] = useState(!!modelUrl);

  useEffect(() => {
    if (!modelUrl) {
      setUseGlb(false);
      return;
    }
    // Test if the model file exists
    fetch(modelUrl, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) {
          setUseGlb(false);
          setModelError(true);
        }
      })
      .catch(() => {
        setUseGlb(false);
        setModelError(true);
      });
  }, [modelUrl]);

  return (
    <>
      <Lights isMobile={isMobile} color={color} />
      {useGlb && !modelError ? (
        <GLBModel modelUrl={modelUrl} color={color} secondaryColor={secondaryColor} />
      ) : (
        <ProceduralSneaker color={color} secondaryColor={secondaryColor} isMobile={isMobile} />
      )}
      <ContactShadows position={[0, -0.5, 0]} opacity={isMobile ? 0.3 : 0.5} scale={4} blur={2} far={3} />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
      {!isMobile && <Environment preset="city" />}
    </>
  );
}

// ─── Main Exported Component ───────────────────────

export default function SneakerViewer3D({ color = '#1a1a1a', secondaryColor = '#ffffff', modelUrl = null }) {
  const isMobile = useIsMobile();

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800 border border-dark-600">
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 1.5, 4], fov: 35 }}
        gl={{
          antialias: !isMobile,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            modelUrl={modelUrl}
            color={color}
            secondaryColor={secondaryColor}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>

      {/* Viewer hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-dark-900/70 backdrop-blur px-3 py-1.5 rounded-lg">
        <p className="text-[10px] text-dark-200">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}
