// [x] = WIP
// TODO LIST:
/*
guide visually glitches FIX ME!
Block can rotate outside play area. FIX ME!
*/


// declare globals
let audio="";
let baseSA=5;
let level=0;
let levlobj="";
let goal=10;
let haveGuide=true;
let keyheld=false;
let fps=60;
let gameloop="";
let canvas="";
let ctx="";
let active=false;
let grid=0;
let activepice=""
let score=0;
let timerlen=60;
let peak=9;
let gameOver=false;
let rowDelList=[];
let paused=false;
let doNumDraw=false;
let scoreObj="";
let hold,TD1,TD2,TD3;
let numlist=[];
let curtet=0;
let drawGuide=true;

// draw row/col numbers
function numbDraw(){
    if(doNumDraw){
        for(i=0;i<gamedata.col;i++){
            Text(i+1,i*gamedata.width+(gamedata.width/2),gamedata.height/2,"#000000")
        }
        for(i=0;i<gamedata.row;i++){
            Text(i+1,gamedata.width/2,i*gamedata.height+(gamedata.height/2),"#000000")
        }
    }
}

// canvas data
let gamedata={
    "width":40,
    "height":40,
    "col":10,
    "row":16,
    "offset":2
};
// make the music play
function makeAudio() {
    audio = document.createElement("AUDIO");
    audio.setAttribute("src","./resources/Game Boy Tetris Music A.mp3");
    audio.setAttribute("controls", "controls");
    audio.setAttribute("loop",true);
    audio.setAttribute("autoplay", true);
    document.body.appendChild(audio);
    audio.load();
    audio.play();
    
  }

// entry point
window.onload = ()=>{
    canvas=document.getElementById('canvas');
    hold=document.getElementById('holdCanvas');
    TD1=document.getElementById('TD1');
    TD2=document.getElementById('TD2');
    TD3=document.getElementById('TD3');
    holdCon=new canvasCon(hold);
    TD1Con=new canvasCon(TD1);
    TD2Con=new canvasCon(TD2);
    TD3Con=new canvasCon(TD3);
    ctx=canvas.getContext("2d");
    levlobj=document.getElementById("levelNum");
    canvas.focus();
    scoreObj=document.getElementById('scoreText');
    makeAudio();
    handleInput();
    setup();
    mainloop();
}

function mainloop(){
    clearInterval(gameloop);
    gameloop=setInterval(function () {
        move();
        draw();
    }, 1000/fps);
}

// Setup listeners to handel user input
window.onkeyup=()=>{
        keyheld=false;
    }
function handleInput(){

    window.addEventListener("keydown",e=>{
        // console.log(e);
        switch(e.key){
            case "a":
            case "ArrowLeft":
            case "A":
                if(!paused){
                    activepice.translate(-1);
                }
                break;
            case "d":
            case "ArrowRight":
            case "D":
                if(!paused){
                    activepice.translate(1);
                }
                break;
            case "s":
            case "ArrowDown":
            case "S":
                if(!paused){
                    timer=timerlen;
                }
                break;
        }
        if(keyheld){
            return;
        }
        switch(e.key){
            case "w":
            case "ArrowUp":
            case "W":
                if(!paused){
                    activepice.rotate();
                }
                keyheld=true;
                break;
            case "R":
            case "r":
                setup();
                mainloop();
                keyheld=true;
                break;
            case "G":
            case "g":
                drawGuide=!drawGuide;
                draw();
                keyheld=true;
                break;
            case "N":
            case "n":
                doNumDraw=!doNumDraw;
                draw();
                keyheld=true;
                break;
            case "P":
            case "p":
                paused=!paused;
                if(!paused&&!gameOver){
                    mainloop();
                }
                keyheld=true;
                break;
            case "Shift":
                activateHold();
                keyheld=true;
                break;
            case " ":
                if(doFall){
                    activepice.fAllTheWay();
                }
                keyheld=true;
                break;
        }
    });
}

