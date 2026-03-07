import 'konva/lib/shapes/Line'

declare module 'konva/lib/shapes/Line' {
  interface Line {
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