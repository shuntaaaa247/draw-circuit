// connectionLineの自動追従機能を切り出したが、一旦保留

import Konva from "konva";
import { ConnectionInfo, PairElementInfo } from "../../types/index";
import { getTerminalPairsBetweenElements } from "./elementCommon";

// 追加する接続線の情報を接続先の要素に追加する
export const addConnectionInfo = (
  elementA: Konva.Group,
  elementB: Konva.Group, 
  connectionLineId: string
) => {

  // 接続線が最短距離となるelementA, elementBのターミナルを取得
  const terminalPairsBetweenElements = getTerminalPairsBetweenElements(elementA, elementB);
  const elementATerminal = terminalPairsBetweenElements[0].elementA.terminal
  const elementBTerminal = terminalPairsBetweenElements[0].elementB.terminal

  // 接続情報を素子に保存する
  const elementAConnectionInfos: ConnectionInfo[] = elementA.attrs.properties.connectionInfos || [];
  elementAConnectionInfos.push({pairElementId: elementB.id(), myTerminal: elementATerminal, pairTerminal: elementBTerminal, connectionLineId: connectionLineId}); // とりあえず、myTerminalは1、pairTerminalは0にしている
  elementA.setAttrs({properties: {...elementA.attrs.properties, connectionInfos: elementAConnectionInfos}});

  const elementBConnectionInfos: ConnectionInfo[] = elementB.attrs.properties.connectionInfos || [];
  elementBConnectionInfos.push({pairElementId: elementA.id(), myTerminal: elementBTerminal, pairTerminal: elementATerminal, connectionLineId: connectionLineId}); // とりあえず、myTerminalは0、pairTerminalは1にしている
  elementB.setAttrs({properties: {...elementB.attrs.properties, connectionInfos: elementBConnectionInfos}});
}

export const getElementConnectionLines = (element: Konva.Group, connectionLines: Konva.Line[]): Konva.Line[] => {
  const connectionInfos = element.attrs.properties?.connectionInfos;
  if (!connectionInfos) {
    return []
  };

  const elementConnectionLines: Konva.Line[] = [];

  connectionInfos.forEach((connectionInfo: ConnectionInfo) => {
    const connectionLineId = connectionInfo.connectionLineId;
    if (!connectionLineId) return;

    const connectionLine = connectionLines.find((connectionLine) => connectionLineId === connectionLine.id());
    if (!connectionLine) return;

    elementConnectionLines.push(connectionLine)
  })

  return elementConnectionLines;
}

export const trackConnectionLine = (elementsToMove: (Konva.Group | Konva.Line)[], selectedIds: string[], connectionLines: Konva.Line[], deltaX: number, deltaY: number) => {
  const updatedBetweenConnectionLineIds = new Set<string>(); // 接続線の両端の素子が選択されている場合に、接続線の座標がすでに更新されているかどうかをチェックするフラグとして利用する

  elementsToMove.forEach((element) => {
    if(element instanceof Konva.Group && element.attrs.properties?.connectionInfos) {
      element.attrs.properties.connectionInfos.forEach((connectionInfo: ConnectionInfo) => {
        const connectionLineId = connectionInfo.connectionLineId;
        if (!connectionLineId) return;
        
        // すでに接続線の座標が更新されている場合は、何もせずに終了する(複数素子が選択されていた場合に2重で更新されるのを防ぐため)
        if (updatedBetweenConnectionLineIds.has(connectionLineId)) return; 

        const connectionLine = connectionLines.find((connectionLine) => connectionLineId === connectionLine.id());

        if (!connectionLine) return;

        const elementAId = connectionLine.attrs.pairElementInfo?.elementA.id; // 接続線の片方の要素のid
        const elementBId = connectionLine.attrs.pairElementInfo?.elementB.id; // 接続線のもう片方の要素のid

        // 仮(バグあり) 接続線の両方の要素がドラッグにより同時に移動された場合は、接続線の座標全体を更新する。
        if (selectedIds.includes(elementAId) && selectedIds.includes(elementBId)) {
          // この接続線自体が選択されている場合は上のelementsToMove.forEachで既に座標が更新されているので、何もせずに終了する
          if (selectedIds.includes(connectionLine.attrs.id)) return;

          // 接続線の座標を更新する
          connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
          updatedBetweenConnectionLineIds.add(connectionLineId)
          return;
        } 
        // 接続線の片方の要素が選択されている(移動される)要素の場合は、接続線の片方の座標を更新する
        else if (elementAId === element.id()) {
          connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2], connectionLine.points()[3]]);
        } else if (elementBId === element.id()) {
          connectionLine.points([connectionLine.points()[0], connectionLine.points()[1], connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
        }
      });
    }
  });
}

export const getConnectionLinePairElements = (connectionLine: Konva.Line, allElementsExceptLines: (Konva.Group)[]): {
  elementA: Konva.Group,
  elementB: Konva.Group,
  pairElementInfo: PairElementInfo
} | undefined => {
  const pairElementInfo = connectionLine.attrs.pairElementInfo;
  if (!pairElementInfo) return undefined;

  const elementAConnectionInfo = pairElementInfo.elementA;
  const elementBConnectionInfo = pairElementInfo.elementB;
  if (!elementAConnectionInfo || !elementBConnectionInfo) return undefined;

  const elementA = allElementsExceptLines.find((element) => element.id() === elementAConnectionInfo.id);
  const elementB = allElementsExceptLines.find((element) => element.id() === elementBConnectionInfo.id);

  if (!elementA || !elementB) return undefined;

  return {
    elementA,
    elementB,
    pairElementInfo
  }
}

