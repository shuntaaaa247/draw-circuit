export const generateConnectionLinePoints = (fromX: number, fromY: number, toX: number, toY: number) => {
  const middleX1 = (fromX + toX) / 2;
  const middleY1 = fromY;
  const middleX2 = (fromX + toX) / 2;
  const middleY2 = toY;
  return [fromX, fromY, middleX1, middleY1, middleX2, middleY2, toX, toY];
}