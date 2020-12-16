import './style.css';

const canvas = Object.assign(document.createElement('canvas'), {id: 'canvas'});
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;
document.body.appendChild(canvas);

const DEG = Math.PI/180;
const trigonometric = ({r, theta}) => ({cos: Math.cos(DEG*theta)*r, sin: Math.sin(DEG*theta)*r});

class Node {
  x;
  y;
  connected = new Set;
  static store = new Set; // static 클래스의 인스턴스가 아닌 클래스 이름으로 호출한다. 따라서 클래스의 인스턴스를 생성하지 않아도 호출할 수 있다.
  constructor(x, y){
    this.x = x;
    this.y = y; 
    Node.store.add(this);
    // console.log([...Node.store].length);
  }
  connect(node){
    this.connected.add(node);
    node.connected.add(this);
  }
}

// 길이만큼 배열 만들기
const array = (length, value) => Array.from({length}, () => value);

// 정수 랜덤으로 하나 만드는거 rand 10을 넣으면 1~10 랜덤으로 나오는 함수
const rand = num => Math.floor(Math.random() * num);

// 배열에서 아이템 요소를 하나 랜덤으로 뽑는 함수
const randItem = (array) => array[rand(array.length)];

// 값의 범위를 넣으면 0에서 10까지 하면 0~9에서 랜덤으로 하나의 정수 / 3에서 8까지 하면 3~7에서 랜덤으로 하나의 정수만 나오는 함수
const randRange = (from, to) => {
  const array = Array.from({length: to - from}, (_, i) => from + i);
  return randItem(array);
}

// 배열에서 랜덤으로 정한 사이즈만큼 아이템들 뽑아내기 (리턴값 배열)
const randItemBySize = (array, size) => {
  const clone = [...array];
  return Array.from({length: size}, () => clone.splice(rand(clone.length), 1)[0]);
}

// 노드 확장 시키기 
const extend = (node) => {
  const {sin, cos} = trigonometric({r: 100, theta: Math.random() * 180});
  const nextNode = new Node(node.x + cos, node.y + sin);
  const included = extendArcDrawing(node);
  gridIncludeFill(grid, included);
  node.connect(nextNode);
  return {start: node, end: nextNode}
}

// 노드 데이터 구조 생성
const createStruct = (node, length) => {
  for(let i=0; i<length; i++){
    // [...Node.store].forEach(node => extend(node));
    // 전체노드에서 랜덤으로 개수를 뽑아서 확장 시키기
    // 4개 중에 일부를.. 전체노드가 항상 4개니까 일부가 아니니까 1~4에서 랜덤으로 예를들어 3이 나오면 전체노드에서 3개를 뽑아서 확장
    const total = [...Node.store].length + 1;
    const range = randRange(1, Math.ceil(total/3)+1);
    const nodeBySize = randItemBySize([...Node.store], range);
    nodeBySize.forEach(node => extend(node));
  }
  return node;
}

// 노드 x,y 좌표값 점 그리기
const drawing = target => {
  ctx.beginPath();
  ctx.arc(target.x, target.y, 3, 0, 360, false);
  ctx.fill();
  [...target.connected].forEach(node => {
    // ctx.beginPath();
    // ctx.moveTo(target.x, target.y);
    // ctx.lineTo(node.x, node.y);
    // ctx.strokeStyle = '#000';
    // ctx.stroke();
  });
}

