import { ReactNode } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useStore } from '../store';

interface PartProps {
  id: string;
  children: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/** Interactive group tied to a ship system id */
export function Part({ id, children, ...rest }: PartProps) {
  const setHovered = useStore((s) => s.setHovered);
  const select = useStore((s) => s.select);
  return (
    <group
      {...rest}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        select(id);
      }}
    >
      {children}
    </group>
  );
}
