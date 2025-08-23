type Project = {
  id: number;
  name: string;
  description: string;
  circuit_elements: CircuitElement[];
}

type CircuitElement = {
  id: number;
  type: string;
  x_position?: number;
  y_position?: number;
  width?: number;
  height?: number;
  rotation?: number;
  start_x_position?: number;
  start_y_position?: number;
  end_x_position?: number;
  end_y_position?: number;
  properties?: object;
}

export type { Project, CircuitElement }