var formEl = document.getElementById('form');
var ChooseUserEl = document.getElementById('choose-user');
var ChooseOpEl = document.getElementById('choose-op');
var ScoreBoardEl = document.getElementById('scoreboard');


var userTeamEl = document.getElementById('user-team');
var opTeamEl = document.getElementById('op-team');
var teamPlayingEl = document.getElementById('team-playing');


var userTeamName;  
var oppTeamName;    
var userChecked;   

var team;   



var bat = ChooseUserEl.getElementsByTagName('button')[0];
var ball = ChooseUserEl.getElementsByTagName('button')[1];

var runsEl = ScoreBoardEl.getElementsByTagName('span')[0];
var remainBallEl = ScoreBoardEl.getElementsByTagName('span')[1];
var targetEl = ScoreBoardEl.getElementsByTagName('span')[2];
var comments = document.getElementById('comments'); 
var startBtnEl = document.getElementById('btn-start');         
var nextBallBtnEl = document.getElementById('next-ball');       
var nextInningBtnEl = document.getElementById('next-inning');   
var reloadPageBtnEl = document.getElementById('reload-btn');   




var userChoice;
var opChoice;


var openner;               
var opennerTeamName;        
var secondInningTeam;      
var secondInningTeamName;   

var target;
var secondInning = false;  




bat.addEventListener('click',function(){
    userChoice = storeUserChoice(this);
    setFirstInning('user',userChoice);
});

ball.addEventListener('click',function(){
    userChoice = storeUserChoice(this);
    
    setFirstInning('user',userChoice);
});


formEl.style.display = 'block'; 

function setEverything(teamName){
    if(secondInning === false){
        
        if(teamName === 'user'){
            opennerTeamName = userTeamName;
            secondInningTeamName = oppTeamName
        }
        else{
            opennerTeamName = oppTeamName;
            secondInningTeamName = userTeamName;
       }    
        
    }    
    if(teamName === 'user'){
        team = new Team(userTeamName);
    }
    else{
        team = new Team(oppTeamName);
    }
    batter = team.players[0];   
    team.players.splice(0,1);   
}


function tossDecided(){
    reset();  
    var rand = Math.floor(Math.random()*2); 
    var choices = ['heads','tails'];       

    userChecked = document.querySelector("input[type='radio']:checked").value;
    userTeamName = userTeamEl.value;
    oppTeamName = opTeamEl.value;
    if(choices[rand] === userChecked){
        ChooseUserEl.style.display = 'block';
        ChooseUserEl.getElementsByTagName('h2')[0].innerText = userTeamName + ' Won the toss';
    }
    else{
        ChooseOpEl.style.display = 'block';
        ChooseOpEl.getElementsByTagName('h2')[0].innerText = oppTeamName + ' Won the toss';        
        setFirstInning('op');      
    }

    return false;
}

function setFirstInning(tossWon,uChoice){
    if(tossWon === 'user'){
        ChooseUserEl.getElementsByTagName('h1')[0].innerText = userTeamName + " Choose to " + uChoice;
        startBtnEl.style.display = 'block';
            if(uChoice.toLowerCase() === 'bat'){
                openner = 'user';
                secondInningTeam = 'opponent';
            }
            else{
                openner = 'opponent';
                secondInningTeam = 'user';
            }
    }

    else{
        var rand = Math.floor(Math.random()*2);
        var choices = ['bat','ball'];
        opChoice = choices[rand];
        ChooseOpEl.getElementsByTagName('h3')[0].innerText = oppTeamName + " Choose to " + opChoice;
        startBtnEl.style.display = 'block';

            if(opChoice === 'bat'){

                openner = 'opponent';
                secondInningTeam = 'user'; 

            }else{
                openner = 'user';
                secondInningTeam = 'opponent'; 

            }      
    }
}
function storeUserChoice(e){
    return e.innerText;
}

function startGame(){
    reset();
    ScoreBoardEl.style.display = 'block';
    runsEl.innerText = 'Total Runs: ' + 0;
    remainBallEl.innerText = 'Remaining Balls: ' + 12;
    comments.innerText = '';
    if(secondInning){
        setEverything(secondInningTeam);
        nextBallBtnEl.style.display = 'block';
    }else{
        setEverything(openner);
    }
    teamPlayingEl.innerText = team.name;
}
function updateBoard(){
    if(team.remainBalls === 0){
        if(secondInning){

           if(team.runs > target){
                comments.innerText = secondInningTeamName + ' Won By ' + (team.players.length + 1) + ' wickets';
    
            }
            else{
                
                comments.innerText = opennerTeamName + ' Won By ' + (target - team.runs) + ' runs';
           
            }
           nextBallBtnEl.style.display = 'none';
            reloadPageBtnEl.style.display = 'inline-block';
            return false;

        }
        else{
            
            target = team.runs + 1;
            comments.innerText = 'Overs End';
            targetEl.innerText = 'Target: ' + target;
            nextBallBtnEl.style.display = 'none';
            nextInningBtnEl.style.display = 'block';
            secondInning = true;
            return false;    
        }
    }
    if(secondInning){
        if(team.runs > target){
            nextBallBtnEl.style.display = 'none';            
            comments.innerText = secondInningTeamName + ' Won By ' + (team.players.length + 1) + ' wickets';
            reloadPageBtnEl.style.display = 'inline-block';            
            return false;   
        }
    }

    var rand = Math.floor(Math.random()*7);
    if(rand === 0){
        console.log('out');
        comments.innerText = batter + ' is out';
        changePlayer();
    }
    else{
        team.runs += rand;
        runsEl.innerText = 'Total Runs: ' + team.runs;
        comments.innerText = batter + ' scores ' + rand;
    }
    team.remainBalls -= 1;
    remainBallEl.innerText = 'Remaining Balls: ' + team.remainBalls;
}
function changePlayer(){
    if(team.players.length === 0){
        comments.innerText = 'All Players Out';
        nextBallBtnEl.style.display = 'none';
        
            if(secondInning){
                comments.innerText = opennerTeamName + ' Won By ' + (target - team.runs) + ' runs';
                reloadPageBtnEl.style.display = 'inline-block';                
                return false;
            }
    
        secondInning = true;   
        target = team.runs + 1;
        targetEl.innerText = 'Target: ' + target;
        nextInningBtnEl.style.display = 'block';
        return false;          

    }

    batter = team.players[0];   
    team.players.splice(0,1);
    comments.innerText += ' New player is ' + batter;
}


function Team(name){
    this.name = name;
    this.players = ['Player no 1','Player no 2','Player no 3','Player no 4','Player no 5','Player no 6'];
    this.totalBalls = 12;
    this.remainBalls = 12;
    this.runs = 0;
}

function reset(){
    formEl.style.display = 'none';
    ChooseUserEl.style.display = 'none';
    ChooseOpEl.style.display = 'none';
    ScoreBoardEl.style.display = 'none';
   startBtnEl.style.display = 'none';
   nextInningBtnEl.style.display = 'none';
    reloadPageBtnEl.style.display = 'none';
}

function reloadPage(){
   window.location.reload();
}