// assign to globals
function levelUp(){
    level++;
    levlobj.innerHTML=level;
    timerlen-=level;
    if(timer<5){
        timerlen=5;
    }
    goal=(Math.pow(10,(level+1))/2);
}
function setup(){
    paused=false;
    drawGuide=true;
    score=0;
    gameOver=false;
    gamedata.height=canvas.height/gamedata.row;
    gamedata.width=canvas.width/gamedata.col;
    canvas.style=`border-left: black ${gamedata.offset}px solid; border-top: black ${gamedata.offset}px solid; outline: none;`;
    grid = Array(gamedata.col).fill(0).map(()=>Array(gamedata.row).fill(0));
    setnumlist();
    holdCon.setTet(0);
    spawn();
//    lcY=14
//    for (i=0;i<5;i++){
//        grid[0][lcY]=3;
//        grid[1][lcY]=3;
//        grid[2][lcY]=4;
//        grid[3][lcY]=3;
//        grid[5][lcY]=3;
//        grid[6][lcY]=3;
//        grid[7][lcY]=1;
//        grid[8][lcY]=2;
//        grid[9][lcY]=3;
//        lcY--;
//    }
//    grid[2][9]=2;
//    grid[2][8]=4;

}
function setnumlist(){
    x1=Math.floor((Math.random()*7)+1);
    x2=Math.floor((Math.random()*7)+1);
    x3=Math.floor((Math.random()*7)+1);
    if(x1==x2||x1==x3){
        x1=Math.floor((Math.random()*7)+1);
    }
    if(x2==x3||x2==x1){
        x2=Math.floor((Math.random()*7)+1);
    }
    if (x2==x3||x3==x1){
        x3=Math.floor((Math.random()*7)+1);
    }
    numlist.push(x1);
    numlist.push(x2);
    numlist.push(x3);
}
function move() {

    if(timer>=timerlen){
        if(doFall){
        activepice.fall();
        }
        timer=0;
       }
    timer++;
}

// Main render function
function draw() {
    scoreObj.innerHTML=score;
    Box(0,0,canvas.width,canvas.height,"#0f0f0f");
    drawgrid();
    if(drawGuide){
        activepice.updateGuide();
    }
    numbDraw();
    if(gameOver){
        clearInterval(gameloop);
        Text("Game over!", canvas.width/2, canvas.height/2, "#ff6f00", 60);
    }
    if(paused&&!gameOver){
        clearInterval(gameloop);
        Text("Paused!\nPress \"p\" to unpause.", canvas.width/2, canvas.height/2, "#ff6f00", 20);
    }
}

// move rows down if theres a gap
function fallRow(start,times){
    for(x=0;x<times;x++){
        grid.forEach((e)=>{
            for(i=start;i>0;i--){
                e[i]=e[i-1];
            }
        });
        grid[0].forEach(e=>{e=0});
    }
}

// delete the row that was hit
function remRow(y){
    score+=(baseSA+((level+1)*(level+1)));
    for(x=0;x<gamedata.col;x++){grid[x][y]=0;}
    if(score>=goal){
        levelUp();
    }
}

// handle tetramino spawning
function newblock(numb=Math.floor((Math.random()*7)+1)){
    let x = "";
    switch(numb){
        case 1:
            x= new Zblock(Math.round(gamedata.col/2)-1,-1,3)
            break;
        case 2:
            x= new RZblock(Math.round(gamedata.col/2)-1,-1,4)
            break;
        case 3:
            x= new Lblock(Math.round(gamedata.col/2)-1,-1,2)
            break;
        case 4:
            x= new RLblock(Math.round(gamedata.col/2)-1,-1,1)
            break;
        case 5:
            x= new Tblock(Math.round(gamedata.col/2)-1,-1,5)
            break;
        case 6:
            x= new Iblock(Math.round(gamedata.col/2)-1,-1,6)
            break;
        case 7:
            x= new Xblock(Math.round(gamedata.col/2)-1,-1,7)
            break;
    }
    return x;
}
function displayNextTets(){
    xnum=numlist.splice(0,1);
    //console.log(xnum[0])
    ranNumb=Math.floor((Math.random()*7)+1);
    if (ranNumb==numlist[1]){
    ranNumb=Math.floor((Math.random()*7)+1);
    }
    numlist.push(ranNumb);
    TD1Con.setTet(numlist[0]);
    TD2Con.setTet(numlist[1]);
    TD3Con.setTet(numlist[2]);
    return xnum[0];
}
function spawn(){
    if(grid[Math.round(gamedata.col/2)-1][0]!=0){
        gameOver=true;
        return;
    }
    rowDelList.forEach((obj)=>{
        remRow(obj);
    });
    //console.log("rowDelList",rowDelList);
    movDwnAmt = rowDelList.length;
    movDwnFrm = rowDelList.sort((a,b)=>{return b-a})[0];
    fallRow(movDwnFrm,movDwnAmt);
    rowDelList=[];
    doFall=true;
    nextet=displayNextTets();
    activepice=newblock(nextet);
    activepice.tet=nextet;
    timer=0;
}
function activateHold(){
    if(holdCon.tet==0){
        holdCon.setTet(activepice.tet);
        activepice.updateGrid(0);
        spawn();
        return;
    }
    temp=holdCon.tet;
    activepice.updateGrid(0);
    holdCon.setTet(activepice.tet);
    activepice=newblock(temp);
    activepice.tet=temp;
}

