
// create web audio api context
//var ctx = new (window.AudioContext || window.webkitAudioContext)();
var ctx = new AudioContext();
var gainNode = ctx.createGain();


// create Oscillator node
var oscillator = null;


var colorFreq = [{'color':'#ff804a','freq':200,'originalColor':'#f49976'},{'color':'#864ef4','freq':250,'originalColor':'#a08acc'},{'color':'#5cf79d','freq':300,'originalColor':'#99d2b1'},{'color':'#f0515c','freq':400,'originalColor':'#d46870'},{'freq':85}];

var vh = 0;
var vw = 0;
var playInterval = false;
var playerTimeout = false;
var randomNumber = 0;
var listArr = new Array(); // array to save all the chosen mellodies
var userAnswer = new Array(); // arr to save clicked square
var songinc = 0; // increase with each new mellody
var strict = false;
var onOff = false;
var start = false;
$('.board div').on('vmousedown',function(e){
    e.preventDefault;
    //determine where to look for pageX by the event type
    if(playInterval == false && start){e = $(e.currentTarget).data('key');playMellody(e);}});
$('.board div').on('vmouseup',userTurn);
$(window).on('resize',clocksize);
var content = $('.content');
var statusjq = $('.status');
var onOffbtn = $('#on-of');
var startbtn = $('#start');
var strictbtn = $('#strict');
var boardDiv = $('.board div');

onOffbtn.on('click',function(){
    if(!onOff){
        onOff = true;
        onOffbtn.addClass('activebtn');
        boardDiv.css('height',content.innerHeight()-statusjq.innerHeight()-150+'px');
        statusjq.css('padding-top','30px');
        statusjq.html('<p>Simon is ready!</p><p>hit the start button</p>');
        

        console.log(statusjq.innerHeight());
    }
    else {
        onOff=false;restart();
        onOffbtn.removeClass('activebtn');
        if(startbtn.hasClass('activebtn'))
        startbtn.removeClass('activebtn');
        if(strictbtn.hasClass('activebtn'))
        strictbtn.removeClass('activebtn');
        boardDiv.css('height','80px');
        statusjq.css('padding-top',(vh-100-50)/2-180);
        statusjq.html('<p>Simon is not ready!</p><p>push the power button</p>');
        console.log(statusjq.innerHeight());
        
    }
});
startbtn.on('click',function(){
    if(!start){
        if(onOff){
        startbtn.addClass('activebtn');
        start = true; 
        statusjq.html('<p>Simon is playing</p><p>listen and memorize</p>');
        add();
        }
    }
    else if(onOff)
    {statusjq.html('<p>Restarting</p><p>listen and memorize</p>');
        restart();
    }
});
strictbtn.on('click',function(){
    if(strict && onOff){
        strictbtn.removeClass('activebtn');
        strict = false;
    }
        
    else if(onOff) {
        strict = true;
        strictbtn.addClass('activebtn');
         }
});



function getRandomInt(min, max) {
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  return  Math.floor((Math.random() * max) + min);
}

function add(){
    
    if(onOff){
    randomNumber = getRandomInt(1,4);
    listArr.push(randomNumber);
        if(playerTimeout)
            playerTimeout = false;
    re_play();
    $('.round').html(listArr.length);    
        
        }
}

function re_play(){
    
    songinc = 0;
    playInterval = setInterval(playMellody,700);
    
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
        oscillator.disconnect(gainNode);
        oscillator = null;
    }
    
    document.getElementById("square1").style.backgroundColor = colorFreq[0].originalColor; // change color
    document.getElementById("square2").style.backgroundColor = colorFreq[1].originalColor; // change color
    document.getElementById("square3").style.backgroundColor = colorFreq[2].originalColor; // change color
    document.getElementById("square4").style.backgroundColor = colorFreq[3].originalColor; // change color
    document.getElementById("square1").style.transform = 'scaleY(1)';
    document.getElementById("square2").style.transform = 'scaleY(1)';
    document.getElementById("square3").style.transform = 'scaleY(1)';
    document.getElementById("square4").style.transform = 'scaleY(1)';

    
    listArr = [];
    userAnswer = [];
    songinc = 0;
    if(onOff)
    add();
    else{
        $('.round').html('--');
        strict = false;
        onOff = false;
        start = false;
    }
}

