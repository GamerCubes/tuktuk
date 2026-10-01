import type { CSSProperties, ReactNode } from 'react';
import { C } from '../data';

type Props = {
  initial: string;
  color: string;
  size?: number;
  ring?: string;
  ringWidth?: number;
  dot?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

export default function Avatar({ initial, color, size = 52, ring, ringWidth = 3, dot, style }: Props) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: color,
        border: ring ? `${ringWidth}px solid ${ring}` : undefined,
        fontSize: Math.round(size * 0.4),
        ...style,
      }}
    >
      {initial}
      {dot && dot !== 'transparent' && (
        <span className="avatar-dot" style={{ background: dot, borderColor: C.cream }} />
      )}
    </div>
  );
}
