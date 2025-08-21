'use client'

import Konva from "konva";
import { Group, Line, Rect } from "react-konva";

interface InductorComponentProps {
  group: Konva.Group;
  isSelected: boolean;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onInductorClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function InductorComponent({
  group,
  isSelected,
  onDragStart,
  onDragMove,
  onInductorClick,
}: InductorComponentProps) {
  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <Group
      x={group.x()}
      y={group.y()}
      offsetX={group.width() / 2}
      offsetY={group.height() / 2}
      width={group.width()}
      height={group.height()}
      rotation={group.rotation()}
      draggable={true}
      onDragStart={(event) => onDragStart(group.id(), event)}
      onDragMove={(event) => onDragMove(group.id(), event)}
      onClick={(event) => onInductorClick(group.id(), event)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={group.id()}
    >
      {/* 透明な背景領域（ドラッグエリア用） - 20%拡大 */}
      <Rect
        x={0}
        y={0}
        width={86.4}
        height={72}
        fill="transparent"
      />
      
      {/* 左リード線 - 20%拡大 */}
      <Line
        points={[0, 36, 14.4, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
      
      {/* コイル（4つの幅広い半円を連続で繋げる） - 20%拡大 */}
      {/* 1つ目の半円（上向き） */}
      <Line
        points={[14.4, 36, 21.6, 24, 28.8, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
        tension={0.5}
        fill="transparent"
      />
      {/* 2つ目の半円（上向き） */}
      <Line
        points={[28.8, 36, 36, 24, 43.2, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
        tension={0.5}
        fill="transparent"
      />
      {/* 3つ目の半円（上向き） */}
      <Line
        points={[43.2, 36, 50.4, 24, 57.6, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
        tension={0.5}
        fill="transparent"
      />
      {/* 4つ目の半円（上向き） */}
      <Line
        points={[57.6, 36, 64.8, 24, 72, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
        tension={0.5}
        fill="transparent"
      />
      
      {/* 右リード線 - 20%拡大 */}
      <Line
        points={[72, 36, 86.4, 36]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
    </Group>
  );
} 