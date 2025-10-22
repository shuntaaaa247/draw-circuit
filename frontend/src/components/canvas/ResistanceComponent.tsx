import Konva from "konva";
import { Rect } from "react-konva";

interface ResistanceComponentProps {
  rect: Konva.Rect;
  isSelected: boolean;
  onResistanceClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function ResistanceComponent({ rect, isSelected, onResistanceClick, onDragStart, onDragMove }: ResistanceComponentProps) {
  console.log("レンダリングされました")

  
  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <Rect 
      x={Number(rect.x())} 
      y={Number(rect.y())} 
      width={Number(rect.width())} 
      height={Number(rect.height())} 
      rotation={Number(rect.rotation())} 
      offsetX={Number(rect.width()) / 2}
      offsetY={Number(rect.height()) / 2}
      stroke={isSelected ? "red" : "black"} 
      strokeWidth={2} 
      draggable={true} 
      fill={"white"} 
      id={rect.id()} 
      onClick={(event) => onResistanceClick(rect.id(), event)} 
      onDragStart={(event) => onDragStart(rect.id(), event)}
      onDragMove={(event) => onDragMove(rect.id(), event)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
} 