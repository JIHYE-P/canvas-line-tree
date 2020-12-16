import './style.css';

const canvas = Object.assign(document.createElement('canvas'), {id: 'canvas'});
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const DEG = Math.PI/180;

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
const extend = (node) => {
  const r = 100;
  const theta = Math.random() * 180;
  const sin = Math.sin(DEG * theta) * r;
  const cos = Math.cos(DEG * theta) * r;
  const nextNode = new Node(node.x + cos, node.y + sin);
  node.connect(nextNode);
  return {start: node, end: nextNode}
}

// 함수1. 정수 랜덤으로 하나 만드는거 rand 10을 넣으면 1~10 랜덤으로 나오는 함수
const rand = num => Math.floor(Math.random() * num);
// 함수3. 배열에서 아이템 요소를 하나 랜덤으로 뽑는 함수
const randItem = (array) => array[rand(array.length)];
// 함수2. 값의 범위를 넣으면 0에서 10까지 하면 0~9에서 랜덤으로 하나의 정수 / 3에서 8까지 하면 3~7에서 랜덤으로 하나의 정수만 나오는 함수
const randRange = (from, to) => {
  const array = Array.from({length: to - from}, (_, i) => from + i);
  return randItem(array);
}
const randItemBySize = (array, size) => {
  const clone = [...array];
  return Array.from({length: size}, () => clone.splice(rand(clone.length), 1)[0]);
}
const createStruct2 = (node, length) => {
  for(let i=0; i<length; i++){
    // [...Node.store].forEach(node => extend(node));
    //전체노드에서 랜덤으로 개수를 뽑아서 확장 시키기
    //4개 중에 일부를.. 전체노드가 항상 4개니까 일부가 아니니까 1~4에서 랜덤으로 예를들어 3이 나오면 전체노드에서 3개를 뽑아서 확장
    const total = [...Node.store].length + 1;
    const range = randRange(1, Math.ceil(total/3)+1);
    const nodeBySize = randItemBySize([...Node.store], range);
    nodeBySize.forEach(node => extend(node));
  }
  return node;
}
const createStruct = (node, length) => {
  let target = node;
  for(let i=0; i<length; i++){
    const {start, end} = extend(target);
    extend(target);
    extend(target);
    target = end;
  }
  return node;
}
const drawing = target => {
  ctx.beginPath();
  ctx.arc(target.x, target.y, 3, 0, 360, false);
  ctx.fill();
  [...target.connected].forEach(node => {
    ctx.beginPath();
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(node.x, node.y);
    ctx.stroke();
  });
}

const main = () => {
  const node = createStruct2(new Node(250,50), 5); //제곱근 (ex 길이가 5이면 2x2x2x2x2 = 32개 점 생성, 7개면 128개)
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
}
main();

// 캔버스 그리드 그리기
// 그리드 개수만큼의 배열을 만들어서 (값은 0) 일부 아이템만 1로 바꾸고 1로 되어있는 부분을 색칠하기
const gridArray = (length) => {
  const array = Array.from({length}, () => 0);
  return array.map((value, i) => (i % 4 === 0) ? 1 : value);
};

const gridPosition = (array, length) => {
  const clone = [...array];
  return clone.map((value, i) => (value === 1) && ({x: i%length, y: Math.floor(i/length)})).filter(value => value);
}

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
  ctx.stroke();
  return {sizeX, sizeY};
}

const gridAreaFill = (column, row) => {
  const {sizeX, sizeY} = gridDraw(column, row);
  const gridSize = gridArray(column*row);
  const activeArea = gridPosition(gridSize, column);

  activeArea.forEach(({x, y}) => {
    console.log(x * sizeX, y * sizeY)
    ctx.rect(x * sizeX, y * sizeY, sizeX, sizeY);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
  });
}

gridAreaFill(6, 5);