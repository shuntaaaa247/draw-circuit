import Konva from "konva";

// 線と接続線以外の要素のターミナル2点の座標を返す
export const getTerminalPoints = (element: Konva.Group) => {
  const x = element.x();
  const y = element.y();
  const width = element.width();
  const rotation = element.rotation();

  return {
    // 回転角に応じたターミナルの座標を返す
    0: { 
      x: x - (width / 2) * Math.cos(rotation % 360 * Math.PI / 180), 
      y: y - (width / 2) * Math.sin(rotation % 360 * Math.PI / 180)
    },
    1: { 
      x: x + (width / 2) * Math.cos(rotation % 360 * Math.PI / 180), 
      y: y + (width / 2) * Math.sin(rotation % 360 * Math.PI / 180)
    }
  }
}