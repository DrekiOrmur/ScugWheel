
let width = "800";
let height = "800";
let clicked = false;

let wheelSpinning = false;

const Spearmaster = {
 image: '.\\Scugs\\Spearmaster.png',
 fillColor: '#61267a',
 rotate: true,
};
const Artificer = {
 image: '.\\Scugs\\Artificer.png',
 fillColor: '#761000',
 rotate: true,
};
const Hunter = {
 image: '.\\Scugs\\Hunter.png',
 fillColor: '#cd6d9b',
 rotate: true,
};
const Gourmand = {
 image: '.\\Scugs\\Gourmand.png',
 fillColor: '#ffd7ab',
 rotate: true,
};
const Survivor = {
 image: '.\\Scugs\\Survivor.png',
 fillColor: '#000000',
 rotate: true,
};
const Monk = {
 image: '.\\Scugs\\Monk.png',
 fillColor: '#ffe669',
 rotate: true,
};
const Rivulet = {
 image: '.\\Scugs\\Rivulet.png',
 fillColor: '#92c5d5',
 rotate: true,
};
const Saint = {
 image: '.\\Scugs\\Saint.png',
 fillColor: '#69bf5a',
 rotate: false,
};
const Watcher = {
 image: '.\\Scugs\\Watcher.png',
 fillColor: '#8F94C1',
 rotate: true,
};
const Slugpup = {
 image: '.\\Scugs\\Slugpup.png',
 fillColor: '#91637E',
 rotate: true,
};
const Inv = {
 image: '.\\Scugs\\Inv.png',
 fillColor: '#B1FDFA',
 rotate: true,
};

const Slugcats = [
 Spearmaster,
 Artificer,
 Hunter,
 Gourmand,
 Survivor,
 Monk,
 Rivulet,
 Saint,
 Watcher,
 Slugpup,
 Inv
]

let defaultWheelData = loadData(defaultWheel)

let bgWheel = new Winwheel({
 'canvasId':'bg',
 'numSegments':defaultWheelData.defaultBgWheel.length,
 'lineWidth':3,
 'innerRadius':200,
 'segments' : defaultWheelData.defaultBgWheel,
 'animation' : {
  'type': 'spinOngoing',
  'duration' : 20
 }
});

let theWheel = new Winwheel({
 'canvasId':'canvas',
 'numSegments':defaultWheelData.defaultScugWheel.length,
 'innerRadius':200,
 'textAlignment':'inner',
 'textMargin': 100,
 'lineWidth':3,
 'pointerAngle': 90,
 'drawMode' : 'segmentImage',
 'segments' : defaultWheelData.defaultScugWheel,
 'animation' : {
  'type': 'spinOngoing',
  'duration' : 100,
  'callbackAfter' : drawBgWheel,
  'soundTrigger' : 'segment',
  'callbackSound' : spinSound
 }
}); 

let audioResult1 = new Audio('.\\Sfx\\Karma_KarmaPitchDiscovery.wav');
let audioResult2 = new Audio('.\\Sfx\\Karma_capBell1.wav');
let audioResult3 = new Audio('.\\Sfx\\Karma_GhostPingBase.wav');
let audioSpin1 = new Audio('.\\Sfx\\Rain_tick.wav');
let audioSpin2 = new Audio('.\\Sfx\\Rain_tock.wav');
let audioSpinState = 0

audioSpin1.volume = 0.7
audioSpin2.volume = 0.7

addEventListener("load", () => {

 resizeImageSegments(theWheel);
 theWheel.startAnimation();

})



// --- HELPER FUNCTIONS --- //


function loadData(data) {

 let wheelScug = []
 let wheelBg = []

 for(let i = 0; i < data.length; i++)
 {
   let s = getScugData(data[i])
   let img = {'image':s.image}
   let fill = {'fillStyle':s.fillColor}
   console.log(s)
   wheelScug.push(img)
   wheelBg.push(fill)
 }
 return {"defaultScugWheel":wheelScug, "defaultBgWheel" :  wheelBg}
}

