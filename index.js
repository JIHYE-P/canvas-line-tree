import './style.css';

const DEG = Math.PI/180;
const canvas = Object.assign(document.createElement('canvas'), {id: 'canvas'});
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
document.body.append(canvas);

class Node {
  x;
  y;
  name;
  connected = new Set;
  static store = new Set;
  constructor(x, y, name){
    this.x = x;
    this.y = y;
    this.name = name;
    Node.store.add(this);
  }
  connect(node){
    this.connected.add(node);
    node.connected.add(this);
  }
}

// Node 구조 데이터 생성 함수와 노드의 X, Y 좌표 구하는 함수를 분리해야한다.
const extend = (node) => {
  const r = 80;
  const theta = Math.random() * 180;
  const sin = Math.sin(DEG * theta) * r;
  const cos = Math.cos(DEG * theta) * r;
  const nextNode = new Node(cos + node.x, sin + node.y, 'next');
  node.connect(nextNode);
  return {start: node, end: nextNode}
}

const createStruct = (node, length) => {
  let target = node;
  for(let i=0; i<length; i++){
    const {start, end} = extend(target);
    extend(target);
    extend(target);
    extend(target);
    extend(target);
    target = end;
  }
  return node;
}

const createStructLoop = (node, length) => {
  for(let i=0; i<length; i++){
    [...Node.store].forEach(node => extend(node));
  }
  return node;
}

const drawing = (target) => {
  ctx.beginPath();
  ctx.arc(target.x, target.y, 4, 0, 360, false);
  if(target.name === 'start') ctx.fillStyle = 'red';
  else ctx.fillStyle = 'green'
  ctx.fill();

  [...target.connected].forEach((node, i) => {
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();

    ctx.font = '14px Arial';
    ctx.fillText(i, node.x + 10, node.y + 5);
    ctx.fillStyle = '#000';
  });
}

const main = () => {
  const node = createStructLoop(new Node(250, 50, 'start'), 4);
  const drawed = new Set;

  let target;
  const stack = [node];
  while(stack.length){
    target = stack.shift();
    if(drawed.has(target)) continue;
    drawing(target);
    drawed.add(target);
    stack.push(...target.connected);
  }
}
main();

const oneByone = () => {
  const start = new Node(250, 250);
  const end = new Node(0, 0);
  start.connect(end);

  ctx.beginPath();
  ctx.arc(start.x, start.y, 5, 0, 360, false);
  ctx.fillStyle = 'green';
  ctx.fill();

  const r = 60;
  const theta = Math.random() * 360;
  const sin = Math.sin(DEG * theta) * r;
  const cos = Math.cos(DEG * theta) * r;

  end.x = cos + start.x;
  end.y = sin + start.y;
  ctx.beginPath();
  ctx.arc(end.x, end.y, 5, 0, 360, false);
  ctx.fillStyle = 'red';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}