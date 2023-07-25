let seriously;
let capture;
let playing = false;
let button;
var eff1;
var eff2;
var w;

let img;
var opacity;
let col;

var vid;

function preload() {
  vid = createVideo(['https://video.wixstatic.com/video/0d8a8d_a26004307c494ae787960592f71cb1f6/1080p/mp4/file.mp4']);
  vid.hide();
  }

function setup() {
  img = loadImage('https://static.wixstatic.com/media/0d8a8d_a55d36d558eb41dc91e7eb947bfafdec~mv2.png');
  col = color(255,255,255,0);
  
  createMetaTag();
  button = createButton('CLICK');
  button.style('background-color',col);
  button.style('border-color',col);
  button.style('font-size', '0px');
  button.position(window.innerWidth/2,window.innerHeight/2);
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
      effect.distortion = val;
      effect.lineSync = val*2;
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
  vid.elt.setAttribute('playsinline', '');
  vid.speed(1);
  
  seriously = new Seriously();
  
  let src = seriously.source('#p5video');
  let target = seriously.target('#p5canvas');
  
  var effect = seriously.effect('tvglitch');
  effect.scanLines = 0;
  effect.source = src;
  target.source = effect;
  
  seriously.go();
}

function draw() {
  tint(256,opacity);
  image(img, 0, 0);
}

function toggleVid() {
  if (playing) {
    vid.pause();
    button.html('play');
    opacity = 256;
  } else {
    vid.loop();
    vid.hide();
    button.html('pause');
    opacity = 0;
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