function spinSound()
{
 if(audioSpinState) {
  audioSpin1.pause();
  audioSpin1.currentTime = 0;
  audioSpin1.play();
  audioSpinState = 0
 } else {
  audioSpin2.pause();
  audioSpin2.currentTime = 0;
  audioSpin2.play();
  audioSpinState = 1
 }
}


function resultSound(sound)
{
 if(sound == 1)
 {  
   audioResult1.pause();
   audioResult1.currentTime = 0;
   audioResult1.play();
  } else if (sound == 2) {
   audioResult2.pause();
   audioResult2.currentTime = 0;
   audioResult2.play();
 } else if ( sound == 3) {
   audioResult3.pause();
   audioResult3.currentTime = 0;
   audioResult3.play();
 }
}


function spinWheel()
{
 clicked = true;

 let stopAngle = calcStop(theWheel.numSegments)

 theWheel.animation.spins = 10;
 theWheel.animation.duration = 10;
 theWheel.animation.easing = 'Power3.easeInOut';
 theWheel.animation.type = "spinToStop";
 theWheel.animation.callbackFinished = scugSelection;
 theWheel.animation.stopAngle = stopAngle;
 theWheel.animation.repeat = 0;
 wheelSpinning = true;
 theWheel.startAnimation();

}

function scugSelection()
{
 if(!clicked){
  theWheel.rotationAngle = 0;
  theWheel.startAnimation();
  theWheel.draw(true)
  } else {
   if (Math.round(Math.floor(Math.random()*10)+1) > 2) {
    resultSound(1);
   } else {
    theWheel.rotationAngle = selectionAdjust(theWheel.rotationAngle)
    bgWheel.rotationAngle = theWheel.rotationAngle

    theWheel.draw(true)
    bgWheel.draw(true)
   }

  wheelSpinning = false;
  let chosenScug = (theWheel.getIndicatedSegment()).image.split('\\').pop().slice(0,-4);
  let scugData = getScugData(chosenScug)
  console.log(scugData)

  document.documentElement.style.setProperty('--scugColor',`${scugData.fillColor}`);


  if(backgroundBrightness(scugData.fillColor) == 'light')
  {
   document.getElementById("resultText").classList.add("textDark")
  } else {document.getElementById("resultText").classList.add("textLight")}

  document.getElementById("scugResult").src = scugData.image

  if(scugData.rotate){
   document.getElementById("scugResult").style.transform = 'rotate(90deg)'
  } else {document.getElementById("scugResult").style.transform = 'rotate(0deg)'}

  document.getElementById("resultText").innerHTML = "Selected Character is <br/>" + chosenScug
  
  document.getElementById("pointer").style.top = "-55px"
  document.getElementById("overlay").style.display = "block";
  document.getElementById("result").style.display = "flex";
  document.getElementById("wheel").removeAttribute("onclick");
 }
}

function selectionAdjust(originalStop) {
 let howBad = Math.round(Math.floor(Math.random()*100)+1)
 if(howBad > 10)
 {
  resultSound(2)
  let offset = Math.round(Math.floor((Math.random()*41)+10))
  return originalStop + (Math.random() < 0.5 ? -offset : offset)
 } else
 {
  resultSound(3)
  return -originalStop
 }
}

function closeResult() {
 document.getElementById("pointer").style.top = "350px"
 document.getElementById("overlay").style.display = "none";
 document.getElementById("result").style.display = "none";
 document.getElementById("resultText").classList.remove("textLight", "textDark");
}

function resetSpin()
{
 theWheel.animation.spins = 5;
 theWheel.animation.duration = 200;
 theWheel.animation.easing = null;
 theWheel.animation.rotationAngle = 0;
 theWheel.animation.type = "spinOngoing";
 theWheel.animation.stopAngle = null;
 theWheel.animation.repeat = 1;
 
 theWheel.rotationAngle = 0;
 theWheel.startAnimation();
 theWheel.draw(true)
 document.getElementById("wheel").setAttribute('onclick', "spinWheel()");
 clicked = false;
}

