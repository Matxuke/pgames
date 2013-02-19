
var sprites = {
lady: { sx: 0, sy: 0, w: 45, h: 50, frames: 3 },
plat: { sx: 0, sy: 540, w: 40, h: 10, frames: 7 },
fire: { sx: 0, sy: 550, w: 40, h: 20, frames: 7 },
base: { sx:0, sy:50, w: 320, h:5, frames:1},
ladymap: {sx:-30, sy:-5, w: 30, h:5, frames: 0},
fondo: {sx:0, sy:60, w: 320, h:480, frames: 0},
backcloud: {sx:0, sy:815, w:150, h:110, frames: 3},
retrato: {sx:0, sy:570, w: 210, h:245, frames: 1}
};

var OBJECT_PLAYER = 1,
OBJECT_PLATFORM=2,
OBJECT_TUBE=4,
OBJECT_BASE=8;

var MINI_JUMP=-2,
FULL_JUMP=-8;

//Variables for game
var platforms = [],
	backclouds = [],
	retrato,
	fondue,
	parallaxv=0,
	hanginggardens = [], //registro para almacenar detalles de las plataformas
	platformCount = 10,
	position = 0,
	gravity = 0.2,
	flag = 0,
	broken = 0,
	gap=0,
	dir, score = 0, firstRun = true;

//Draws a sprite in the canvas   ANNONIMOUS FUNCTION
var startGame = function() {	

Game.setBoard(0,new TitleScreen("GRANNY, WHERE WENT YOUR TEETH?", "Press left",playGame));

}

var playGame = function() {
	

	var board = new GameBoard();
	board.add(new Fondue());
	
	createbackclouds(board);
	board.add(new Retrato());
	
	board.add(new Player());
	createplatforms(board);
	
	
	
	

	board.add(new Base());
	
	
	Game.setBoard(0,board);
	Game.ctx[4].clearRect(0,0,320,480);
	fondue.init();
}

window.addEventListener("load", function() {
Game.initialize("game",sprites,startGame);
});

var Base = function() {
	this.setup('base', {static:1});
	this.x = 0;
	
	this.y = Game.height - this.h;
	
	this.canvasid=3;
	
	
	
	

};
Base.prototype = new Sprite();
Base.prototype.type = OBJECT_BASE;
Base.prototype.step = function(dt) {};

var Fondue = function() {
	fondue=this;
	this.setup('fondo', {static:1});
	this.x = 0;
	this.canvasid=0;
	
	this.y = 0;
	
	this.init=function(){
		this.draw(Game.ctx[this.canvasid]);
		this.drawflag=true;
		this.clearing=false;
	};
	
	

};
Fondue.prototype = new Sprite();
Fondue.prototype.step = function(dt) {
	};

var Retrato = function() {
	retrato=this;
	this.setup('retrato');
	this.x = 0;
	this.y =-245;
	this.drawflag=true;
	this.parallaxy=0;
	this.canvasid=1;
	
	

};
Retrato.prototype = new Sprite();
Retrato.prototype.step = function(dt) {
	
	if(this.drawflag==false){
					
					this.y -= parallaxv/3;
					
	}
	
	if((score%500)==0 && score>=500 && this.drawflag==true) {
		this.drawflag=false;
		this.frame=Math.floor(Math.random()*2);
		this.x=Math.random() * (Game.width - this.w);
		this.x = (0.5 + this.x) << 0;
		//console.log(this.drawflag, "-------", this.x, ",",this.y);
	}
	
	if(this.drawflag==false && this.y>Game.height){
		this.drawflag=true;
		this.y= -245;
	}
		 
	
};