// user press the button
function userTurn(e){
    e.preventDefault;
    if(playInterval == false && start){
        if(playerTimeout){
            clearTimeout(playerTimeout);
            playerTimeout = setTimeout(re_play,3000);
        }
        
        var pressedKey = $(this).data('key');
        userAnswer.push(pressedKey);
        playMellody(pressedKey);
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
                playInterval = setInterval(errorSound,700);
                statusjq.html('<p>Oops, wrong tune!</p><p>repeat after Simon</p>');
                
            }
        
        if(userAnswer.length == listArr.length)
            {
                clearTimeout(playerTimeout);
                songinc = 0;
                userAnswer = [];
                if(listArr.length == 20){
                    statusjq.html('<p>You won, congrats!</p><p>Simon is restarting</p>');
                    restart();
                }
                else{
                statusjq.html('<p>Simon is playing</p><p>listen and memorize</p>');
                playerTimeout = setTimeout(add,700);
                }
                
                //add();
            }
            
    }
        
}

function errorSound(e){
    if(oscillator != null)
        {
            oscillator.stop(0);
            oscillator.disconnect(gainNode);
            oscillator = null;
            clearInterval(playInterval);
            playInterval = false;
            if(!strict)
                    re_play();
                else
                    restart();
        }
    else
        {
            oscillator = ctx.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.value = colorFreq[4].freq; // value in hertz
            oscillator.start(0);
            oscillator.connect(gainNode);
        }
}

function playMellody(e){
     console.log('ovo je e: '+e);
    
    if(oscillator != null)
        {
            oscillator.stop(0);
            oscillator.disconnect(gainNode);
            oscillator = null;
            
            if(!e){ 
                document.getElementById("square"+listArr[songinc-1]).style.backgroundColor = colorFreq[listArr[songinc-1]-1].originalColor; // change color
                document.getElementById("square"+listArr[songinc-1]).style.transform = 'scaleY(1)'; // change color
            }
            else{
                document.getElementById("square"+e).style.backgroundColor = colorFreq[e-1].originalColor; // change color
                document.getElementById("square"+e).style.transform = 'scaleY(1)';
            }
            
            if(songinc == listArr.length && playInterval)
                {
                    songinc = 0;
                    clearInterval(playInterval);
                    playInterval = false;
                    playerTimeout = setTimeout(re_play,6000);
                    statusjq.html('<p>Your turn</p><p>repeat the melody</p>');
                }
        }
    else
        {
            oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            console.log(listArr);
            if(!e){
                document.getElementById("square"+listArr[songinc]).style.backgroundColor = colorFreq[listArr[songinc]-1].color; // change color
                document.getElementById("square"+listArr[songinc]).style.transform = 'scaleY(1.2)';
                oscillator.frequency.value = colorFreq[listArr[songinc]-1].freq; // value in hertz
                songinc += 1;
                statusjq.html('<p>Simon is playing</p><p>listen and memorize</p>');
            }
            else{
                oscillator.frequency.value = colorFreq[e-1].freq; // value in hertz
                document.getElementById("square"+e).style.backgroundColor = colorFreq[e-1].color; // change color
                document.getElementById("square"+e).style.transform = 'scaleY(1.2)';
            }
            
            
            oscillator.connect(gainNode);
            //oscillator.connect(ctx.destination);
            gainNode.connect(ctx.destination);
            gainNode.gain.value = 0.1;
            console.log(gainNode.gain.value);
            oscillator.start(0);
            
            
        }
     
}
clocksize()
function clocksize(){
    vh = $(window).innerHeight();
    vw = $(window).innerWidth();
    
    if(!onOff)
        {
    content.css('height',vh-100-50);
    statusjq.css('padding-top',(vh-100-50)/2-180);
    console.log(vh);
    
            if(vw<550){
                statusjq.css('padding-top',(vh-170-50)/2-150);
                content.css('height',vh-170-50);
            }
        }
    else {   
    statusjq.css('padding-top','30px');
    content.css('height',vh-100-50);
   
    
        if(vw<550)
            content.css('height',vh-170-50);
        if(vh > 470)
            boardDiv.css('height',content.innerHeight()-statusjq.innerHeight()-150+'px');
        else
            boardDiv.css('height','80px');
            
    }
}
/*// create web audio api context
//var ctx = new (window.AudioContext || window.webkitAudioContext)();
var ctx = new AudioContext();
// create Oscillator node
var oscillator = null;



var i = false;
var count = 0;
function moveup(){

    oscillator = ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 3000; // value in hertz
    oscillator.start(0);
    oscillator.connect(ctx.destination);

    
}
function stopMove(){

    oscillator.stop(0);
    oscillator.disconnect(ctx.destination);
    oscillator = null;

}*/