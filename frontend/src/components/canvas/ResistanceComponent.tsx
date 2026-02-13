import Konva from "konva";
import { Group, Rect, Line } from "react-konva";

interface ResistanceComponentProps {
  group: Konva.Group;
  isSelected: boolean;
  onResistanceClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function ResistanceComponent({ group, isSelected, onResistanceClick, onDragStart, onDragMove }: ResistanceComponentProps) {
  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  const BODY_WIDTH = 60; // 抵抗体（長方形）の幅
  const width = Number(group.width());
  const height = Number(group.height());
  const centerY = height / 2;
  const leadLength = 23; // 両端のリード線の長さ
  const bodyX = leadLength; // 長方形の左端

  return (
    // <Rect 
    //   x={Number(rect.x())} 
    //   y={Number(rect.y())} 
    //   width={Number(rect.width())} 
    //   height={Number(rect.height())} 
    //   rotation={Number(rect.rotation())} 
    //   offsetX={Number(rect.width()) / 2}
    //   offsetY={Number(rect.height()) / 2}
    //   stroke={isSelected ? "red" : "black"} 
    //   strokeWidth={2} 
    //   draggable={true} 
    //   fill={"white"} 
    //   id={rect.id()} 
    //   onClick={(event) => onResistanceClick(rect.id(), event)} 
    //   onDragStart={(event) => onDragStart(rect.id(), event)}
    //   onDragMove={(event) => onDragMove(rect.id(), event)}
    //   onMouseEnter={handleMouseEnter}
    //   onMouseLeave={handleMouseLeave}
    // />
    <Group 
      x={Number(group.x())} 
      y={Number(group.y())} 
      width={width} 
      height={height} 
      rotation={Number(group.rotation())} 
      offsetX={width / 2}
      offsetY={height / 2}
      stroke={isSelected ? "red" : "black"} 
      strokeWidth={2} 
      draggable={true} 
      // fill={"white"} 
      id={group.id()} 
      onClick={(event) => onResistanceClick(group.id(), event)} 
      onDragStart={(event) => onDragStart(group.id(), event)}
      onDragMove={(event) => onDragMove(group.id(), event)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 透明な背景領域（ドラッグエリア用） */}
      <Rect
        x={0}
        y={0}
        width={leadLength + BODY_WIDTH + leadLength}
        height={height}
        fill="transparent"
      />
      {/* 左のリード線（長方形の左端まで） */}
      <Line
        points={[0, centerY, bodyX, centerY]}
        stroke={isSelected ? "red" : "black"}
        strokeWidth={2}
      />
      {/* 抵抗体（長方形） */}
      <Rect
        x={bodyX}
        y={0}
        width={BODY_WIDTH}
        height={height}
        stroke={isSelected ? "red" : "black"}
      />
      {/* 右のリード線（長方形の右端から） */}
      <Line
        points={[leadLength + BODY_WIDTH, centerY, leadLength + BODY_WIDTH + leadLength, centerY]}
        stroke={isSelected ? "red" : "black"}
        strokeWidth={2}
      />
    </Group>
  );
} 