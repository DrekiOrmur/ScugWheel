//import { defaultWheel } from '.\\wheelConfig.js';

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

//defaultWheel is a global variable defined in wheelConfig.js
let defaultWheelData = loadData(defaultWheel)

// console.log("Did This work?")
// console.log(defaultWheelData)

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
 // 'callbackFinished' : scugSelection,
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
 console.log("I did something")

 resizeImageSegments(theWheel);
 theWheel.startAnimation();

 console.log(theWheel.segments.length)
})


// returns either 'light' or 'dark'
// 'light' if black text has better readability on the given background color
// 'dark' if white text has better readability on the given background color
// https://colorjs.io/docs/contrast#accessible-perceptual-contrast-algorithm-apca


// --- HELPER FUNCTIONS --- //


function loadData(data) {
 // console.log("Its Jason!")
 // console.log(data)

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

 // console.log("I have made jasons")
 // console.log(wheelScug)
 // console.log(wheelBg)

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
 console.log("Im Supposed to spin now")
 clicked = true;

 let stopAngle = calcStop(theWheel.numSegments)

 console.log(stopAngle)

 console.log("Original Animation")
 console.log(theWheel.animation)

 theWheel.animation.spins = 10;
 theWheel.animation.duration = 10;
 theWheel.animation.easing = 'Power3.easeInOut';
 theWheel.animation.type = "spinToStop";
 theWheel.animation.callbackFinished = scugSelection;
 theWheel.animation.stopAngle = stopAngle;
 theWheel.animation.repeat = 0;
 wheelSpinning = true;
 theWheel.startAnimation();

 console.log("Modified Animation")
 console.log(theWheel.animation)
}

function scugSelection()
{
 if(!clicked){
  theWheel.rotationAngle = 0;
  theWheel.startAnimation();
  theWheel.draw(true)
  } else {
   // console.log("Angles")
   // console.log(theWheel)
   // console.log(theWheel.getIndicatedSegment())
   // console.log(theWheel.rotationAngle)
   // console.log(theWheel.animation.stopAngle)
   if (Math.round(Math.floor(Math.random()*10)+1) > 2) {
    console.log("Normal")
    resultSound(1);
   } else {
    console.log("Adjusted")
    //theWheel.rotationAngle = selectionAdjust(theWheel.animation.stopAngle)
    theWheel.rotationAngle = selectionAdjust(theWheel.rotationAngle)
    bgWheel.rotationAngle = theWheel.rotationAngle
    // theWheel.animation.spins = 0;
    // theWheel.animation.duration = 0.5;
    // theWheel.animation.easing = "Power2.easeInOut";
    // theWheel.animation.type = "spinToStop";
    // theWheel.animation.callbackFinished = null;
    // theWheel.animation.stopAngle = stopAngle;
    // theWheel.animation.repeat = 0;
    // wheelSpinning = true;
    // theWheel.startAnimation();

    theWheel.draw(true)
    bgWheel.draw(true)
   }
   console.log("After Troll")
   console.log(theWheel)
   console.log(theWheel.getIndicatedSegment())
   console.log(theWheel.rotationAngle)
   // if (Math.floor(Math.random()*8)+1 > 1) {
   //  resultSound(1);
   // } else {
   //  theWheel.animation.stopAngle = selectionAdjust(theWheel.animation.stopAngle)
   // }

  wheelSpinning = false;
  let chosenScug = (theWheel.getIndicatedSegment()).image.split('\\').pop().slice(0,-4);
  //let scugData = Slugcats.find((element) => element.image.split('\\').pop().slice(0,-4) == chosenScug)
  let scugData = getScugData(chosenScug)
  console.log(scugData)

  document.documentElement.style.setProperty('--scugColor',`${scugData.fillColor}`);
  //let s = document.getElementById("result")
  //s.innerHTML = "Selected Character is " + chosenScug;
  //$(".scugResult").attr("src", scugData.image);

  // let img = document.createElement("img");
  // img.setAttribute("src", scugData.image)
  // s.prepend(img)

  // let image = document.getElementsByClassName("image2");
  // image.src = scugData.image;

  //$(".scugResult").attr("src", scugData.image)

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
  //document.getElementById("result").style.display = "inline-block";
  console.log(chosenScug)
  //alert("Selected Character Is" +)
 }
}

