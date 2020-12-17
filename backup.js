
// 모든 점 노드 중앙에 작은 원 그리기
const smallArcDrawing = (node) => {
  const {x, y} = node;
  const r = 60;
  const {sin, cos} = trigonometric({r, theta: 0});
  const arcX = (cos + x) - r;
  const arcY = sin + y;
  ctx.beginPath();
  ctx.arc(arcX, arcY, r, 0, 360, false);
  ctx.arc(arcX, arcY, 5, 0, 360, false);
  ctx.strokeStyle = 'green';
  ctx.stroke();
  return arcIncluded(gridArcs, {arcX, arcY, arcR: r});
};

// 확장되는 점 노드에만 노드 중앙에 큰 원 그리기
const largeArcDrawing = (node) => {
  const {x, y} = node;
  const r = 100;
  const {sin, cos} = trigonometric({r, theta: 0});
  const arcX = (cos + x) - r;
  const arcY = sin + y;
  
  ctx.beginPath();
  ctx.arc(arcX, arcY, r, 0, 360, false);
  ctx.arc(arcX, arcY, 5, 0, 360, false);
  ctx.strokeStyle = 'red'
  ctx.stroke();
  return arcIncluded(gridArcs, {arcX, arcY, arcR: r});
}
