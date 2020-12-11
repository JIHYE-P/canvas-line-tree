import './style.css';

const size = {w: 500, h: 500}
const canvas = Object.assign(document.createElement('canvas'), {id: 'canvas'});
const ctx = canvas.getContext('2d');
canvas.width = size.w;
canvas.height = size.h;
document.body.appendChild(canvas);

class Node {
  x = 0;
  y = 0;
  connected = new Set;
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  connect(node){
    this.connected.add(node);
    node.connected.add(this);
  }
}

const DEG = Math.PI/180; // 1도
const extend = (node) => {
  const r = 60;
  const theta = Math.random() * 180;
  const sin = Math.sin(DEG*theta) * r; //y
  const cos = Math.cos(DEG*theta) * r; //x
  // 캔버스에 정해진 좌표 근처에(거리는 정하기 나름) 이미 존재하는 좌표가 있는지 확인할 수 있다. (isPointInPath) 불린값
  const nextNode = new Node(cos+node.x, sin+node.y);
  node.connect(nextNode);
  return {start: node, end: nextNode}
}
const createStruct = (node, length) => {
  let target = node;
  for(let i=0; i<length; i++){
    const {start, end} = extend(target);
    target = end;
  }
  return node;
}

const main = () => {
  const s = createStruct(new Node(200, 250), 8);
  const drawed = new Set;
  
  // 재귀로 돌려야함
  let target = s;
  const stack = [s];
  while(target = stack.shift()){
    if(drawed.has(target)) continue;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 5, 0, 360, false);
    ctx.fill();

    target.connected.forEach((node) => {
      ctx.beginPath();
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();
    })
    drawed.add(target);
    stack.push(...target.connected);
  }
}
main();
