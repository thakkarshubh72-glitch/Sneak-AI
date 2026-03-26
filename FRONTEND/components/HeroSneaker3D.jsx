'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Environment as EnvironmentImpl, ContactShadows, PresentationControls, Float, Center } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

// Custom model loader with procedural fallback (similar to SneakerViewer3D)
function SneakerModel({ url, color }) {
  // If no realistic model url yet, render the procedural fallback block for now
  // Real models will be added in Phase 3
  if (!url) {
    return (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.4, 0.5]} />
        <meshStandardMaterial color={color || '#5c7cfa'} />
      </mesh>
    );
  }

  // Load actual GLTF
  // const gltf = useLoader(GLTFLoader, url);
  // return <primitive object={gltf.scene} scale={1.5} />;
  return null; // Implemented later
}

function ProceduralHeroSneaker({ color, secondaryColor }) {
  const group = useRef();
  
  // A more detailed procedural sneaker for the hero before real models arrive
  return (
    <group ref={group}>
      {/* Sole */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.3, 1.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      
      {/* Main upper */}
      <mesh position={[0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.7, 1]} />
        <meshStandardMaterial color={color || '#16161d'} roughness={0.4} />
      </mesh>
      
      {/* Toe box */}
      <mesh position={[-0.9, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.9]} />
        <meshStandardMaterial color={secondaryColor || '#25262B'} roughness={0.6} />
      </mesh>

      {/* Heel guard */}
      <mesh position={[1.4, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.8, 1.05]} />
        <meshStandardMaterial color={color || '#16161d'} roughness={0.2} />
      </mesh>

      {/* Swoosh / Logo placeholder */}
      <mesh position={[0.2, 0.1, 0.51]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1.2, 0.2, 0.05]} />
        <meshStandardMaterial color={secondaryColor || '#5c7cfa'} emissive={secondaryColor || '#5c7cfa'} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function HeroSneaker3D() {
  return (
    <div className="w-full h-[60vh] sm:h-[80vh] cursor-grab active:cursor-grabbing relative z-10">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow shadow-mapSize={2048} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5c7cfa" />
        <pointLight position={[10, -10, 10]} intensity={0.5} color="#a78bfa" />
        
        <Suspense fallback={null}>
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0.3, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float rotationIntensity={0.4} floatIntensity={2} speed={1.5}>
              <motion.group 
                initial={{ scale: 0, rotationY: Math.PI }} 
                animate={{ scale: 1, rotationY: 0 }} 
                transition={{ type: "spring", stiffness: 40, damping: 14, delay: 0.2 }}
              >
                <Center>
                  <ProceduralHeroSneaker color="#16161d" secondaryColor="#5c7cfa" />
                </Center>
              </motion.group>
            </Float>
          </PresentationControls>
          <ContactShadows position={[0, -1.4, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg-primary via-transparent to-transparent z-20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-primary via-transparent to-transparent z-20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg-primary via-transparent to-transparent z-20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-bg-primary via-transparent to-transparent z-20" />
    </div>
  );
}
