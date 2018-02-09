
// create web audio api context
//var ctx = new (window.AudioContext || window.webkitAudioContext)();
var ctx = new AudioContext();
// create Oscillator node
var oscillator = null;


var colorFreq = [{'color':'#ec4444','freq':2000,'originalColor':'#bd4444'},{'color':'#33b5e5','freq':3000,'originalColor':'#389abe'},{'color':'#ffcc1b','freq':4000,'originalColor':'#e2b416'},{'color':'#50b830','freq':5000,'originalColor':'#409426'}];

var playInterval = false;
var playerTimeout = false;
var randomNumber = 0;
var listArr = new Array(); // array to save all the chosen mellodies
var userAnswer = new Array(); // arr to save clicked square
var songinc = 0; // increase with each new mellody
var strict = false;
var onOff = false;
var start = false;

$('#on-of').on('click',function(){if(!onOff)onOff = true;else {onOff=false;restart();}});
$('#start').on('click',function(){if(onOff) add();});
$('#strict').on('click',function(){strict = true;});
$('.wrap div').on('click',userTurn);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function add(){
    
    if(onOff){
    randomNumber = getRandomInt(1,4);
    listArr.push(randomNumber);
    re_play();
        
        }
}

function re_play(){
    
    if(!strict){
        playInterval = setInterval(playMellody,700);
    }
    else
        restart();
}

function restart(){
    
    if(playInterval){
        clearInterval(playInterval);
        playInterval = false;
    }
    if(playerTimeout){
        clearTimeout(playerTimeout);
        playerTimeout = false;
    }
    if(oscillator != null){
        oscillator.stop(0);
        oscillator.disconnect(ctx.destination);
        oscillator = null;
    }
    
    listArr = [];
    userAnswer = [];
    songinc = 0;
    if(onOff)
    add();
}

// user press the button
function userTurn(e){
    e.preventDefault;
    if(playInterval == false){
        if(playerTimeout){
            clearTimeout(playerTimeout);
            playerTimeout = setTimeout(re_play,3000);
        }
        
        var pressedKey = $(this).data('key');
        userAnswer.push(pressedKey);
        console.log('Pritisnuo: '+pressedKey);
        console.log('listArr: '+listArr[songinc]);
        console.log('userAnswer: '+userAnswer[songinc]);
        
        
        if(userAnswer[songinc] == listArr[songinc]){
            clearTimeout(playerTimeout);
            playerTimeout = setTimeout(re_play,3000);
            songinc += 1;
        }
        else
            {
                clearTimeout(playerTimeout);
                songinc = 0;
                userAnswer = [];
                re_play();
            }
        
        if(userAnswer.length == listArr.length)
            {
                clearTimeout(playerTimeout);
                songinc = 0;
                userAnswer = [];
                add();
            }
            
    }
        
}

function playMellody(e){
    
    if(oscillator != null)
        {
            oscillator.stop(0);
            oscillator.disconnect(ctx.destination);
            oscillator = null;
            document.getElementById("square"+listArr[songinc-1]).style.backgroundColor = colorFreq[listArr[songinc-1]-1].originalColor; // change color
            if(songinc == listArr.length)
                {
                    songinc = 0;
                    clearInterval(playInterval);
                    playInterval = false;
                    playerTimeout = setTimeout(re_play,6000); 
                }
        }
    else
        {
            oscillator = ctx.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.value = colorFreq[listArr[songinc]-1].freq; // value in hertz
            oscillator.start(0);
            oscillator.connect(ctx.destination);
            console.log(listArr);
            document.getElementById("square"+listArr[songinc]).style.backgroundColor = colorFreq[listArr[songinc]-1].color; // change color
            songinc += 1;
        }
     
}

// create web audio api context
//var ctx = new (window.AudioContext || window.webkitAudioContext)();
var ctx = new AudioContext();
// create Oscillator node
var oscillator = null;



var i = false;
var count = 0;
function moveup(){
   /* if(i == false)
  i =  setInterval(moveup,500);*/
    oscillator = ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 3000; // value in hertz
    oscillator.start(0);
    oscillator.connect(ctx.destination);
    count += 1;
    $('#test').html(''+count);
    
}
function stopMove(){
  /*  if(i)
    clearInterval(i);*/

    count = 0;
    oscillator.stop(0);
    oscillator.disconnect(ctx.destination);
    oscillator = null;
    i = false;
    $('#test').html(''+count);
}