// draw the grid
function drawgrid(){
    for(x=0;x<gamedata.col;x++){
        for(y=0;y<gamedata.row;y++){
            fx=x*gamedata.width;
            fy=y*gamedata.height;
            ofs=gamedata.offset
            switch(grid[x][y]){
                case 1:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#1200ff");
                    break;
                case 2:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#ffff00");
                    break;
                case 3:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#00ff00");
                    break;
                case 4:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#ff0000");
                    break;
                case 5:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#cc00cc");
                    break;
                case 6:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#00ffff");
                    break;
                case 7:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#ff8800");
                    break;
                default:
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#333333");
                    break;
            }
        }
    }
}

// rectangle creation function
function Box(x,y,z,e,color="black"){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,z,e);
}

// draw text function
function Text(text,x,y,color="#ffffff",size=10){
    ctx.fillStyle=color;
    ctx.font=(size.toString()+"px Arial");
    ctx.textAlign="center";
    ctx.fillText(text,x,y);
}

// Tetramino class inherited by blocks
class Tetramino {
    constructor(x,y,color=1){
        this.x=x;
        this.y=y;
        this.rotation=0;
        this.color=color;
        this.updateGrid();
        this.countSame=0;
        this.tet=0;
    }
    getXYList(x=this.rotation){

    }
    getYtnb(){
        let list = this.getXYList();
        let minY = gamedata.row;
        let maxY = 0;
        list.forEach(e=>{
            minY=Math.min(e.y,minY);
            maxY=Math.max(e.y,maxY);
        });
        return {"min":minY,"max":maxY};

    }
    rotate(){
        let nextRot=this.rotation+1;
        if (nextRot>3){
                nextRot=0;
        }
        let colission=this.detectCollisionY(0,nextRot);
        //console.log(this.getXYList(nextRot),"\nxylist for rotation.");
        if (colission.length>0){
            //console.log(colission);
            let colission2=this.detectCollisionY(-1,nextRot);
            if (!colission2.length>0){
                //console.log(colission2);

                this.updateGrid(0);
                this.rotation=nextRot;
                this.y--;
                this.updateGrid();
            }
        }else{
            this.updateGrid(0);
            this.rotation=nextRot;
            this.updateGrid();
        }
    }
    translate(dir){
        let update=true;
        let colission=this.detectCollisionX(dir);
        if (colission.length>0){
            update=false;
        }
        if (update){
            this.updateGrid(0);
            this.x+=dir;
            this.updateGrid();
        }
    }
    fall(dir=1){
            let update=true;
            //console.log("falling\n")
            let colission=this.detectCollisionY(dir);
            if (colission.length>0){
                update=false;
            }
            if (update){
                this.updateGrid(0);
                this.y+=dir;
                this.updateGrid();
                this.countSame=0;
            }else{
                this.countSame++;
                if(this.countSame>=1){
                    let y = this.getYtnb();
                    doFall=false;
                    for(let i=y.min;i<=y.max;i++){
                        this.matchTiles(i);
                    }
                    spawn();
                }
            }

    }
    detectCollisionY(dir=1,rot=this.rotation){
        this.updateGrid(0);
        let xyList = this.getXYList(rot);
        let coldetected=[];
        xyList.forEach(item=>{
            if (item.x>=0&&item.x<=gamedata.col-1&&item.y>=0&&item.y<=gamedata.row-1){
                if(item.y+dir>=gamedata.row){
                    coldetected.push({"x":item.x,"y":item.y+dir});
                }else if(grid[item.x][item.y+dir]>0&&grid[item.x][item.y+dir]<8){
                   coldetected.push({"x":item.x,"y":item.y+dir});
               }
            }
        });
        this.updateGrid();
        return coldetected;
    }
    detectCollisionX(dir){
        this.updateGrid(0);
        let xyList = this.getXYList();
        let coldetected=[];
        xyList.forEach(item=>{
            if (item.x>=0&&item.x<=gamedata.col-1&&item.y>=0&&item.y<=gamedata.row-1){
                if(item.x+dir<0||item.x+dir>=gamedata.col){
                    coldetected.push({"x":item.x+dir,"y":item.y});
                }else if(grid[item.x+dir][item.y]>0&&grid[item.x+dir][item.y]<8){
                    coldetected.push({"x":item.x+dir,"y":item.y});
                }
            }
        });
        this.updateGrid();
        return coldetected;
    }
    updateGrid(update=this.color){
        let xyList=this.getXYList();
        xyList.forEach(item=>{
            if (item.x>=0&&item.x<=gamedata.col-1&&item.y>=0&&item.y<=gamedata.row-1){
                grid[item.x][item.y]=update;
            }
        });
    }
    matchTiles(y1){
        let remove=false;
        //console.log("matching tiles att height:",y1)
        let count=0;
        if(y1){
            for(x=0;x<gamedata.col;x++){
                if(grid[x][y1]!=0){
                    count++;
                }
            }
            if (count==gamedata.col){
                rowDelList.push(y1);
            }
        }

    }
    fAllTheWay(){
        let dir=0;
        let fall=true;
        while(fall){
            dir++;
            let colission=this.detectCollisionY(dir);
            if (colission.length>0){
                fall=false;
            }
            if(dir>gamedata.row){
                break;
            }
        }
        if(!fall){
            this.fall(dir-1);
            this.fall();
        }

    }
    getGuideXY(i=0){
        let xyl=this.getXYList();
        let dir=0;
        let brokeout=false;
        let fall=true;
        while(fall){
            dir++;
            let colission=this.detectCollisionY(dir);
            if (colission.length>0){
                fall=false;
            }
            if(dir>gamedata.row){
                brokeout=true;
                fall=false;
            }
        }
        if(!brokeout){
            dir--;
            xyl.forEach((e)=>{e.y+=dir;});
            return xyl;
        } else {
            if(i<2){
                return this.getGuideXY(i+1);
            }
        }


    }
    updateGuide(){
        let xyList=this.getGuideXY();
        xyList.forEach(item=>{
            if (item.x>=0&&item.x<=gamedata.col-1&&item.y>=0&&item.y<=gamedata.row-1){
                if(grid[item.x][item.y]==0){
                    let fx=item.x*gamedata.width;
                    let fy=item.y*gamedata.height;
                    Box(fx,fy,gamedata.width-ofs,gamedata.height-ofs,"#aaaaaa");
                }
            }
        });
    }

}

