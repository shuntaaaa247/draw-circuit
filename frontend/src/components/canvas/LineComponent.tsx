'use client'

import Konva from "konva";
import { Line, Circle, Group } from "react-konva";

interface LineComponentProps {
  line: Konva.Line;
  isSelected: boolean;
  onLineClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onLineResize: (event: Konva.KonvaEventObject<MouseEvent>, id: string, newPoints?: number[], newX?: number, newY?: number, newLength?: number) => void;
}

export default function LineComponent({ 
  line, 
  isSelected, 
  onLineClick, 
  onDragStart,
  onDragMove,
  onLineResize
}: LineComponentProps) {

  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  // Lineの中心座標を計算
  const points = line.points(); // Lineの座標[x1, y1, x2, y2] Line.x(),Line.y()からの相対座標 Lineのベクトルが変わらなければこの値は変わらない
  const centerX = (points[0] + points[2]) / 2; // x1 + x2 / 2 // 仮
  const centerY = (points[1] + points[3]) / 2; // y1 + y2 / 2  //　仮

  // 制御点のドラッグハンドラ
  const handleControlPointDrag = (pointIndex: number, event: Konva.KonvaEventObject<MouseEvent>) => {
    points[pointIndex * 2] = event.target.x()
    points[pointIndex * 2 + 1] = event.target.y()

    onLineResize(event, line.id(), points) 
  };

  const handleControlPointClick = (pointIndex: number, event: Konva.KonvaEventObject<MouseEvent>) => {
    alert(event.target.x())
  }

  return (
    <Group 
      draggable={true}
      onDragStart={(event) => onDragStart(line.id(), event)}
      onDragMove={(event) => onDragMove(line.id(), event)}
    >
      <Line
        points={points}
        stroke={isSelected ? "red" : "black"}
        strokeWidth={isSelected ? 3 : 2}
        hitStrokeWidth={15} // クリック領域を15pxに拡張
        // draggable={true}
        onClick={(event) => onLineClick(line.id(), event)}
        // onDragStart={(event) => onDragStart(line.id(), event)}
        // onDragMove={(event) => onDragMove(line.id(), event)}
        // x={line.points()[0]}
        // y={line.points()[1]}
        rotation={line.rotation()}
        // offsetX={centerX}
        // offsetY={centerY}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {isSelected && (
        <>
          {/* 開始点の制御点 */}
          <Circle
            // x={line.x() + points[0] - centerX}
            // y={line.y() + points[1] - centerY}

            // 点をLineの開始点に合わせる
            // x={line.x() - Math.cos(line.rotation() * Math.PI / 180) * Math.abs((points[2] - points[0])/2)}
            // y={line.y() - Math.sin(line.rotation() * Math.PI / 180) * Math.abs((points[2] - points[0])/2)}
            x={points[0]}
            y={points[1]}
            radius={6}
            fill="blue"
            stroke="white"
            strokeWidth={2}
            draggable={true}
            onClick={(event) => handleControlPointClick(0, event)}
            onDragMove={(event) => handleControlPointDrag(0, event)}
            onMouseEnter={() => document.body.style.cursor = 'crosshair'}
            onMouseLeave={() => document.body.style.cursor = 'default'}
          />
          
          {/* 終了点の制御点 */}
          <Circle
            // x={line.x() + points[2] - centerX}
            // y={line.y() + points[3] - centerY}

            // 点をLineの終了点に合わせる
            // x={line.x() + Math.cos(line.rotation() * Math.PI / 180) * Math.abs((points[2] - points[0])/2)}
            // y={line.y() + Math.sin(line.rotation() * Math.PI / 180) * Math.abs((points[2] - points[0])/2)}

            x={points[2]}
            y={points[3]}

            radius={6}
            fill="blue"
            stroke="white"
            strokeWidth={2}
            draggable={true}
            onClick={(event) => handleControlPointClick(1, event)}
            onDragMove={(event) => handleControlPointDrag(1, event)}
            onMouseEnter={() => document.body.style.cursor = 'crosshair'}
            onMouseLeave={() => document.body.style.cursor = 'default'}
          />
        </>
      )}
    </Group>
  );
} 