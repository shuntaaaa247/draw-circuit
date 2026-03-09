import "konva/lib/Group"
import { ElementTerminalPoints, ConnectionInfo } from "@/types/index"

declare module "konva/lib/Group" {
  interface Group {
    attrs: {
      x: number,
      y: number,
      properties: {
        connectionInfos: ConnectionInfo[],
      },
      terminalPoints: () => ElementTerminalPoints
    }
  }
}