// classes that inherit Tetramino.
class Zblock extends Tetramino {
     constructor(x,y,color=1){
        super(x,y,color);
     }
    getXYList(x=this.rotation){
        switch(x){
            case 1:
            case 3:
                return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x+1,"y":this.y-1}];
                break;
            default:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x-1,"y":this.y},{"x":this.x+1,"y":this.y+1}];
        }
    }
}

class RZblock extends Tetramino {
     constructor(x,y,color=2){
        super(x,y,color);
     }
    getXYList(x=this.rotation){
        switch(x){
            case 1:
            case 3:
                return [{"x":this.x,"y":this.y},{"x":this.x-1,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x-1,"y":this.y-1}];
                break;
            default:
                return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x-1,"y":this.y+1}];
        }
    }
}

class Lblock extends Tetramino {
     constructor(x,y,color=3){
        super(x,y,color);
     }
     getXYList(x=this.rotation){
        switch(x){
            case 1:
                return [{"x":this.x,"y":this.y},{"x":this.x-1,"y":this.y+1},{"x":this.x+1,"y":this.y},{"x":this.x-1,"y":this.y}];
                break;
            case 2:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x,"y":this.y-1},{"x":this.x-1,"y":this.y-1}];
                break;
            case 3:
                return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y-1},{"x":this.x-1,"y":this.y},{"x":this.x+1,"y":this.y}];
                break;
            default:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y-1},{"x":this.x,"y":this.y+1},{"x":this.x+1,"y":this.y+1}];
        }
    }
}

class RLblock extends Tetramino {
     constructor(x,y,color=4){
        super(x,y,color);
     }
     getXYList(x=this.rotation){
        switch(x){
            case 1:
                return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x-1,"y":this.y},{"x":this.x-1,"y":this.y-1}];
                break;
            case 2:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y-1},{"x":this.x,"y":this.y+1},{"x":this.x+1,"y":this.y-1}];
                break;
            case 3:
                return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x-1,"y":this.y},{"x":this.x+1,"y":this.y+1}];
                break;
            default:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y-1},{"x":this.x,"y":this.y+1},{"x":this.x-1,"y":this.y+1}];
        }
    }
}

class Iblock extends Tetramino {
     constructor(x,y,color=5){
        super(x,y,color);
     }
    getXYList(x=this.rotation){
        switch(x){
            case 1:
            case 3:
                return [{"x":this.x+1,"y":this.y},{"x":this.x+2,"y":this.y},{"x":this.x-1,"y":this.y},{"x":this.x,"y":this.y},]
                break;
            default:
                return [{"x":this.x,"y":this.y+1},{"x":this.x,"y":this.y-1},{"x":this.x,"y":this.y},{"x":this.x,"y":this.y-2},]
        }
    }
}