var Backcloud = function() {
	this.setup('backcloud');
	this.scale=0.5;
	this.canvasid=1;
	
	

};
Backcloud.prototype = new Sprite();
Backcloud.prototype.step = function(dt) {
	
	this.y -= parallaxv/6;
	if(this.drawing==true){
					
					
					this.x+=0.1;
					if(this.x>Game.width)this.x=-150;
					if(this.y>Game.height){
						this.drawing=false;
						this.y = Math.floor(Math.random()*Game.height)-Game.height-110;
						this.x = Math.floor(Math.random()*Game.width-38);
						this.frame = Math.floor(Math.random()*4);
						
					}
					
	}
	else if(this.y>-110){
		this.drawing=true;
		
	}
	
	if((score%500)==0 && score>=500 && this.drawing==false) {
		this.drawing=true;
		this.frame=Math.floor(Math.random()*2);
		this.x=Math.random() * (Game.width - this.w);
		this.x = (0.5 + this.x) << 0;
		//console.log(this.drawflag, "-------", this.x, ",",this.y);
	}
	
	if(this.drawing==true && this.y>Game.height){
		this.drawing=false;
		this.y= -245;
	}
	
	
	
};



var Player = function() {
	var pyr=this;
	this.setup('lady', {vx: 0, vy:11, frame: 0, anim_cnt: 1, maxVel: 200});
	
	this.x = Game.width/2 - this.w / 2;
	this.y = Game.height-100;
	this.y=440;
	this.canvasid=3;
	
	var mx=0;
	
	var my=0;
	var mw=0;
	var mh=0;
	
	
	
	pyr.isMovingLeft = false;
	pyr.isMovingRight = false;
	this.isDead = false;

	pyr.dir="right";
	
	
	
	this.lastvel=-1;
	
	var lastUpdateTime = 0;
	var acDelta = 0;
	var msPerFrame = 100;
	
	
	this.step = function(dt) {
		this.maxVel = 100;
		this.step = function(dt) {
			
			document.onkeydown = function(e) {
			var key = e.keyCode;
			
			if (key == 37) {
				pyr.dir = "left";
				pyr.isMovingLeft = true;
				
				
			} else if (key == 39) {
				pyr.dir = "right";
				pyr.isMovingRight = true;
				
			}
			
			
		};

		document.onkeyup = function(e) {
			var key = e.keyCode;
		
			if (key == 37) {
				pyr.dir = "left";
				pyr.isMovingLeft = false;
			} else if (key == 39) {
				pyr.dir = "right";
				pyr.isMovingRight = false;
			}
		};
		
		
			
			
			
			
			
			
			if (pyr.isMovingLeft === true) {
				this.x += this.vx;
				this.vx -= 0.15;
			} else {
				this.x += this.vx;
				if (this.vx < 0) this.vx += 0.1;
			}

			if (pyr.isMovingRight === true) {
				this.x += this.vx;
				this.vx += 0.15;
			} else {
				this.x += this.vx;
				if (this.vx > 0) this.vx -= 0.1;
			}
			
			

			// Speed limits!
			if(this.vx > 8)
				this.vx = 8;
			else if(this.vx < -8)
				this.vx = -8; 
				
			//We don't want to overdraw, so
			
			for (var i = 0; i < platformCount; i++) {
				platforms[i].clearing=false;
				platforms[i].drawing=false;
			}          
		
			
			var collision = this.board.collide(this,OBJECT_BASE);//this
			
			if(collision) {
				
				this.jump(FULL_JUMP);
				
				//console.log("collision!!!");
			}
			else {
				
			}
			
			mx=this.x;
			mw=this.w;
			this.x+= this.w/2-15;
			this.w=30;
			if(this.vy<0){
				collision = this.board.collide(this,OBJECT_PLATFORM);
				if(collision && collision.plattype==5 && collision.drawflag==false) this.vy=0;
			}
			
			
			if(this.vy>0){
				
				my=this.y;
				mh=this.h;
				
				
				
				this.y+= this.h-5;
				this.h=5;
				
				var collision2 = this.board.collide(this,OBJECT_PLATFORM);
				
				
				if(collision2 && collision2.drawflag==false) {
					
					if(collision2.plattype==3){ 
						
						this.jump(MINI_JUMP);
						var k = collision2.whoami;
						platforms[k].drawflag=true;
						platforms[k].clearing=true;
						platforms[k].frame=12;
					}
					else if(collision2.plattype==4){ 
						this.jump(FULL_JUMP);
						var k = collision2.whoami;
						platforms[k].drawflag=true;
						platforms[k].clearing=true;
						platforms[k].frame=12;
					}
					else{
						
						this.jump(FULL_JUMP);
					}
					
				}
				else {
				
				}
				
				this.y=my;
				this.h=mh;
				
			}
			this.x=mx;
			this.w=mw;

			//Gameover if it hits the bottom. NOT IN USE BY NOW 
			if (Base.y > Game.height && (this.y + this.h) > Game.height && this.isDead != "lol") this.isDead = true;

			//Make the player move through walls
			if (this.x > Game.width) this.x = 0 - this.w;
			else if (this.x < 0 - this.w) this.x = Game.width;

			//Movement of player affected by gravity
			if (this.y >= (Game.height / 2) - (this.h / 2)) {
				this.y += this.vy;
				this.vy += gravity;
				parallaxv=0;
				
			}
			else {
					
				for (var i = 0; i < platformCount; i++) {
		
					if (this.vy < 0) {
						platforms[i].y -= this.vy;
					}
					if (platforms[i].y > Game.height) {
						var p = platforms[i].y;
						
						
						
						platforms[i].y = p - Game.height;
						platforms[i].x = Math.random() * (Game.width - platforms[i].w);
						platforms[i].frame = Math.floor(Math.random() * 8);
						platforms[i].asignplatform();
						
						
					}
					platforms[i].clearing=true;
					platforms[i].drawing=true;
				}
				
				parallaxv=this.vy;

				
				this.vy += gravity;

				if (this.vy >= 0) {
					this.y += this.vy;
					this.vy += gravity;
				}

				score++;
				//console.log(score);
			}
			this.animate();
			this.x = (0.5 + this.x) << 0;
			this.y = (0.5 + this.y) << 0;
				

			
			
		
		
		
		}
		this.jump = function(value) {
			
			this.vy = value;
	    };
		
		this.animate = function(){
			
			var delta = Date.now() - this.lastUpdateTime;
			
			
		
			if((this.lastvel>0 && this.vy<0)||(this.lastvel<0 && this.vy>0)|| this.acDelta > 200) {
				this.acDelta = 0;
				if(this.vy<0 && this.dir=="right")this.frame=0;
				if(this.vy<0 && this.dir=="left")this.frame=4;
				if(this.vy>=0 && this.dir=="right")this.frame=2;
				if(this.vy>=0 && this.dir=="left")this.frame=6;
			}
			else{
				this.acDelta += delta;
				if(this.acDelta > 100) {
					if(this.vy<0 && this.dir=="right")this.frame=1;
					if(this.vy<0 && this.dir=="left")this.frame=5;
					if(this.vy>=0 && this.dir=="right")this.frame=3;
					if(this.vy>=0 && this.dir=="left")this.frame=7;
				}
			
			}
			this.lastUpdateTime = Date.now();
			
			this.lastvel=this.vy;
			
				
		
		};
			
		

	}
	
	
}
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;


