let seriously;
let capture;
let playing = false;
let button;
var eff1;
var eff2;
var w;

let img;
var op;
let col;

var vid;
let src0;
let src1;

function preload() {
  vid = createVideo(['https://video.wixstatic.com/video/0d8a8d_a90420349c3b48239966ea10fdd52480/1080p/mp4/file.mp4']);
  vid.hide();
  img = createImg('https://static.wixstatic.com/media/0d8a8d_e0190c30be1f4cefaf82b80d8edbba1b~mv2.png');
  img.hide();
  }

function setup() {
  
  col = color(255,255,255,0);
  
  createMetaTag();
  button = createButton('LICK<br/>LICK<br/>LICK');
  button.style('background-color',col);
  button.style('border-color',col);
  button.style('font-size', '50px');
  button.style('color', '#f33e07');
  button.position(0,0);
  button.size(window.innerWidth,window.innerHeight);
  button.mousePressed(toggleVid); // attach button listener
  
  let ws = new WebSocket('wss://threelix.onrender.com:443');

  ws.addEventListener('open', (event) => {
    console.log('websocket opened')
  });

  ws.addEventListener('message', (message) => {
    if(message.data == 'ping'){
      ws.send('pong');
      return
    }
    let data = JSON.parse(message.data);
    if('wind' in data){
      let val = data['wind'];
      effect.amount = val/2;
      displacement.mapScale = val/20;
      shake.amplitudeX = val * 5;
    shake.amplitudeY = val * 5;
      shake.rotation = val * 5;
    }
  });

  ws.addEventListener('error', (error) => {
    console.error('websocket closed')
  });

  ws.addEventListener('close', (event) => {
    console.log('websocket closed')
  });
  
  let canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  canvas.id('p5canvas');  
  vid.id('p5video');
  img.id('p5image');
  vid.elt.setAttribute('playsinline', '');
  vid.speed(1);
  
  seriously = new Seriously();
  
  let src0 = seriously.source('#p5image');
  let src1 = seriously.source('#p5video');
  let target = seriously.target('#p5canvas');
  
  op = 1;  
    
  var blender = seriously.effect('blend');
  blender.bottom = src1;
  blender.top = src0;
  blender.opacity = op;
  blender.mode = 'normal';
    
  src = blender;
  
  var effect = seriously.effect('simplex');
  effect.width = 1080;
  effect.height = 1920;
  effect.noiseScale = [5,8];
  
  var displacement = seriously.effect('displacement');
  displacement.map = effect;
  displacement.source = src;
    
  var shake = seriously.transform('camerashake');
  shake.source = displacement;
  shake.frequency = 0.1;
  shake.autoScale = 1;
  shake.preScale = 0;

  target.source = shake;
    
  seriously.go(function (now) {
  shake.time = now / 1000;
  effect.time = now / 10;
  blender.opacity = op;});
}

function draw() {
}

function toggleVid() {
  if (playing) {
    vid.pause();
    button.html('LICK<br/>LICK<br/>LICK');
  } else {
    vid.loop();
    vid.hide();
    button.html('');
    op = 0;
  }
  playing = !playing;
}
  
function createMetaTag() {
  let meta = createElement('meta');
  meta.attribute('name', 'viewport');
  meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');
  let head = select('head');
  meta.parent(head);
}