import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { STAGES } from '../data/services';
import type { Service } from '../data/services';

function CameraController({ stage, activeService, isTransitioning }: {
  stage: number;
  activeService: Service | null;
  isTransitioning: boolean;
}) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const camera = state.camera;
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (stage === STAGES.INTRO) {
      targetPos.set(0, 30, 40);
      targetLook.set(0, 0, 0);
    } else if (stage === STAGES.MENU && !isTransitioning) {
      targetPos.set(0, 30, 40);
      targetLook.set(0, 0, 0);
    } else if (activeService) {
      targetPos.set(activeService.position[0], 1.5, activeService.position[2] + 4);
      targetLook.set(activeService.position[0], 1.5, activeService.position[2]);
    } else {
      targetPos.set(0, 30, 40);
      targetLook.set(0, 0, 0);
    }

    const lerpSpeed = isTransitioning ? 0.025 : 0.02;
    camera.position.lerp(targetPos, lerpSpeed);
    currentLookAt.current.lerp(targetLook, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default function ThreeScene({ stage, activeService, isTransitioning }: {
  stage: number;
  activeService: Service | null;
  isTransitioning: boolean;
  onServiceClick: (service: Service) => void;
}) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 30, 40]} fov={45} />
      <ambientLight intensity={0.2} />
      <CameraController stage={stage} activeService={activeService} isTransitioning={isTransitioning} />
      <points>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(3000).map(() => (Math.random() - 0.5) * 40), 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#e5d3b3" transparent opacity={0.3} />
      </points>
    </Canvas>
  );
}
