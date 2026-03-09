import 'konva/lib/shapes/Line'

declare module 'konva/lib/shapes/Line' {
  interface Line {
    attrs: {
      id: string,
      points: number[],
      x: number,
      y: number,
      pairElementInfo: {
        elementA: {
          id: string;
          terminal: number;
        };
        elementB: {
          id: string;
          terminal: number;
        };
      };
    }
  }
}