var Platform = function() {
	
	this.setup('plat');

	this.plattype=1;
	this.x = Math.random() * (Game.width - this.w); //Numero entre 0 y 1. x entre 0 y width-objeto
	this.y = position;
	this.pvx=1;
	
	this.woiam=0;
	
	this.canvasid=2;

	position += (Game.height / platformCount);

	this.flag = 0;
	this.state = 0;
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=100;
	
	
	

	         

	this.asignplatform=function(){
	
		//Platform types
	//1: Normal
	//2: Moving
	//3: Breakable (Go through)
	//4: Vanishable
	//5: Not transparent
	//6: On fire 
	//Setting the probability of which type of platforms should be shown at what score
		if(this.plattype == 6){
			this.setup('plat');
		}
		//console.log(gap==1);
		if(gap==1){
			this.plattype=5;
			gap=0;
			this.drawflag=false;
		}
		else {
			this.drawflag=false;
			if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6];
			else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6];
			else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
			else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,5,5,5];
			else if (score >= 100 && score < 500) this.types = [1,1,1,1 ,2,2];
			else this.types = [1];
			this.plattype = this.types[Math.floor(Math.random() * this.types.length)];
			
			
		
			
			if(this.plattype==5 && gap==0){
			if(broken>0){
				this.plattype=2;
			}
			else{
				
				this.drawflag=true;
				this.drawing=false;
				gap=1;
			
				
			
			}
		
		}
		
		
		}
		if(this.plattype==3) {
			if(broken==2){
				var randomizer = [1, 2, 4, 5, 6];
				this.plattype = randomizer[Math.floor(Math.random() * 4)];
				broken=0;
			}
			else
			{
				broken++;
			}
		}
		else {
			broken=0;
		}
		
		
		if (this.plattype == 1){ 
			this.frame = Math.floor(Math.random() * 5);
			
		}
			
		else if (this.plattype == 2) this.frame = 5;
		else if (this.plattype == 3) this.frame = 6;
		else if (this.plattype == 4) this.frame = 7;
		else if (this.plattype == 5 && gap<1) this.frame = 8;
		else if (this.plattype == 5 && gap>0) this.frame = -1;
		else if (this.plattype ==6){
			//console.log("ESTAMOS EN LA 6!");
			this.setup('fire');
			this.frame=0;
			this.canvasid=2;
			//console.log(this.h);
		}
		else this.frame=1;
		
		this.clearing=false;
		this.drawing=false;
		
			
			
					
		
	
	};
	//console.log(this.plattype);
	this.fireanimate = function(){
			
			var delta = Date.now() - this.lastUpdateTime;
			//console.log(this.acDelta);
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		
			if(this.acDelta > this.msPerFrame) {
				this.acDelta = 0;
				this.frame++;
				console.log("framin':",this.frame);
				if(this.frame>7)this.frame=0;
			}
			else{
				this.acDelta += delta;
			
			}
			this.lastUpdateTime = Date.now();
			//console.log(this.lastvel);
			//console.log(this.vy);
			
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
	};
			



	


	this.moved = 0;
	this.vx = 1;
	
	this.step=function(dt){
		
		if(this.plattype==2){
			this.x += this.pvx;
			if(this.x>=Game.width-this.w/2) this.pvx=-1;
			else if(this.x<=0)this.pvx=1;
			this.clearing=true;
			this.drawing=true;
		}
		
		
		if(this.plattype==6){
			this.fireanimate();
			this.clearing=true;
			this.drawing=true;
		}
		this.x = (0.5 + this.x) << 0;
		this.y = (0.5 + this.y) << 0;
		
		console.log(this.clearing);
		
	
	}
}
Platform.prototype = new Sprite();
Platform.prototype.type = OBJECT_PLATFORM;


