import Konva from "konva";

// 線と接続線以外の要素のターミナル2点の座標を返す
export type ElementTerminalPoints = {
  0: {
    x: number,
    y: number
  },
  1: {
    x: number,
    y: number
  }
}

export const getElementTerminalPoints = (element: Konva.Group): ElementTerminalPoints => {
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

// 2つの要素間で距離が最短、最長、中間の複数のターミナルの対を返す
type TerminalPair = {
  elementA: {
    id: string,
    terminal: number
  },
  elementB: {
    id: string,
    terminal: number
  },
  distance: number,
  endPoints: number[]
}

export const getTerminalPairsBetweenElements = (elementA: Konva.Group, elementB: Konva.Group): TerminalPair[] => {
  const elementATerminalPoints = elementA.attrs.terminalPoints();
  const elementBTerminalPoints = elementB.attrs.terminalPoints();

  const terminalPairs: TerminalPair[] = [];

  for (let i = 0; i <= 1; i ++) {
    for (let j = 0; j <= 1; j ++) {
      // elementATerminalPoints[i = 0 ? 0 : 1].x
      const distance = Math.hypot(
        (elementATerminalPoints[i === 0 ? 0 : 1].x - elementBTerminalPoints[j === 0 ? 0 : 1].x),
        (elementATerminalPoints[i === 0 ? 0 : 1].y - elementBTerminalPoints[j === 0 ? 0 : 1].y)
      );

      console.log("でお")

      terminalPairs.push({
        elementA: {
          id: elementA.id(),
          terminal: i
        },
        elementB: {
          id: elementB.id(),
          terminal: j
        },
        distance: distance,
        endPoints: [
          elementATerminalPoints[i === 0 ? 0 : 1].x,
          elementATerminalPoints[i === 0 ? 0 : 1].y,
          elementBTerminalPoints[j === 0 ? 0 : 1].x,
          elementBTerminalPoints[j === 0 ? 0 : 1].y
        ]
      })
    }
  }

  // 距離が短い順にソートする
  const sortedTerminalPairs = [...terminalPairs].sort((a, b) => a.distance - b.distance);

  // 最短, 最長, 中間, 中間の順に並べ替える
  const tmp = sortedTerminalPairs[1];
  sortedTerminalPairs[1] = sortedTerminalPairs[3];
  sortedTerminalPairs[3] = tmp;

  console.log("sorted:", sortedTerminalPairs)
  return sortedTerminalPairs;
}