// ↓旧版
// // 接続線が自動追従するようにする
// export const trackConnectionLine = (elementsToMove: (Konva.Group | Konva.Line)[], selectedIds: string[], connectionLines: Konva.Line[], deltaX: number, deltaY: number) => {
//   const updatedBetweenConnectionLineIds = new Set<string>(); // 接続線の両端の素子が選択されている場合に、接続線の座標がすでに更新されているかどうかをチェックするフラグとして利用する

//   elementsToMove.forEach((element) => {
//     if(element.attrs.properties?.connectionInfos) {
//       element.attrs.properties.connectionInfos.forEach((connectionInfo: ConnectionInfo) => {
//         const connectionLineId = connectionInfo.connectionLineId;
//         if (!connectionLineId) return;
        
//         // すでに接続線の座標が更新されている場合は、何もせずに終了する(複数素子が選択されていた場合に2重で更新されるのを防ぐため)
//         if (updatedBetweenConnectionLineIds.has(connectionLineId)) return; 

//         const connectionLine = connectionLines.find((connectionLine) => connectionLineId === connectionLine.id());

//         if (!connectionLine) return;
//         console.log("追従するconnectionLine:", connectionLine.id())

//         const elementAId = connectionLine.attrs.pairElementInfo?.elementA.id; // 接続線の片方の要素のid
//         const elementBId = connectionLine.attrs.pairElementInfo?.elementB.id; // 接続線のもう片方の要素のid

//         // 仮(バグあり) 接続線の両方の要素がドラッグにより同時に移動された場合は、接続線の座標全体を更新する。
//         if (selectedIds.includes(elementAId) && selectedIds.includes(elementBId)) {
//           // この接続線自体が選択されている場合は上のelementsToMove.forEachで既に座標が更新されているので、何もせずに終了する
//           if (selectedIds.includes(connectionLine.attrs.id)) return;

//           // 接続線の座標を更新する
//           connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
//           updatedBetweenConnectionLineIds.add(connectionLineId)
//           return;
//         } 
//         // 接続線の片方の要素が選択されている(移動される)要素の場合は、接続線の片方の座標を更新する
//         else if (elementAId === element.id()) {
//           connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2], connectionLine.points()[3]]);
//         } else if (elementBId === element.id()) {
//           connectionLine.points([connectionLine.points()[0], connectionLine.points()[1], connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
//         }
//       });
//     }
//   });
// }



// ↓↓↓旧版
// // 接続線が自動追従するようにする
// export const trackConnectionLine = (elementsToMove: (Konva.Group | Konva.Line)[], selectedIds: string[], connectionLines: Konva.Line[], deltaX: number, deltaY: number) => {
//   let betweenConnectionLineIsUpdated = false; // 接続線の座標がすでに更新されているかどうかをチェックするフラグ

//   elementsToMove.forEach((element) => {
//     if(element.attrs.properties?.connectionInfos) {
//       element.attrs.properties.connectionInfos.forEach((connectionInfo: ConnectionInfo) => {
//         const pairElementId = connectionInfo.pairElementId;
//         const connectionLine = connectionLines.find((connectionLine) => connectionInfo.connectionLineId === connectionLine.id());

//         if (!connectionLine) return;
//         console.log("追従するconnectionLine:", connectionLine.id())

//         const elementAId = connectionLine.attrs.pairElementInfo?.elementA.id; // 接続線の片方の要素のid
//         const elementBId = connectionLine.attrs.pairElementInfo?.elementB.id; // 接続線のもう片方の要素のid

//         // 仮(バグあり) 接続線の両方の要素がドラッグにより同時に移動された場合は、接続線の座標全体を更新する。
//         if (selectedIds.includes(elementAId) && selectedIds.includes(elementBId)) {
//           // この接続線自体が選択されている場合は上のelementsToMove.forEachで既に座標が更新されているので、何もせずに終了する
//           if (selectedIds.includes(connectionLine.attrs.id)) return;

//           // すでに接続線の座標が更新されている場合は、何もせずに終了する(複数素子が選択されていた場合に2重で更新されるのを防ぐため)
//           if (betweenConnectionLineIsUpdated) return;

//           // 接続線の座標を更新する
//           connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
//           betweenConnectionLineIsUpdated = true;
//           return;
//         } 
//         // 接続線の片方の要素が選択されている(移動される)要素の場合は、接続線の片方の座標を更新する
//         else if (elementAId === element.id()) {
//           connectionLine.points([connectionLine.points()[0] + deltaX, connectionLine.points()[1] + deltaY, connectionLine.points()[2], connectionLine.points()[3]]);
//         } else if (elementBId === element.id()) {
//           connectionLine.points([connectionLine.points()[0], connectionLine.points()[1], connectionLine.points()[2] + deltaX, connectionLine.points()[3] + deltaY]);
//         }
//       });
//     }
//   });
// }