function createplatforms(board){
	
	for (var i = 0; i < platformCount; i++) {
		
		platforms.push(new Platform());
		platforms[i].y = 48 * (platformCount-i);
		platforms[i].asignplatform();
		platforms[i].whoami=i;
		board.add(platforms[i]);
	}
}

function createbackclouds(board){
	
	for (var i = 0; i < 10; i++) {
		
		backclouds.push(new Backcloud());
		backclouds[i].y = Math.floor(Math.random()*Game.height-23);
		backclouds[i].x = Math.floor(Math.random()*Game.width-38);
		//console.log(backclouds[i].x);
		backclouds[i].frame = Math.floor(Math.random()*4);
		if(i>=5) {
			backclouds[i].y -=Game.height;
			this.drawflag=true;
		}
		board.add(backclouds[i]);
		
	}
}


var TitleScreen = function TitleScreen(title,subtitle,callback) {
this.step = function(dt) {
	
	document.onkeydown = function(e) {
			var key = e.keyCode;
			
			if (key == 37) {
				
				callback();
			}
			
			
		};
	

};
this.draw = function(ctx) {
ctx[4].fillStyle = "#000000";
ctx[4].textAlign = "center";
ctx[4].font = "bold 40px tahoma";
ctx[4].fillText(title,Game.width/2,Game.height/2);
ctx[4].font = "bold 20px tahoma";
ctx[4].fillText(subtitle,Game.width/2,Game.height/2 + 40);
};
this.clear = function(ctx) {
ctx[4].clearRect(0,0,320,480);
};
this.keeplastvalues = function() {   //Extending draw to the sprite object
	

};
}