function calcStop(num) {
 let angle = 360/num
 let segment = Math.floor(Math.random()*num)+1
 let a = Math.round(((angle*segment)-1) + (Math.floor((Math.random() * angle)) -1))

 return a
}

function drawBgWheel () {
 bgWheel.rotationAngle = theWheel.rotationAngle;
 bgWheel.draw(false);
}

function resizeImageSegments(wheel) {
 console.log(wheel.numSegments);

 for(var i=1; i <= wheel.numSegments; i++)
 {
   let srcImage = imageProps(theWheel.segments[i].imgData.src)

   resizeImage(srcImage, wheel.segments[i].imgData, wheel.numSegments)
 }
}

function resizeImage(srcImage, segmentImage, num) {
 let maxWidth = getMaxWidth(num)
 let maxHeight = 170

 if(maxWidth <= srcImage.width && (maxHeight >= (srcImage.height * (maxWidth/srcImage.width))))
 {
   segmentImage.width = maxWidth
   segmentImage.height = srcImage.height * (maxWidth/srcImage.width)
 }
 else
 {
   segmentImage.width = srcImage.width * (maxHeight/srcImage.height)
   segmentImage.height = maxHeight
 }
}

function imageProps(srcImage) {
 origImage = new Image()
 origImage.src = srcImage

 return origImage
}

function getMaxWidth(num){
 //I can't believe I tricked myself into trig

 const pi = Math.PI;
 let radians = Math.floor(((360/num)*pi/180)*100)
 let w = width/2;
 let h = height/2;
 let radius = h/2
 
 let arcLength = (radians/100)*radius
 
 let arcChord = Math.floor(2*radius*Math.sin(arcLength/(2*radius)))
  
 return arcChord
 }

 function getScugSegment(segment, name) {
  return segment.imgData.src == name
 }

 function getScugData(scug) {
  return Slugcats.find((element) => element.image.split('\\').pop().slice(0,-4) == scug)
 }
 
 function removeScug(scugName){
  
  let scugSearch = theWheel.segments.findIndex(segment => segment != null && segment.imgData.src.split('/').pop().slice(0,-4) == scugName)

  if(scugSearch > 0)
  {
   theWheel.deleteSegment(scugSearch)
   bgWheel.deleteSegment(scugSearch)
   resizeImageSegments(theWheel)
 
   console.log(theWheel)
  
   theWheel.draw()
   bgWheel.draw()
  }
 }

 function addScug(scugName){
  let scugData = Slugcats.find((element) => element.image.split('\\').pop().slice(0,-4) == scugName)
  let newWheelSegment = theWheel.addSegment()
  let bgWheelSegment = bgWheel.addSegment()

  newWheelSegment.image = scugData.image
  newWheelSegment.imgData = new Image();
  newWheelSegment.imgData.onload = winwheelLoadedImage;
  newWheelSegment.imgData.src = newWheelSegment.image

  bgWheelSegment.fillStyle = scugData.fillColor

  resizeImageSegments(theWheel)

  console.log(theWheel)
 
  theWheel.draw()
  bgWheel.draw()
 }

// returns either 'light' or 'dark'
// 'light' if black text has better readability on the given background color
// 'dark' if white text has better readability on the given background color
// https://colorjs.io/docs/contrast#accessible-perceptual-contrast-algorithm-apca
 function backgroundBrightness(color) {
  const backgroundColor = new Color(color)
  const blackText = new Color('#000000')
  const whiteText = new Color('#FFFFFF')
 
  const darkContrast = Math.abs(backgroundColor.contrastAPCA(whiteText))
  const lightContrast = Math.abs(backgroundColor.contrastAPCA(blackText))
 
  return darkContrast > lightContrast ? 'dark' : 'light'
 }
