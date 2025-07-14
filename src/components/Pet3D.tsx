'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface Pet3DProps {
  color: string;
  mood: 'happy' | 'tired' | 'sad' | 'excited' | 'normal';
  stats: {
    felicidad: number;
    energia: number;
    salud: number;
  };
}

// Componente de la mascota 3D
const PetModel: React.FC<{ color: string; mood: string; stats: any }> = ({ color, mood, stats }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Animación basada en el estado de ánimo
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Animación base de respiración
    const breathingScale = 1 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.setScalar(breathingScale);

    // Rotación suave
    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;

    // Animaciones específicas por estado de ánimo
    switch (mood) {
      case 'happy':
        meshRef.current.position.y = Math.sin(time * 3) * 0.1;
        break;
      case 'excited':
        meshRef.current.position.y = Math.sin(time * 5) * 0.2;
        meshRef.current.rotation.z = Math.sin(time * 4) * 0.1;
        break;
      case 'tired':
        meshRef.current.position.y = Math.sin(time * 1) * 0.05 - 0.1;
        break;
      case 'sad':
        meshRef.current.position.y = -0.2;
        break;
      default:
        meshRef.current.position.y = Math.sin(time * 2) * 0.05;
    }

    // Animación de ojos parpadeando
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkTime = Math.sin(time * 0.5);
      if (blinkTime > 0.95) {
        eyeLeftRef.current.scale.y = 0.1;
        eyeRightRef.current.scale.y = 0.1;
      } else {
        eyeLeftRef.current.scale.y = 1;
        eyeRightRef.current.scale.y = 1;
      }
    }
  });

  // Color dinámico basado en la salud
  const dynamicColor = useMemo(() => {
    const healthRatio = stats.salud / 100;
    const baseColor = new THREE.Color(color);
    
    if (healthRatio < 0.3) {
      return baseColor.lerp(new THREE.Color('#666666'), 0.4);
    } else if (healthRatio < 0.6) {
      return baseColor.lerp(new THREE.Color('#888888'), 0.2);
    }
    
    return baseColor;
  }, [color, stats.salud]);

  // Forma de la boca basada en el estado de ánimo
  const mouthShape = useMemo(() => {
    switch (mood) {
      case 'happy':
      case 'excited':
        return { scaleX: 1.2, scaleY: 0.8, positionY: -0.3 };
      case 'sad':
        return { scaleX: 0.8, scaleY: 1.2, positionY: -0.4 };
      case 'tired':
        return { scaleX: 0.6, scaleY: 0.6, positionY: -0.35 };
      default:
        return { scaleX: 1, scaleY: 1, positionY: -0.3 };
    }
  }, [mood]);

  return (
    <group>
      {/* Cuerpo principal */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color={dynamicColor} 
          shininess={100}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Ojos */}
      <Sphere ref={eyeLeftRef} args={[0.15, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.15, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* Pupilas */}
      <Sphere args={[0.08, 16, 16]} position={[-0.3, 0.2, 0.85]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.3, 0.2, 0.85]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Boca */}
      <Torus 
        ref={mouthRef}
        args={[0.1, 0.03, 8, 16]} 
        position={[0, mouthShape.positionY, 0.8]}
        scale={[mouthShape.scaleX, mouthShape.scaleY, 1]}
        rotation={[0, 0, mood === 'sad' ? Math.PI : 0]}
      >
        <meshBasicMaterial color="#ff4444" />
      </Torus>

      {/* Efectos de partículas para estados especiales */}
      {mood === 'happy' && (
        <>
          <Sphere args={[0.05, 8, 8]} position={[-0.8, 0.5, 0.5]}>
            <meshBasicMaterial color="#ffff00" transparent opacity={0.7} />
          </Sphere>
          <Sphere args={[0.05, 8, 8]} position={[0.8, 0.5, 0.5]}>
            <meshBasicMaterial color="#ffff00" transparent opacity={0.7} />
          </Sphere>
        </>
      )}

      {mood === 'excited' && (
        <>
          <Box args={[0.1, 0.1, 0.1]} position={[-0.6, 0.8, 0.3]}>
            <meshBasicMaterial color="#ff00ff" transparent opacity={0.8} />
          </Box>
          <Box args={[0.1, 0.1, 0.1]} position={[0.6, 0.8, 0.3]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </Box>
        </>
      )}
    </group>
  );
};

// Componente principal Pet3D
const Pet3D: React.FC<Pet3DProps> = ({ color, mood, stats }) => {
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Luces */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#00ffff" />

        {/* Mascota */}
        <PetModel color={color} mood={mood} stats={stats} />

        {/* Fondo con estrellas */}
        {Array.from({ length: 50 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.02, 8, 8]}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              -10 + Math.random() * -5
            ]}
          >
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={Math.random() * 0.8 + 0.2} 
            />
          </Sphere>
        ))}
      </Canvas>
      
      {/* Indicador de estado de ánimo */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
        Estado: {mood === 'happy' ? '😊' : mood === 'excited' ? '🤩' : mood === 'tired' ? '😴' : mood === 'sad' ? '😢' : '😐'} {mood}
      </div>
    </div>
  );
};

export default Pet3D;
