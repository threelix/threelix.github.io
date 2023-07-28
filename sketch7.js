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
  vid = createVideo(['https://video.wixstatic.com/video/0d8a8d_2da00668ac3e4a21a84d6c590427715b/1080p/mp4/file.mp4']);
  vid.hide();
  img = createImg('https://static.wixstatic.com/media/0d8a8d_4652f3058e1748869b2c9260c84711c3~mv2.png');
  img.hide();
  }

function setup() {
  
  col = color(255,255,255,0);
  
  createMetaTag();
  button = createButton('LICK<br/>LICK<br/>LICK');
  button.style('background-color',col);
  button.style('border-color',col);
  button.style('font-size', '50px');
  button.style('color', 'pink');
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
      //change-update
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
  //imageMode(CENTER);

  //tint(255, 0);
  //image(img,0,0);
  vid.id('p5video');
  img.id('p5image');
  vid.elt.setAttribute('playsinline', '');
  vid.speed(1);
  
  seriously = new Seriously();
  
  let src0 = seriously.source('#p5image');
  let src1 = seriously.source('#p5video');
  let target = seriously.target('#p5canvas');
  
    /*
  var effect = seriously.effect('tvglitch');
  effect.scanLines = 0;
  effect.source = src;
  target.source = effect;
  */
  
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
  effect.amount = 0.5; //max 2
  //effect.octaves = 1;
  
  var displacement = seriously.effect('displacement');
  displacement.map = effect;
  displacement.mapScale = 0.05;
  
  displacement.source = src;
  //target.source = displacement;
    
  var shake = seriously.transform('camerashake');

			//reformat = seriously.transform('reformat');
			//recenter = seriously.transform('2d');

			// connect all our nodes in the right order
			//reformat.source = '#p5video';
			//reformat.width = 1080;
			//reformat.height = 1920;
			//reformat.mode = 'cover';

			//recenter.source = reformat;
			//recenter.translateY = -80;

			//check if recenter is needed
            //shake.source = recenter;
            shake.source = displacement;
			shake.amplitudeX = 5;
			shake.amplitudeY = 5;
			shake.frequency = 0.1; //max 0.5
			shake.rotation = 5; //max 15
			shake.autoScale = 1;
			shake.preScale = 0;

			target.source = shake;
    
  //seriously.go();
    
    seriously.go(function (now) {
				shake.time = now / 1000;
                effect.time = now / 10;
                blender.opacity = op;
			});
}

function draw() {
  //tint(256,opacity);
  //imageMode(CENTER);
  //image(img,0,0,150*936/448,150);
  //tiempo = time();
  //print(millis());
}

function toggleVid() {
  if (playing) {
    vid.pause();
    button.html('LICK<br/>LICK<br/>LICK');
    //op = 1;
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