function selectionAdjust(originalStop) {
 let howBad = Math.round(Math.floor(Math.random()*100)+1)
 if(howBad > 10)
 {
  resultSound(2)
  //Random number between 10 and 50 || Math.floor(Math.random() * (max - min + 1)) + min
  //Then either make it negative or positive
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
 //console.log(theWheel.animation)
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

// 45 * num == max degree. subtract 1.

function calcStop(num) {
 let angle = 360/num
 let segment = Math.floor(Math.random()*num)+1
 let a = Math.round(((angle*segment)-1) + (Math.floor((Math.random() * angle)) -1))
 //let a = Math.floor(Math.random()*359)
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
  //Find Segment
  //console.log("ScugSearch")
   //let scugSearch = Slugcats.find((element) => element.image.split('\\').pop() == theWheel.segments[i].imgData.src.split('/').pop())
   //console.log(scugSearch)

   let srcImage = imageProps(theWheel.segments[i].imgData.src)

   //console.log(theWheel.segments[i].imgData.src)

    
   resizeImage(srcImage, wheel.segments[i].imgData, wheel.numSegments)

   // console.log("Modified imgData Data");
   // console.log(wheel.segments[i].imgData);

   //console.log("New Size")
   //console.log(wheel.segments[i].imgData.height)
   //console.log(wheel.segments[i].imgData.width)
 }
}

function resizeImage(srcImage, segmentImage, num) {
 let maxWidth = getMaxWidth(num)
 let maxHeight = 170

 // console.log("Debug")
 // console.log(maxWidth)
 // console.log(srcImage.width)

 if(maxWidth <= srcImage.width && (maxHeight >= (srcImage.height * (maxWidth/srcImage.width))))
 {
   //console.log("Not Wide Enough!")
   segmentImage.width = maxWidth
   segmentImage.height = srcImage.height * (maxWidth/srcImage.width)
 }
 else
 {
   //console.log("Too Wide")
   segmentImage.width = srcImage.width * (maxHeight/srcImage.height)
   segmentImage.height = maxHeight
 }
 //console.log("Image Style")
 //console.log(segmentImage.style)
}

function imageProps(srcImage) {
 origImage = new Image()
 origImage.src = srcImage
 // console.log("Testing Images")
 // console.log(origImage.width)
 // console.log(origImage.height)
 return origImage
}

function getMaxWidth(num){

 const pi = Math.PI;
 let radians = Math.floor(((360/num)*pi/180)*100)
 let w = width/2;
 let h = height/2;
 let radius = h/2
 
 let arcLength = (radians/100)*radius
 
 let arcChord = Math.floor(2*radius*Math.sin(arcLength/(2*radius)))
 
 // console.log("Math Time")
 // console.log(radians)
 // console.log(w)
 // console.log(h)
 // console.log(radius)
 // console.log(arcLength)
 // console.log(arcChord)
 
 return arcChord
 }

 function getScugSegment(segment, name) {
  return segment.imgData.src == name
 }

 function getScugData(scug) {
  return Slugcats.find((element) => element.image.split('\\').pop().slice(0,-4) == scug)
 }
 
 function removeScug(scugName){
  console.log(theWheel.segments)
  // //let scugSearch = Slugcats.find((element) => element.image.split('\\').pop() == theWheel.segments[i].imgData.src.split('/').pop())
  //let scugSearch = theWheel.segments.find((element) => element.image.split('\\').pop().slice(0,-4) == scugName)
  console.log(scugName)
  let scugSearch = theWheel.segments.findIndex(segment => segment != null && segment.imgData.src.split('/').pop().slice(0,-4) == scugName)
  // for(s in theWheel.segments)
  // {
  //  console.log("Loop Shit")
  //  console.log(theWheel.segments)
  // }
  console.log("Remove Segment")
  console.log(scugSearch)

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
  console.log(theWheel.segments)
  // //let scugSearch = Slugcats.find((element) => element.image.split('\\').pop() == theWheel.segments[i].imgData.src.split('/').pop())
  //let scugSearch = theWheel.segments.find((element) => element.image.split('\\').pop().slice(0,-4) == scugName)
  console.log(Slugcats)
  console.log(scugName)
  //let scugSearch = theWheel.segments.findIndex(segment => segment != null && segment.imgData.src.split('/').pop().slice(0,-4) == scugName)
  let scugData = Slugcats.find((element) => element.image.split('\\').pop().slice(0,-4) == scugName)
  console.log("Add Segment")
  //console.log(thing)
  console.log(scugData.image)
  console.log(scugData.fillColor)
  //console.log(scugSearch)

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

 function backgroundBrightness(color) {
  const backgroundColor = new Color(color)
  const blackText = new Color('#000000')
  const whiteText = new Color('#FFFFFF')
 
  const darkContrast = Math.abs(backgroundColor.contrastAPCA(whiteText))
  const lightContrast = Math.abs(backgroundColor.contrastAPCA(blackText))
 
  return darkContrast > lightContrast ? 'dark' : 'light'
 }

// --- UNUSED but I dont wanna remake --- //
//Regex to match segment/original image for scaling on add/remove
//const regEx = new RegExp("[\w-]+\.png");
 

// addEventListener("load", () => {
//  console.log("Original Wheel")
//  console.log(theWheel)
//  console.log(theWheel.segments[8].imgData)
//  console.log(theWheel.segments[8].imgData.src)
//  console.log(Saint.image)

//  //resizeImageSegments(theWheel)

//  console.log("Modified Wheel")
//  console.log(theWheel)

//  //var ctx = document.getElementById("canvas")

//  //console.log(ctx)

// })


// $(document).ready(function(){
//  console.log("I did something")
//  console.log(defaultWheelData)

//  //initWheels();
//  console.log(theWheel.segments)

//  resizeImageSegments(theWheel);
//  //theWheel.draw()
//  theWheel.startAnimation();
// });