const setGridArray = (length) => Array.from({length}, () => 0).map((value, i) => (i % 6 === 0) ? 1 : value);
const setGridPosition = (array, length) => array.map((_, i) => ({x: i%length, y: Math.floor(i/length)}));
const setGridActivePosition = (array, length) => array.map((value, i) => (value === 1) && ({x: i%length, y: Math.floor(i/length)})).filter(value => value);
// 캔버스에 그리드 그리기
const gridDraw = (column, row) => {
  const {width: w, height: h} = canvas.getBoundingClientRect();
  const sizeX = w/column;
  const sizeY = h/row;
  ctx.beginPath();
  for(let x = 0; x <= w; x += sizeX){
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for(let y = 0; y <= h; y += sizeY){
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.strokeStyle = '#000'
  ctx.stroke();
  return {w: sizeX, h: sizeY, length: column*row};
}

// 큰 원안에 들어와있는 점 그리드 색칠하기
const gridIncludeFill = (grid, included) => {
  // console.log(grid, included)
  const {w, h} = grid;
  included.forEach(({x, y}) => {
    ctx.beginPath();
    ctx.strokeStyle = 'blue'
    ctx.rect(x + w, y + h, w, h);
    ctx.stroke();
  });
}

// 캔버스에 그려진 각 그리드 중앙에 원 그리기
const gridArcDrawing = (grid, column) => {
  const {w, h, length} = grid;
  const gridPosition = setGridPosition(array(length, 0), column);
  gridPosition.forEach(({x, y}) => {
    const cos = Math.cos(DEG*0) * (w/2);
    const sin = Math.sin(DEG*0) * (h/2);
    const arcX = (x*w) + cos;
    const arcY = ((y*h) + sin) + (h/2);
    ctx.beginPath();
    ctx.arc(arcX, arcY, 1, 0, 360, false);
    ctx.fill();
    gridArcs.push({x: arcX, y: arcY});
  });
}

const column = 20;
const row = 20;
const gridArcs = [];
const grid = gridDraw(column, row);
gridArcDrawing(grid, column);

// 모든 점 노드 중앙에 작은 원 그리기
const smallArcDrawing = (nodes) => {
  ctx.beginPath();
  nodes.forEach(node => {
    const {x, y} = node;
    const r = 60;
    const {sin, cos} = trigonometric({r, theta: 0});
    ctx.arc((cos + x) - r, (sin + y), r, 0, 360, false);
    ctx.strokeStyle = 'green'
    ctx.stroke();
  });
};

// 확장되는 점 노드에만 노드 중앙에 큰 원 그리기
const extendArcDrawing = (node) => {
  const {x, y} = node;
  const r = 100;
  const {sin, cos} = trigonometric({r, theta: 0});
  const arcX = (cos + x) - r;
  const arcY = sin + y;
  ctx.beginPath();
  ctx.arc(arcX, arcY, r, 0, 360, false);
  ctx.strokeStyle = 'red'
  ctx.stroke();
  return extendArcIncluded(gridArcs, {arcX, arcY, arcR: r});
}

// 확장된 점에 그려진 큰 원안에 들어가있는 점들의 좌표만 구하기
const extendArcIncluded = (gridArcs, arc) => {
  const {arcX, arcY, arcR} = arc; // 큰 원 X, Y 좌표값
  // const left = arcX - (arcR) - x4;
  // const right = arcX + (arcR) + x3;
  // const top = arcY - (arcR) - y3;
  // const bottom = arcY + (arcR) + y4;

  const included = gridArcs.map(({x, y}) => {
    return (x > left && x < right && y > top && y < bottom) ? ({x, y}) : false;
  }).filter(value => value);

  return included;
}

const main = () => {
  const node = createStruct(new Node(250,150), 1); 
  let target;
  const stack = [node];
  const drawed = new Set;
  
  while(stack.length){
    target = stack.shift();
    if(drawed.has(target)) continue;
    drawing(target);
    drawed.add(target);
    stack.push(...target.connected);
  }
  smallArcDrawing([...Node.store]);
}
main();

//제곱근 (ex 길이가 5이면 2x2x2x2x2 = 32개 점 생성, 7개면 128개)

window.onclick = ({clientX, clientY, target}) => {
  if(target !== canvas) return;
  const {x, y} = canvas.getBoundingClientRect();
  console.log(ctx.isPointInPath(clientX - x, clientY - y), clientX - x, clientY - y);
}

// 그리드에 가운데 찍은 점 좌표들을 구하면 [[x, y]...] 형태로 그리드 사이즈만큼 있으면 map이나 filter을 걸어서 큰 원 안에 들어가있는 점들의 좌표들을 구한다.
// extend 함수에 들어온 노드 점만 큰 원을 그려야한다 (모든 노드가 아님) 
// 전체 노드 store 에 대해서 작은 원을 그린다.  작은 원에 들어와있는 그리드 점들의 좌표들만 구한다.
// 위까지 실행하면 배열이 2개가 생기는데, 작은 원에 들어오는 점ㅇ들은 그리면 겹치는 점들, 큰 원안에 들어와있는 점들은 겹치지 않은 원
// 큰 원에서 구한 점들의 배열에서 작은 원에서 구한 점들의 배열에서 서로 겹치는 점들을 빼고 나머지 배열에서 랜덤으로 한개를 뽑아서 점을 확장시킨다 (nextNode)