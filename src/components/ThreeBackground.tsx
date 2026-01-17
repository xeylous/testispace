"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useTheme } from "next-themes";
import { useEffect } from "react";

function StarBackground({ theme, ...props }: any) {
  const ref = useRef<any>(null);
  
  // Safe initialization
  const [sphere] = useState(() => {
    try {
        const data = new Float32Array(4000);
        random.inSphere(data, { radius: 1.5 });
        return data;
    } catch (e) {
        return new Float32Array(0); // Fallback
    }
  });

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 30;
        ref.current.rotation.y -= delta / 40;
    }
  });

  if (sphere.length === 0) return null;

  const color = theme === 'light' ? "#2C3327" : "#f272c8"; // Dark Forest Green (almost black) for Light Mode
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={color}
          size={theme === 'light' ? 0.0035 : 0.002}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={theme === 'light' ? 0.8 : 1}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering only after mount
  if (!mounted) return <div className="w-full h-auto fixed inset-0 -z-10 bg-[#030014]" />;

  return (
    <div className="w-full h-auto fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
            <StarBackground theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  );
}
