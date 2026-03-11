import 'konva/lib/shapes/Line'
import { PairElementInfo } from '.'

declare module 'konva/lib/shapes/Line' {
  interface Line {
    attrs: {
      id: string,
      points: number[],
      x: number,
      y: number,
      pairElementInfo: PairElementInfo
    }
  }
}