class Tblock extends Tetramino {
     constructor(x,y,color=6){
        super(x,y,color);
     }
    getXYList(x=this.rotation){
        switch(x){
            case 1:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x-1,"y":this.y},{"x":this.x,"y":this.y-1}];
                break;
            case 2:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y-1},{"x":this.x+1,"y":this.y},{"x":this.x-1,"y":this.y}];
                break;
            case 3:
                return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y+1},{"x":this.x,"y":this.y-1},{"x":this.x+1,"y":this.y}];
                break;
            default:
                return [{"x":this.x,"y":this.y},{"x":this.x-1,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x,"y":this.y+1}];
        }
    }
}

class Xblock extends Tetramino {
     constructor(x,y,color=7){
        super(x,y,color);
     }
    getXYList(x=this.rotation){
        return [{"x":this.x,"y":this.y},{"x":this.x+1,"y":this.y},{"x":this.x+1,"y":this.y+1},{"x":this.x,"y":this.y+1},]

    }
}

// canvas controller
class canvasCon {
    constructor(canvasObj) {
        this.canvas=canvasObj;
        this.context=this.canvas.getContext("2d");
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.canData={
            "width":0,
            "height":0,
            "col":4,
            "row":4,
            "offset":2
        };
        this.canData.height=this.height/this.canData.row;
        this.canData.width=this.width/this.canData.col;
        this.grid=Array(this.canData.col).fill(0).map(()=>Array(this.canData.row).fill(0));
        this.setTet(0);
    }
    Box(x1,y1,x2,y2,c="#000000"){
        this.context.fillStyle=c;
        this.context.fillRect(x1,y1,x2,y2);
    }
    setTet(n=0){
        this.tet=n;
        for(let x=0;x<this.canData.col;x++) {
            for(let y=0;y<this.canData.row;y++) {
                this.grid[x][y]=0;
            }
        }
        /*
        1: zBlock
        2: RzBlock
        3: lBlock
        4: RlBlock
        5: tBlock
        6: iBlock
        7: xBlock
        */
        switch(this.tet){
            case 1:
                this.grid[0][1]=3;
                this.grid[1][1]=3;
                this.grid[1][2]=3;
                this.grid[2][2]=3;
                break;
            case 2:
                this.grid[3][1]=4;
                this.grid[2][1]=4;
                this.grid[2][2]=4;
                this.grid[1][2]=4;
                break;
            case 3:
                this.grid[1][1]=2;
                this.grid[1][2]=2;
                this.grid[1][3]=2;
                this.grid[2][3]=2;
                break;
            case 4:
                this.grid[2][1]=1;
                this.grid[2][2]=1;
                this.grid[2][3]=1;
                this.grid[1][3]=1;
                break;
            case 5:
                this.grid[0][1]=7;
                this.grid[1][1]=7;
                this.grid[1][2]=7;
                this.grid[2][1]=7;
                break;
            case 6:
                this.grid[1][0]=6;
                this.grid[1][1]=6;
                this.grid[1][2]=6;
                this.grid[1][3]=6;
                break;
            case 7:
                this.grid[1][1]=5;
                this.grid[1][2]=5;
                this.grid[2][1]=5;
                this.grid[2][2]=5;
                break;
        }
        this.drawGrid();

    }
    drawGrid(){
        this.Box(0,0,this.width,this.height);
        for(let x=0;x<this.canData.col;x++) {
            for(let y=0;y<this.canData.row;y++) {
                let fx=x*this.canData.width;
                let fy=y*this.canData.height;
                let ofs=this.canData.offset;
                switch(this.grid[x][y]){
                    case 1:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#1200ff")
                        break;
                    case 2:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#ffff00")
                        break;
                    case 3:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#00ff00")
                        break;
                    case 4:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#ff0000")
                        break;
                    case 5:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#ff8800")
                        break;
                    case 6:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#00ffff")
                        break;
                    case 7:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#cc00cc")
                        break;
                    default:
                        this.Box(fx,fy,this.canData.width-ofs,this.canData.height-ofs,"#333333")
                        break;
                }
            }
        }
    }
}

// The standard array for rotation.
// return [{"x":this.x,"y":this.y},{"x":this.x,"y":this.y},{"x":this.x,"y":this.y},{"x":this.x,"y":this.y}];
