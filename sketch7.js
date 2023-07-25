let seriously;
let capture;
var slider1;
var slider3;
let playing = false;
let button;
var eff1;
var eff2;
var w;

var vid;

function preload() {
  vid = createVideo(['https://video.wixstatic.com/video/0d8a8d_2da00668ac3e4a21a84d6c590427715b/1080p/mp4/file.mp4']);
  vid.hide();
  }

function setup() {
  
  createMetaTag();
  button = createButton('play');
  button.mousePressed(toggleVid); // attach button listener
  
//Websocket
  let ws = new WebSocket('wss://data-3lix.onrender.com:443');

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
  
  //registerPreloadMethod(createVideo);
  //vid.crossOrigin = "anonymous";
  vid.id('p5video');
  vid.elt.setAttribute('playsinline', '');
  vid.speed(1); //max3
  
  //slider1 = createSlider(0, 0.2, 0, 0.01);
  //slider1.id('effect-slider1');
  //slider3 = createSlider(-3, 3, 0, 0.01);
  //slider3.id('effect-slider3');
  
  seriously = new Seriously();
  
  let src = seriously.source('#p5video');
  let target = seriously.target('#p5canvas');
  
  var effect = seriously.effect('tvglitch');
  //effect.distortion = 1;
  //effect.distortion = '#effect-slider1';
  effect.scanLines = 0;
  //effect.lineSync = 0;
  //effect.lineSync = '#effect-slider3';
  effect.source = src;
  target.source = effect;
  
  seriously.go();
}

function draw() {
  //let img = vid.get();
  //image(img, 0, 0); // redraws the video frame by frame in p5
  //image(vid2,0,0); 
  //poner la letra PNG al abrir la pagina y ocultar / solo la primera vez
  // conectar efecto 1 y 3 con la velocidad del viento
}

function toggleVid() {
  if (playing) {
    vid.pause();
    button.html('play');
  } else {
    vid.loop();
    vid.hide();
    button.html('pause');
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
/*
function windowResized() {
  resizeCanvas((windowHeight-50)*9/16, windowHeight-50);
}
*/