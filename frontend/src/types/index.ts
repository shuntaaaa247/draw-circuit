import type { ElementTerminalPoints } from "@/utils/stage/elementCommon";

type Project = {
  id: number;
  name: string;
  description: string;
  circuit_elements: CircuitElement[];
}

type NewProjectInput = Omit<Project, "id" | "circuit_elements">

type CircuitElement = {
  id: number;
  element_type: string;
  x_position?: number;
  y_position?: number;
  width?: number;
  height?: number;
  rotation?: number;
  start_x_position?: number;
  start_y_position?: number;
  end_x_position?: number;
  end_y_position?: number;
  properties?: {
    connectionInfos?: ConnectionInfo[]; // 接続先の要素のIDと接続端番号を保存する
  };
}

type ConnectionInfo = {
  pairElementId: string;
  myTerminal: number;
  pairTerminal: number;
  connectionLineId?: string;
}

type PairElementInfo = {
  elementA: {
    id: string,
    terminal: number
  }, 
  elementB: {
    id: string,
    terminal: number
  }
}

export type { Project, CircuitElement, NewProjectInput, ConnectionInfo, PairElementInfo, ElementTerminalPoints }