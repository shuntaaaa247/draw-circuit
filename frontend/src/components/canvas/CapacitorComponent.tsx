'use client'

import Konva from "konva";
import { Group, Line, Rect } from "react-konva";

interface CapacitorComponentProps {
  group: Konva.Group;
  isSelected: boolean;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onCapacitorClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function CapacitorComponent({
  group,
  isSelected,
  onDragStart,
  onDragMove,
  onCapacitorClick,
}: CapacitorComponentProps) {

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
      onClick={(event) => onCapacitorClick(group.id(), event)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={group.id()}
    >
      {/* 透明な背景領域（ドラッグエリア用） */}
      <Rect
        x={0}
        y={0}
        width={60}
        height={60}
        fill="transparent"
      />
      
      {/* 左のリード線 */}
      <Line
        points={[0, 30, 23, 30]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
      
      {/* 左の板 */}
      <Line
        points={[23, 0, 23, 60]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
      
      {/* 右の板 */}
      <Line
        points={[37, 0, 37, 60]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
      
      {/* 右のリード線 */}
      <Line
        points={[37, 30, 60, 30]}
        stroke={isSelected ? "red" : "#000"}
        strokeWidth={2}
      />
    </Group>
  );
} 