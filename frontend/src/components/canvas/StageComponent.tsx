'use client'

import Link from "next/link";
import Konva from "konva";
import { Stage, Layer, Line, Rect } from "react-konva";
import { useEffect, useState, useRef, useCallback } from "react"; 
import { usePathname, redirect, useRouter } from "next/navigation";  
import ResistanceComponent from "./ResistanceComponent";
import DCPowerSupplyComponent from "./DCPowerSupplyComponent";
import CapacitorComponent from "./CapacitorComponent";
import InductorComponent from "./InductorComponent";
import LineComponent from "./LineComponent";
import { Project, CircuitElement } from "@/types";

export default function StageComponent({ project }: { project: Project }) {
  const pathname = usePathname();
  const [resistanceCounter, setResistanceCounter] = useState(0); // 消せる余地あり
  const [dcPowerSupplyCounter, setDcPowerSupplyCounter] = useState(0); // 消せる余地あり
  const [capacitorCounter, setCapacitorCounter] = useState(0); // 消せる余地あり
  const [inductorCounter, setInductorCounter] = useState(0); // 消せる余地あり
  const [lineCounter, setLineCounter] = useState(0); // 消せる余地あり
  const [resistances, setResistances] = useState<Konva.Rect[]>([]);
  const [dcPowerSupplies, setDcPowerSupplies] = useState<Konva.Group[]>([]);
  const [capacitors, setCapacitors] = useState<Konva.Group[]>([]);
  const [inductors, setInductors] = useState<Konva.Group[]>([]);
  const [lines, setLines] = useState<Konva.Line[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pointerPosition, setPointerPosition] = useState<{x: number, y: number}>({x: 0, y: 0}); 
  const [isSaving, setIsSaving] = useState(false);
  const [copiedElementsData, setCopiedElementsData] = useState<Omit<CircuitElement, "id">[]>([]);
  const [pasteCounter, setPasteCounter] = useState(0);

  const [selectionRectangle, setSelectionRectangle] = useState({ // 範囲選択中に選択範囲を表示するための矩形
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const isSelecting = useRef(false); // 範囲選択中かどうかを管理するためのref
  const isDraggingLineControlPoint = useRef(false); // Lineの制御点をドラッグしているかどうかを管理するためのref

  useEffect(() => {
    // console.log("project.circuit_elements:", project.circuit_elements)
    
    // 既存の要素をクリア
    setResistances([]);
    setLines([]);
    setDcPowerSupplies([]);
    setCapacitors([]);
    setInductors([]);
    
    // カウンターをリセット
    setResistanceCounter(0);
    setLineCounter(0);
    setDcPowerSupplyCounter(0);
    setCapacitorCounter(0);
    setInductorCounter(0);

    let _resistanceCounter = 0;
    let _lineCounter = 0;
    let _dcPowerSupplyCounter = 0;
    let _capacitorCounter = 0;
    let _inductorCounter = 0;
    
    project.circuit_elements.forEach((element: CircuitElement) => {
      if (element.element_type === "resistance") {
        _resistanceCounter++
        addResistance(Number(element.x_position), Number(element.y_position), Number(element.rotation), `${_resistanceCounter}-loaded`)
      } 
      else if (element.element_type === "line") {
        _lineCounter++
        addLine(Number(element.x_position), Number(element.y_position), Number(element.start_x_position), Number(element.start_y_position), Number(element.end_x_position), Number(element.end_y_position), `${_lineCounter}-loaded`)
      } else if (element.element_type === "dc_power_supply") {
        _dcPowerSupplyCounter++
        addDCPowerSupply(Number(element.x_position), Number(element.y_position), Number(element.rotation), `${_dcPowerSupplyCounter}-loaded`)
      } else if (element.element_type === "capacitor") {
        _capacitorCounter++
        addCapacitor(Number(element.x_position), Number(element.y_position), Number(element.rotation), `${_capacitorCounter}-loaded`)
      } else if (element.element_type === "inductor") {
        _inductorCounter++
        addInductor(Number(element.x_position), Number(element.y_position), Number(element.rotation), `${_inductorCounter}-loaded`)
      }
    })
    
    // 保存されていた要素をセットし終わったら、カウンターをセットする
    setResistanceCounter(_resistanceCounter);
    setLineCounter(_lineCounter);
    setDcPowerSupplyCounter(_dcPowerSupplyCounter);
    setCapacitorCounter(_capacitorCounter);
    setInductorCounter(_inductorCounter);
    
    // isInitialized = true;
  }, [])

  // キーを押した時の処理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // バックスペースが押された場合は、選択された要素を削除
    if (e.key === "Backspace") {
      // 選択された要素を各配列から削除
      setResistances(prevResistances => prevResistances.filter((resistance) => !selectedIds.includes(resistance.id())));
      setDcPowerSupplies(prevDcPowerSupplies => prevDcPowerSupplies.filter((dcPowerSupply) => !selectedIds.includes(dcPowerSupply.id())));
      setCapacitors(prevCapacitors => prevCapacitors.filter((capacitor) => !selectedIds.includes(capacitor.id())));
      setInductors(prevInductors => prevInductors.filter((inductor) => !selectedIds.includes(inductor.id())));
      setLines(prevLines => prevLines.filter((line) => !selectedIds.includes(line.id())));
      setSelectedIds([]);
    }

    // Ctrl/Command + Sが押された場合は、保存処理を行う
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSaveClick();
    }

    // Ctrl/Command + Cが押された場合は、コピーを行う
    if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCopyClick();
    }

    // Ctrl/Command + Vが押された場合は、ペーストを行う
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePasteClick();
    }

    // 方向キーが押された場合は、選択された要素を移動する
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      // console.log(e.key + "が押されました")
      const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
      const selectedElements = allElements.filter((element) => selectedIds.includes(element.id()));
      selectedElements.forEach((element) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { // 上矢印もしくは下矢印が押された場合
          if (element instanceof Konva.Line) { // Lineの場合は、pointsを更新する
            element.points([element.points()[0], element.points()[1] + (e.key === "ArrowUp" ? -1 : 1), element.points()[2], element.points()[3] + (e.key === "ArrowUp" ? -1 : 1)]);
          } else { // それ以外の要素は、y座標を更新する
            element.y(element.y() + (e.key === "ArrowUp" ? -1 : 1));
          }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") { // 左矢印もしくは右矢印が押された場合
          if (element instanceof Konva.Line) { // Lineの場合は、pointsを更新する
            element.points([element.points()[0] + (e.key === "ArrowLeft" ? -1 : 1), element.points()[1], element.points()[2] + (e.key === "ArrowLeft" ? -1 : 1), element.points()[3]]);
          } else { // それ以外の要素は、x座標を更新する
            element.x(element.x() + (e.key === "ArrowLeft" ? -1 : 1));
          }
        }
      });
      setResistances([...resistances]);
      setDcPowerSupplies([...dcPowerSupplies]);
      setCapacitors([...capacitors]);
      setInductors([...inductors]);
      setLines([...lines]);
    }

    
  }, [selectedIds, copiedElementsData]); // copiedElementsDataも監視している(これがないとコピー後の初回ペーストができない)

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const addResistance = (x?: number, y?: number, rotation?: number, id?: string): string => { // idはデータベースのidで初期ロードでデータベース上の素子を描画するときはこのidを使用する
    // console.log("レジスタンスを追加します")
    // 新しく追加する要素の場合は、カウンターを先にインクリメント
    if (!id) {
      setResistanceCounter(prevResistanceCounter => prevResistanceCounter + 1);
    }
    const resistance = new Konva.Rect({
      x: x && y ? x : 100 + resistanceCounter * 10, // 重ならないように少しずらす
      y: y && y ? y : 100 + resistanceCounter * 10, // 中心座標に調整（y + height/2）
      width: 70,
      height: 25,  
      id: `resistance-${id ? id : resistanceCounter + 1}`,
      rotation: rotation ? rotation : 0, // 回転角度を初期化
    });
    setResistances(prevResistances => [...prevResistances, resistance]);
    return resistance.id();
  }

  const addLine = (x?: number, y?: number, startXPosition?: number, startYPosition?: number, endXPosition?: number, endYPosition?: number, id?: string): string => {
    // console.log("線を追加します")
    // 新しく追加する要素の場合は、カウンターを先にインクリメント
    if (!id) {
      setLineCounter(prevLineCounter => prevLineCounter + 1);
    }
    
    const startPointX = startXPosition && startYPosition && endXPosition && endYPosition ? startXPosition : 0 + lines.length * 10;
    const startPointY = startXPosition && startYPosition && endXPosition && endYPosition ? startYPosition : 100 + lines.length * 10;
    const endPointX = startXPosition && startYPosition && endXPosition && endYPosition ? endXPosition : startPointX + 100;
    const endPointY = startXPosition && startYPosition && endXPosition && endYPosition ? endYPosition : startPointY;
    
    const line = new Konva.Line({
      // x: x && y ? x : 0,
      // y: y && y ? y : 0,
      points: [startPointX, startPointY, endPointX, endPointY],
      // points: [startPointX + (x ? x : 0), startPointY + (y ? y : 0), endPointX + (x ? x : 0), endPointY + (y ? y : 0)],
      id: `line-${id ? id : lineCounter + 1}`,
      rotation: 0,
    });
    setLines(prevLines => [...prevLines, line]);
    return line.id();
  }

  const addDCPowerSupply = (x?: number, y?: number, rotation?: number, id?: string): string => {
    // console.log("DC電源を追加します")
    if (!id) {
      setDcPowerSupplyCounter(prevDcPowerSupplyCounter => prevDcPowerSupplyCounter + 1);
    }
    
    // setDcPowerSupplyCounter(prevDcPowerSupplyCounter => prevDcPowerSupplyCounter + 1);
    
    const dcPowerSupply = new Konva.Group({
      x: x && y ? x : 150 + dcPowerSupplyCounter * 10, // 重ならないように少しずらす
      y: y && y ? y : 150 + dcPowerSupplyCounter * 10,
      width: 60,
      height: 60,
      rotation: rotation ? rotation : 0,
      id: `dcPowerSupply-${id ? id : dcPowerSupplyCounter + 1}`,
    });
    setDcPowerSupplies(prevDcPowerSupplies => [...prevDcPowerSupplies, dcPowerSupply]);
    return dcPowerSupply.id();
  }

  const addCapacitor = (x?: number, y?: number, rotation?: number, id?: string): string => {
    // console.log("コンデンサを追加します")
    if (!id) {
      setCapacitorCounter(prevCapacitorCounter => prevCapacitorCounter + 1);
    }
    
    // setCapacitorCounter(prevCapacitorCounter => prevCapacitorCounter + 1);
    
    const capacitor = new Konva.Group({
      x: x && y ? x : 200 + capacitorCounter * 10, // 重ならないように少しずらす
      y: y && y ? y : 200 + capacitorCounter * 10,
      width: 60,
      height: 60,
      rotation: rotation ? rotation : 0,
      id: `capacitor-${id ? id : capacitorCounter + 1}`,
    });
    setCapacitors(prevCapacitors => [...prevCapacitors, capacitor]);
    return capacitor.id();
  }

  const addInductor = (x?: number, y?: number, rotation?: number, id?: string): string => {
    // console.log("インダクタを追加します")
    if (!id) {
      setInductorCounter(prevInductorCounter => prevInductorCounter + 1);
    }
    
    // setInductorCounter(prevInductorCounter => prevInductorCounter + 1);
    
    const inductor = new Konva.Group({
      x: x && y ? x : 250 + inductorCounter * 10, // 重ならないように少しずらす
      y: y && y ? y : 250 + inductorCounter * 10,
      width: 86.4, // 20%拡大: 72 * 1.2
      height: 72,  // 20%拡大: 60 * 1.2
      rotation: rotation ? rotation : 0,
      id: `inductor-${id ? id : inductorCounter + 1}`,
    });
    setInductors(prevInductors => [...prevInductors, inductor]);
    return inductor.id();
  }

  const handleClick = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    
    // console.log("x: " + event.target.x())
    // console.log("y: " + event.target.y())
    // console.log("width: " + event.target.width())
    // console.log("height: " + event.target.height())
    // console.log("rotation: " + event.target.rotation())
    // console.log("id: " + event.target.id())
    // console.log("points: " + (event.target instanceof Konva.Line ? event.target.points() : "Not Line"))

    // ただクリックした場合は選択状態の要素をクリックされた要素のみにする
    setSelectedIds([id]);

    // シフトキーを押している場合は、選択状態の要素にシフトクリックされた要素を追加する
    if (event.evt.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } 
  }

  const handleStageClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    // Stageの背景をクリックした場合（targetがStageの場合）、選択状態をクリア
    if (event.target === event.target.getStage()) {
      setSelectedIds([]);
    }
  }

  const rotateSelectedElement = () => {
    if (selectedIds.length === 1) {
      const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
      const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
      if (selectedElement) {
        selectedElement.rotation(selectedElement.rotation() + 45);
        // 各要素タイプの状態を更新
        setResistances([...resistances]);
        setDcPowerSupplies([...dcPowerSupplies]);
        setCapacitors([...capacitors]);
        setInductors([...inductors]);
        setLines([...lines]);
      }
    }
  }

  const handleDragStart = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedIds.length === 0 || selectedIds.length === 1) {
      setSelectedIds([id]);
    }
  }

  const handleElementDragMove = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    // console.log("lines:", lines)

    // if (document.body.style.cursor === 'crosshair') { // Lineの制御点をドラッグしている場合は、Line自体としてのドラッグを無視する
    //   return;
    // } // 最低限これでいいかもしれないが、Lineの制御点をドラッグ中にカーソルの種類が変わってしまうことがあるため、カバーしきれない
    if (isDraggingLineControlPoint.current) {
      return;
    }

    console.log("あああ")

    const draggedElement = event.target;
    
    // 全ての要素配列を統合して、ドラッグされた要素を見つける
    const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
    const draggedElementData = allElements.find((element) => element.id() === id);
    
    if (!draggedElementData) return;

    // ドラッグした要素の移動量を計算
    const deltaX = draggedElement.x() - draggedElementData.x();
    const deltaY = draggedElement.y() - draggedElementData.y();

    // 選択されている要素（ドラッグした要素を含まない）をすべて同じ量だけ移動
    const elementsToMove = selectedIds.includes(id) ? 
      allElements.filter((element) => selectedIds.includes(element.id()) && element.id() !== id) :
      [];

    // ドラッグした要素のデータを更新
    draggedElementData.x(draggedElement.x());
    draggedElementData.y(draggedElement.y());

    // 他の選択された要素も同じ量だけ移動
    elementsToMove.forEach((element) => {
      // element.x(element.x() + deltaX);
      // element.y(element.y() + deltaY);
      if (element instanceof Konva.Line) {
        element.points([element.points()[0] + deltaX, element.points()[1] + deltaY, element.points()[2] + deltaX, element.points()[3] + deltaY]);
        // element.points([element.points()[0] + Math.round(deltaX), element.points()[1] + Math.round(deltaY), element.points()[2] + Math.round(deltaX), element.points()[3] + Math.round(deltaY)]);
      } else {
        element.x(element.x() + deltaX);
        element.y(element.y() + deltaY);
        // element.x(element.x() + Math.round(deltaX));
        // element.y(element.y() + Math.round(deltaY));
      }
    });

    // 各要素タイプの状態を更新
    setResistances([...resistances]);
    setDcPowerSupplies([...dcPowerSupplies]);
    setCapacitors([...capacitors]);
    setInductors([...inductors]);
    setLines([...lines]);
  }
  
  // テスト用
  // handleLineResizeが実行されるとここが実行されるので、handleLineResizeが実行されるとlinesが変更されることを確認できる
  // useEffect(() => {
  //   // console.log("line.x(0): " + line.x())
  //   // console.log("line.y(0): " + line.y())
  //   alert("テスト")
  //   alert("lines[0]: " + JSON.stringify(lines[0]))
  // }, [lines])

  // const handleLineResize = (event: Konva.KonvaEventObject<MouseEvent>, id: string, newPoints?: number[]) => {
  const handleLineResize = (event: Konva.KonvaEventObject<MouseEvent>, id: string, newX?: number, newY?: number, newPoints?: number[]) => {
    const line = lines.find((line) => line.id() === id);
    setPointerPosition(event.target.getStage()?.getPointerPosition() || {x: 0, y: 0})
    if (line) {
      // line.x(0); // 試験的に追加 これができればいいんだけど効かないっぽい
      // line.y(0); // 試験的に追加
      // line.attrs.x = 0; // 試験的に追加
      // line.attrs.y = 0; // 試験的に追加
      // alert("line.x(0): " + line.x())
      // alert("line.y(0): " + line.y())
      line.points(newPoints)
      console.log("line:", line)
      setLines([...lines]);
    }
  }

  const handleSaveClick = async () => {

    if (pathname === "/canvas") {
      alert("ログインしていない場合は保存できません")
      return;
    }
    
    setIsSaving(true);
    // console.log("resistances:", resistances)
    // console.log("lines:", lines)
    // console.log("dcPowerSupplies:", dcPowerSupplies)
    // console.log("capacitors:", capacitors)
    // console.log("inductors:", inductors)

    const elements = [...resistances, ...lines, ...dcPowerSupplies, ...capacitors, ...inductors]
    const latestCircuitElementsData = elements.map((element) => {
      let elementType = element.id().split("-")[0]
      if (elementType === "dcPowerSupply") {
        elementType = "dc_power_supply"
      }
      return {
        element_type: elementType,
        // x_position: element.attrs.x,
        // y_position: element.attrs.y,
        x_position: elementType === "line" ? null : element.attrs.x,
        y_position: elementType === "line" ? null : element.attrs.y,
        // start_x_position: elementType === "line" ? element.attrs.points[0] : null,
        // start_y_position: elementType === "line" ? element.attrs.points[1] : null,
        // end_x_position: elementType === "line" ? element.attrs.points[2] : null,
        // end_y_position: elementType === "line" ? element.attrs.points[3] : null, // 線の場合は4つの座標が必要なので、3つ目と4つ目は0にする
        start_x_position: elementType === "line" ? element.attrs.points[0] + (element.attrs.x ? element.attrs.x : 0) : null,
        start_y_position: elementType === "line" ? element.attrs.points[1] + (element.attrs.y ? element.attrs.y : 0) : null,
        end_x_position: elementType === "line" ? element.attrs.points[2] + (element.attrs.x ? element.attrs.x : 0) : null,
        end_y_position: elementType === "line" ? element.attrs.points[3] + (element.attrs.y ? element.attrs.y : 0) : null, // 線の場合は4つの座標が必要なので、3つ目と4つ目は0にする
        width: element.width(),
        height: element.height(),
        rotation: element.rotation(),
      }
    })
    console.log("latestCircuitElementsData:", latestCircuitElementsData)
    
    let shouldRedirect = false;

    try {
      const response = await fetch(`http://localhost:4000/api/v1/projects/${project.id}/save_latest_circuit_elements_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTYxMTA4OTd9.armj_UqA-XNCudvmwxnHlsxeV76uUIiXtCydUOQPTqc",
        },
        body: JSON.stringify({ latest_circuit_elements_data: latestCircuitElementsData }),
        credentials: 'include',
      });
      if (!response.ok) {
        if(response.status === 401) {
          // 今後この場でログインできるようにしたい(保存前の回路のデータが失われないような方法を要検討)
          alert("セッションが切れました。トップページにリダイレクトします。");
          shouldRedirect = true;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error saving latest circuit elements data:", error);
    }
    
    if (shouldRedirect) {
      redirect("/api/auth/logout");
    }
    setIsSaving(false);
  }

  const handleCopyClick = () => {
    console.log("コピーを行います");
    // 選択されている要素をコピー(時間かかりそうだけどとりあえずこれで...)
    // setCopiedElements([...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines].filter((element) => selectedIds.includes(element.id())));
    const copiedElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines].filter((element) => selectedIds.includes(element.id()));

    // handleSaveClick内のコードと同じように、コピーされた要素のデータを取得
    const copiedElementsData = copiedElements.map((element) => {
      let elementType = element.id().split("-")[0]
      if (elementType === "dcPowerSupply") {
        elementType = "dc_power_supply"
      }
      return {
        element_type: elementType,
        x_position: element.attrs.x,
        y_position: element.attrs.y,
        // start_x_position: elementType === "line" ? element.attrs.points[0] : null,
        // start_y_position: elementType === "line" ? element.attrs.points[1] : null,
        // end_x_position: elementType === "line" ? element.attrs.points[2] : null,
        // end_y_position: elementType === "line" ? element.attrs.points[3] : null, // 線の場合は4つの座標が必要なので、3つ目と4つ目は0にする
        start_x_position: elementType === "line" ? element.attrs.points[0] + (element.attrs.x ? element.attrs.x : 0) : null,
        start_y_position: elementType === "line" ? element.attrs.points[1] + (element.attrs.y ? element.attrs.y : 0) : null,
        end_x_position: elementType === "line" ? element.attrs.points[2] + (element.attrs.x ? element.attrs.x : 0) : null,
        end_y_position: elementType === "line" ? element.attrs.points[3] + (element.attrs.y ? element.attrs.y : 0) : null,
        width: element.width(),
        height: element.height(),
        rotation: element.rotation(),
      }
    })

    setCopiedElementsData(copiedElementsData);
    setPasteCounter(0);
  }

  // デバッグ用
  useEffect(() => {
    console.log("コピーされた要素のデータ:", copiedElementsData)
  }, [copiedElementsData])

  const handlePasteClick = () => {
    console.log("ペーストを行います")
    console.log("copiedElementsData:", copiedElementsData)

    let _resistanceCounter = resistanceCounter;
    let _lineCounter = lineCounter;
    let _dcPowerSupplyCounter = dcPowerSupplyCounter;
    let _capacitorCounter = capacitorCounter;
    let _inductorCounter = inductorCounter;

    const pastedElementIds: string[] = [];

    if (copiedElementsData.length === 0) {
      console.log("コピーされた要素のデータが空です")
      return;
    }
    
    copiedElementsData.forEach((element) => {
      if (element.element_type === "resistance") {
        _resistanceCounter++
        const id = addResistance(Number(element.x_position) + 5*(pasteCounter+1), Number(element.y_position) + 5*(pasteCounter+1), Number(element.rotation), `${_resistanceCounter}`)
        pastedElementIds.push(id);
      } 
      else if (element.element_type === "line") {
        _lineCounter++
        const id = addLine(Number(element.x_position), Number(element.y_position), Number(element.start_x_position) + 5*(pasteCounter+1), Number(element.start_y_position) + 5*(pasteCounter+1), Number(element.end_x_position) + 5*(pasteCounter+1), Number(element.end_y_position) + 5*(pasteCounter+1), `${_lineCounter}`)
        // const id = addLine(undefined, undefined, Number(element.start_x_position) + 5*(pasteCounter+1), Number(element.start_y_position) + 5*(pasteCounter+1), Number(element.end_x_position) + 5*(pasteCounter+1), Number(element.end_y_position) + 5*(pasteCounter+1), `${_lineCounter}`)
        pastedElementIds.push(id);
      } else if (element.element_type === "dc_power_supply") {
        _dcPowerSupplyCounter++
        const id = addDCPowerSupply(Number(element.x_position) + 5*(pasteCounter+1), Number(element.y_position) + 5*(pasteCounter+1), Number(element.rotation), `${_dcPowerSupplyCounter}`)
        pastedElementIds.push(id);
      } else if (element.element_type === "capacitor") {
        _capacitorCounter++
        const id = addCapacitor(Number(element.x_position) + 5*(pasteCounter+1), Number(element.y_position) + 5*(pasteCounter+1), Number(element.rotation), `${_capacitorCounter}`)
        pastedElementIds.push(id);
      } else if (element.element_type === "inductor") {
        _inductorCounter++
        const id = addInductor(Number(element.x_position) + 5*(pasteCounter+1), Number(element.y_position) + 5*(pasteCounter+1), Number(element.rotation), `${_inductorCounter}`)
        pastedElementIds.push(id);
      }
    })

    // コピーした要素をセットし終わったら、カウンターをセットする
    setResistanceCounter(_resistanceCounter);
    setLineCounter(_lineCounter);
    setDcPowerSupplyCounter(_dcPowerSupplyCounter);
    setCapacitorCounter(_capacitorCounter);
    setInductorCounter(_inductorCounter);

    setPasteCounter(prevPasteCounter => prevPasteCounter + 1);

    setSelectedIds(pastedElementIds);
  }

  // 範囲選択を開始する(ステージ上でマウスダウンした時)
  const handleMouseDownOnStage = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;
  
    isSelecting.current = true; // 範囲選択中かどうかをオンにする
    const pos = e.target.getStage()?.getPointerPosition() || {x: 0, y: 0};
    setSelectionRectangle({
      visible: true, // 範囲選択の矩形表示をオンにする
      x1: pos?.x || 0,
      y1: pos?.y || 0,
      x2: pos?.x || 0,
      y2: pos?.y || 0,
    });
  };

  // 範囲選択を行う(ステージ上でマウスムーブした時)
  const handleMouseMoveOnStage = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isSelecting.current) return; // 範囲選択中かどうかをチェック
  
    const pos = e.target.getStage()?.getPointerPosition() || {x: 0, y: 0};
    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x || 0,
      y2: pos.y || 0,
    });
  };

  // 範囲選択を終了する(ステージ上でマウスアップした時)
  const handleMouseUpOnStage = () => {
    if (!isSelecting.current) return; // 範囲選択中かどうかをチェック
    isSelecting.current = false; // 範囲選択中かどうかをオフにする
  
    setSelectionRectangle({ ...selectionRectangle, visible: false }); // 範囲選択の矩形表示をオフにする

    const selBox = { // 範囲選択の矩形の範囲を取得
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };
  
    const selectedElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines].filter(element => { // 範囲選択の矩形と交差する要素を取得
      return Konva.Util.haveIntersection(selBox, element.getClientRect()); // 範囲選択の矩形と要素が交差するかどうかを返す
    });
  
    setSelectedIds(selectedElements.map(element => element.id())); // 選択された要素のidをセット
  };

  return (
    <div className="flex">
      <div className="flex flex-col bg-gray-200 p-2 w-[15%]">
        {/* <Link href="/" className="text-lg text-center mb-4">Draw Circuit</Link> */}
        <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl cursor-pointer text-center mb-4">
          <Link href="/">
            Draw Circuit
          </Link>
        </h1>
        <p className="text-lg font-bold">{project.name}</p>
        <button onClick={() => addResistance()} className="cursor-pointer bg-gray-500 text-white py-1 px-2 my-1 rounded-md hover:bg-gray-600">抵抗を追加</button>
        <button onClick={() => addLine()} className="cursor-pointer bg-gray-500 text-white py-1 px-2 my-1 rounded-md hover:bg-gray-600">線を追加</button>
        <button onClick={() => addDCPowerSupply()} className="cursor-pointer bg-gray-500 text-white py-1 px-2 my-1 rounded-md hover:bg-gray-600">DC電源を追加</button>
        <button onClick={() => addCapacitor()} className="cursor-pointer bg-gray-500 text-white py-1 px-2 my-1 rounded-md hover:bg-gray-600">コンデンサを追加</button>
        <button onClick={() => addInductor()} className="cursor-pointer bg-gray-500 text-white py-1 px-2 my-1 rounded-md hover:bg-gray-600">インダクタを追加</button>
        <button className={`cursor-pointer bg-blue-500 text-white p-2 mt-5 rounded-md hover:bg-blue-600 ${pathname === "/canvas" ? "hidden" : ""}`} onClick={handleSaveClick} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存(Ctrl/⌘ + S)"}
        </button>
        
        {/* <p>Copy data: {JSON.stringify(copiedElementsData)}</p>
        <p>Project data: {JSON.stringify(project.circuit_elements)}</p> */}
      </div>
      {/* <div style={{ position: 'relative' }}> */}
      <div className="flex-1 w-[85%]" style={{ position: 'relative' }}>
        <Stage 
          width={window.innerWidth * 0.85} 
          height={window.innerHeight} 
          onClick={handleStageClick} 
          onMouseDown={handleMouseDownOnStage} 
          onMouseMove={handleMouseMoveOnStage}
          onMouseUp={handleMouseUpOnStage}
        >
          <Layer>
            {resistances.map((resistance, index) => (
              // console.log("レジスタンス:", resistance),
              <ResistanceComponent 
                key={resistance.id()} 
                rect={resistance} 
                isSelected={selectedIds.includes(resistance.id())} 
                onResistanceClick={handleClick} 
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
              />
            ))}
            {lines.map((line) => (
              // console.log("線:", line),
              <LineComponent
                key={line.id()}
                line={line}
                isSelected={selectedIds.includes(line.id())}
                onLineClick={handleClick}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onLineResize={handleLineResize}
                numOfSelectedIds={selectedIds.length}
                isDraggingLineControlPoint={isDraggingLineControlPoint}
              />
            ))}
            {dcPowerSupplies.map((dcPowerSupply) => (
              // console.log("DC電源:", dcPowerSupply),
              <DCPowerSupplyComponent 
                key={dcPowerSupply.id()}
                group={dcPowerSupply}
                isSelected={selectedIds.includes(dcPowerSupply.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onDCPowerSupplyClick={handleClick}
              />
            ))}
            {capacitors.map((capacitor) => (
              // console.log("コンデンサ:", capacitor),
              <CapacitorComponent
                key={capacitor.id()}
                group={capacitor}
                isSelected={selectedIds.includes(capacitor.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onCapacitorClick={handleClick}
              />
            ))}
            {inductors.map((inductor) => (
              // console.log("インダクタ:", inductor),
              <InductorComponent
                key={inductor.id()}
                group={inductor}
                isSelected={selectedIds.includes(inductor.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onInductorClick={handleClick}
              />
            ))}
            {selectionRectangle.visible && ( // 範囲選択中に選択範囲を表示する
              <Rect // 範囲選択の矩形
                x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
                y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
                width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
                height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
                fill="rgba(30,144,255,0.3)"
              />
            )}
          </Layer>
        </Stage>
        
        {/* 選択された要素が1つの場合に回転ボタンを表示 */}
        {/* {selectedIds.length === 1 && (() => { */}
        {selectedIds.length === 1 && !selectedIds[0].includes("line") && (() => {
          const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
          const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
          if (selectedElement) {
            // 要素のサイズを取得（Rect用のwidth/heightまたはGroup用のgetClientRect、Line用の特別処理）
            let elementWidth, elementHeight, elementX, elementY;
            
            if (selectedElement.width) {
              // Rect要素の場合
              elementWidth = selectedElement.width();
              elementHeight = selectedElement.height();
              elementX = selectedElement.x();
              elementY = selectedElement.y();
            } else if (selectedElement.getClientRect) {
              // Group要素の場合
              const rect = selectedElement.getClientRect();
              elementWidth = rect.width;
              elementHeight = rect.height;
              elementX = selectedElement.x();
              elementY = selectedElement.y();
            } else {
              // Line要素の場合は中心座標を使用
              const lineElement = selectedElement as Konva.Line;
              const points = lineElement.points();
              elementWidth = Math.abs(points[2] - points[0]);
              elementHeight = Math.abs(points[3] - points[1]);
              elementX = selectedElement.x(); // 既に中心座標
              elementY = selectedElement.y(); // 既に中心座標
            }
            
              return (
                <button
                  onClick={rotateSelectedElement}
                  style={{
                    position: 'absolute',
                    left: elementX + elementWidth / 2 + 10, // 中心基準での右端に調整
                    top: elementY - elementHeight / 2 - 10, // 中心基準での上端に調整
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 1000,
                  }}
                >
                  ↻ 45°
                </button>
              );
          }
          return null;
        })()}
      </div>
    </div>
  );
}