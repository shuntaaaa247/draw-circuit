import Konva from 'konva';
import React from 'react';
import { Group, Line, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface DCPowerSupplyComponentProps {
  group: Konva.Group;
  isSelected: boolean;
  onDragStart: (id: string, e: KonvaEventObject<DragEvent>) => void;
  onDragMove: (id: string, e: KonvaEventObject<DragEvent>) => void;
  // /** ドラッグ終了時のコールバック */
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  /** クリック時のコールバック */
  onDCPowerSupplyClick: (id: string, e: KonvaEventObject<MouseEvent>) => void;
}

const DCPowerSupplyComponent: React.FC<DCPowerSupplyComponentProps> = ({
  group,
  isSelected,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDCPowerSupplyClick,
}) => {
  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <Group 
      x={Number(group.x())} 
      y={Number(group.y())} 
      scaleX={Number(group.scaleX())} 
      scaleY={Number(group.scaleY())}
      offsetX={Number(group.width() / 2)}
      offsetY={Number(group.height() / 2)}
      rotation={Number(group.rotation())}
      draggable={true}
      onDragStart={(event) => onDragStart(group.id(), event)}
      onDragMove={(event) => onDragMove(group.id(), event)}
      onDragEnd={onDragEnd}
      onClick={(event) => onDCPowerSupplyClick(group.id(), event)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 透明な背景領域（ドラッグエリア用） */}
      <Rect
        x={0}
        y={0}
        width={60}
        height={60}
        fill="transparent"
      />

      {/* 長い線（正極） */}
      <Line 
        points={[23, 0, 23, 60]}
        stroke={isSelected ? "red" : "#000"} 
        strokeWidth={2}
      />

      {/* 短い線（負極） */}
      <Line 
        points={[37, 20, 37, 40]}
        stroke={isSelected ? "red" : "#000"} 
        strokeWidth={2}
      />

      {/* 左端子線 */}
      <Line 
        points={[0, 30, 23, 30]}
        stroke={isSelected ? "red" : "#000"} 
        strokeWidth={2}
      />

      {/* 右端子線 */}
      <Line 
        points={[37, 30, 60, 30]}
        stroke={isSelected ? "red" : "#000"} 
        strokeWidth={2}
      />
    </Group>
  );
};

export default DCPowerSupplyComponent;
