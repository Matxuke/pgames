//Sprite definition   OBJECT 2011 Recommended size 320 x 480 too small?
var sprites = {
lady: { sx: 0, sy: 0, w: 45, h: 50, frames: 3 },
plat: { sx: 0, sy: 540, w: 40, h: 20, frames: 16 },
fire: { sx: 0, sy: 550, w: 40, h: 20, frames: 7 },
base: { sx:0, sy:50, w: 320, h:5, frames:1},
ladymap: {sx:-30, sy:-5, w: 30, h:5, frames: 0},
fondo: {sx:0, sy:60, w: 320, h:480, frames: 0},
backcloud: {sx:0, sy:815, w:150, h:110, frames: 3},
retrato: {sx:0, sy:571, w: 210, h:245, frames: 1},
scene1: {sx:320, sy:60, w:320, h:213, frames: 2},
scene1miniteeth: {sx:995, sy:273, w:23, h:23, frames: 4},
scene1maxiteeth: {sx:320, sy:353, w:180, h:160, frames: 4},
scene1text: {sx:1280, sy:273, w:320, h:85, frames: 0}
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
	scene1miniteeth,
	scene1maxiteeth,
	scene1text,
	fondue,
	parallaxv=0,
	hanginggardens = [], //registro de las plataformas
	platformCount = 10,
	position = 0,
	gravity = 0.2,
	flag = 0,
	broken = 0,
	gap=0,
	dir, score = 0, firstRun = true;

//Draws a sprite in the canvas   ANNONIMOUS FUNCTION
var startGame = function() {	
//SpriteSheet.draw(Game.ctx,"fondo",0,0,0);
Game.setBoard(0,new TitleScreen("GRANNY, WHERE WENT YOUR TEETH?", "Press left to start playing",playGame));
//Game.setBoard(2,new Player());
}

var openingAnimation = function(){
	var board= new GameBoard();
	board.add(new Scene1());
	board.add(new Scene1miniteeth());
	board.add(new Scene1maxiteeth());
	board.add(new Scene1text());
	Game.setBoard(0,board);
	//playGame();
}

var playGame = function() {
	
	//Game.setBoard(1,new TitleScreen("OLD LADY", "Game started",playGame));
	var board = new GameBoard();
	board.add(new Fondue());
	
	createbackclouds(board);
	board.add(new Retrato());
	
	board.add(new Player());
	createplatforms(board);
	
	
	
	
	//board.add(new Platforms());
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
	//this.moving=false;
	
	//animation vars
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
			
			

			// Speed limit
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
				//Game.setBoard(4,new Textbox(""));
			}
			
			mx=this.x;
			mw=this.wo;
			this.x+= this.w/2-15;
			this.wo=30;
			if(this.vy<0){
				collision = this.board.collide(this,OBJECT_PLATFORM);
				if(collision && collision.plattype==5 && collision.drawflag==false) this.vy=0;
			}
			
			
			if(this.vy>0){
				
				my=this.y;
				mh=this.ho;
				
				
				
				this.y+= this.ho-5;
				this.ho=5;
				
				var collision2 = this.board.collide(this,OBJECT_PLATFORM);
				
				
				if(collision2 && collision2.drawflag==false) {
					
					if(collision2.plattype==3){ 
						
						this.jump(MINI_JUMP);
						var k = collision2.whoami;
						platforms[k].drawflag=true;
						platforms[k].clearing=true;
						platforms[k].frame=17;
					}
					else if(collision2.plattype==4){ 
						this.jump(FULL_JUMP);
						var k = collision2.whoami;
						platforms[k].drawflag=true;
						platforms[k].clearing=true;
						platforms[k].frame=17;
					}
					else{
						
						this.jump(FULL_JUMP);
					}
					
				}
				else {
				//Game.setBoard(4,new Textbox(""));
				}
				
				this.y=my;
				this.ho=mh;
				
			}
			this.x=mx;
			this.wo=mw;

			//Gameover if it hits the bottom 
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
						
						//var tempp= new Platform();
						//platforms[i].y = tempp;
						
						platforms[i].y = p - Game.height;
						platforms[i].x = Math.random() * (Game.width - platforms[i].w);
						platforms[i].frame = Math.floor(Math.random() * 8);
						platforms[i].asignplatform();
						
						//platforms[i].y = 0;
					}
					platforms[i].clearing=true;
					platforms[i].drawing=true;
				}
				//console.log(retrato.drawflag);
				parallaxv=this.vy;

				//Base.y -= this.vy;
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
				

			
			
		
		//console.log("stepped!!!");
		
		}
		this.jump = function(value) {
			
			this.vy = value;
	    };
		
		this.animate = function(){
			
			var delta = Date.now() - this.lastUpdateTime;
			
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		
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
			//console.log(this.lastvel);
			//console.log(this.vy);
			this.lastvel=this.vy;
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
		};
			
		

	}
	
	
}
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;


var Platform = function() {
	
	this.setup('plat');
	this.ho=10; // Only detect the top half for collisions

	this.plattype=1;
	this.x = Math.random() * (Game.width - this.w); //Numero entre 0 y 1. x entre 0 y width-objeto
	this.y = position;
	this.pvx=1;
	//this.ishidden=false;
	this.woiam=0;
	
	this.canvasid=2;

	position += (Game.height / platformCount);

	this.flag = 0;
	this.state = 0;
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=100;
	
	
	



	this.asignplatform=function(){
	
		//Platform types 1 to 6
	
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
			if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5];
			else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
			else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
			else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,5,5,5];
			else if (score >= 100 && score < 500000000000000000) this.types = [1,1,1,1,1, 6];
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
			this.frame = Math.floor(Math.random() * 9);
			
		}
			
		else if (this.plattype == 2) {
			this.frame = Math.floor(Math.random() * 3) + 9;
		}
		else if (this.plattype == 3) this.frame = 12;
		else if (this.plattype == 4) this.frame = 13;
		else if (this.plattype == 5 && gap<1) this.frame = 14;
		else if (this.plattype == 5 && gap>0) this.frame = 16;
		else if (this.plattype ==6){
			//console.log("ESTAMOS EN LA 6!");
			//this.setup('fire');
			this.frame=15;
			//this.canvasid=2;
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
				//console.log("framin':",this.frame);
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
		
		
		
		this.x = (0.5 + this.x) << 0;
		this.y = (0.5 + this.y) << 0;
		
		//console.log(this.clearing);
		
	
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
		platforms[i].drawing=true;
		board.add(platforms[i]);
	}
}

function createbackclouds(board){
	
	for (var i = 0; i < 20; i++) {
		
		backclouds.push(new Backcloud());
		backclouds[i].y = Math.floor(Math.random()*Game.height-23);
		backclouds[i].x = Math.floor(Math.random()*Game.width-38);
		//console.log(backclouds[i].x);
		backclouds[i].frame = Math.floor(Math.random()*4);
		if(i>=10) {
			backclouds[i].y -=Game.height;
			this.drawflag=true;
		}
		board.add(backclouds[i]);
		
	}
}


var TitleScreen = function TitleScreen(title,subtitle,callback) {
	
	var notmore=false;
	this.step = function(dt) {
	if(notmore==false){
		document.onkeydown = function(e) {
			var key = e.keyCode;
			
			if (key == 37 && notmore==false) {
				notmore=true;
				callback();
			}
			
			
		};
	}
	

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

//OPENING ANIMATION +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var Scene1 = function() {
	this.setup('scene1', {frame: 0});
	
	this.x = 0;
	this.y = 125; //height is 213 so: (480-213)/2
	
	
	this.canvasid=3;
	Game.ctx[1].fillStyle="#000000";
	Game.ctx[1].fillRect(0,0,Game.width,Game.height); //Set the third layer in black
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=1000;
	
	this.move2=0;
	this.move3=0;
	this.move4=0
	
	this.animate = function(){
			
		var delta = Date.now() - this.lastUpdateTime;
		this.drawing=false;
		this.clearing=false;	//console.log(this.acDelta);
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		if(this.move2<4){
			if(this.acDelta > this.msPerFrame) {
				this.acDelta = 0;
				this.frame++;
				//console.log("framin':",this.frame);
				if(this.frame>2){
					this.frame=0;
					this.move2++;
					if(this.move2==4) this.frame=1;
				}
			}
			else{
				this.acDelta += delta;
			
			}
			if(this.acDelta==0) {
				this.drawing=true;
				this.clearing=true;
			}
		}
		else{
			if(this.move3<3){	
				if(this.acDelta > this.msPerFrame/2) {
					this.acDelta = 0;
					this.frame++;
					//console.log("framin':",this.frame);
					if(this.frame>2){
						this.frame=1;
						this.move3++;
						if(this.move3==3) this.frame=3;
					}
				}
				else{
					this.acDelta += delta;
			
				}
				if(this.acDelta==0) {
					this.drawing=true;
					this.clearing=true;
				}
			}
			else{
				scene1miniteeth.drawflag=true;
				scene1maxiteeth.drawflag=true;
				
				if(this.move4<6){	
					if(this.acDelta > this.msPerFrame/4) {
						this.acDelta = 0;
						if(this.frame==0) this.frame=3;
						else if(this.frame==3) this.frame=0;
						this.move4++;
						//console.log(this.frame);
						
						
					}
					else{
						this.acDelta += delta;
			
					}
					if(this.acDelta==0) {
						this.drawing=true;
						this.clearing=true;
					}
				}
				else{
					scene1miniteeth.drawflag=true;
					scene1maxiteeth.drawflag=true;
				}
				
				
			}
			
		}
		this.lastUpdateTime = Date.now();
			//console.log(this.lastvel);
			//console.log(this.vy);
			
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
	};
	
	this.step = function(dt) {
		this.animate();
		}
	
	
	

};
Scene1.prototype = new Sprite();

var Scene1miniteeth = function() {
	this.setup('scene1miniteeth', {frame: 0});
	scene1miniteeth=this;
	
	this.x = 105;
	this.y = 110+125; //height is 213 so: (480-213)/2
	
	Game.ctx[4].clearRect(0,0,Game.width,Game.height);
	
	this.drawing=false;
	this.clearing=false;
	this.radius=0.02;
	this.angle=0;
	
	this.canvasid=4;
	
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=100;
	
	this.move2=0;
	this.move3=0;
	
	this.animate = function(){
			
		this.drawing=true;
		this.clearing=true;	
		var delta = Date.now() - this.lastUpdateTime;
			//console.log(this.acDelta);
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		
		if(this.acDelta > this.msPerFrame) {
			this.acDelta = 0;
			this.frame++;
				//console.log("framin':",this.frame);
			if(this.frame>4){
				this.frame=0;
				//this.move2++;
				//if(this.move2==4) this.frame=1;				
			}
		}
		else{
			this.acDelta += delta;
			
		}
		if(this.acDelta==0) {
			this.drawing=true;
			this.clearing=true;
		}
		
		
		this.lastUpdateTime = Date.now();
			//console.log(this.lastvel);
			//console.log(this.vy);
			
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
	};
	
	this.step = function(dt) {
		//console.log(this.drawflag);
		if(this.drawflag==true){
			this.animate();
			this.x= this.x+this.radius * Math.cos(this.angle);
			this.y= this.y+ this.radius * Math.sin(this.angle);
			if(this.radius<3.2) this.radius+=0.005;
			this.angle+=0.05;
			console.log(this.radius);
			
			}
		}
	
	
	

};
Scene1miniteeth.prototype = new Sprite();

var Scene1maxiteeth = function() {
	this.setup('scene1maxiteeth', {frame: 0});
	scene1maxiteeth=this;
	
	this.x = Game.width/2 - this.w/2;
	this.y = Game.height + this.h; //height is 213 so: (480-213)/2
	
	
	
	this.drawing=false;
	this.clearing=false;
	
	
	this.canvasid=2;
	
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=100;
	
	this.move2=0;
	this.move3=0;
	
	this.animate = function(){
			
		this.drawing=true;
		this.clearing=true;	
		var delta = Date.now() - this.lastUpdateTime;
			//console.log(this.acDelta);
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		
		if(this.acDelta > this.msPerFrame) {
			this.acDelta = 0;
			this.frame++;
				//console.log("framin':",this.frame);
			if(this.frame>4){
				this.frame=0;
				//this.move2++;
				//if(this.move2==4) this.frame=1;				
			}
		}
		else{
			this.acDelta += delta;
			
		}
		if(this.acDelta==0) {
			this.drawing=true;
			this.clearing=true;
		}
		
		
		this.lastUpdateTime = Date.now();
			//console.log(this.lastvel);
			//console.log(this.vy);
			
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
	};
	
	this.step = function(dt) {
		
		if(this.drawflag==true){
			this.animate();
			
			if(this.y>0){
				this.y-= 1;
			}
			else{
				scene1text.drawflag=true;
				
			} 
			
			
			}
		}
	
	
	

};
Scene1maxiteeth.prototype = new Sprite();

var Scene1text = function() {
	this.setup('scene1text');
	scene1text=this;
	
	this.x = Game.width/2 - this.w/2;
	this.y = Game.height - 120; //height is 213 so: (480-213)/2
	
	
	
	this.drawing=false;
	this.clearing=false;
	
	
	this.canvasid=2;
	
	
	this.lastUpdateTime = 0;
	this.acDelta = 0;
	this.msPerFrame=100;
	
	this.move2=0;
	this.move3=0;
	
	this.animate = function(){
			
		this.drawing=true;
		this.clearing=true;	
		var delta = Date.now() - this.lastUpdateTime;
			//console.log(this.acDelta);
			//console.log(this.acDelta);
			//console.log(this.msPerFrame);
		
		if(this.acDelta > this.msPerFrame) {
			this.acDelta = 0;
			this.frame++;
				//console.log("framin':",this.frame);
			if(this.frame>4){
				this.frame=0;
				//this.move2++;
				//if(this.move2==4) this.frame=1;				
			}
		}
		else{
			this.acDelta += delta;
			
		}
		if(this.acDelta==0) {
			this.drawing=true;
			this.clearing=true;
		}
		
		
		this.lastUpdateTime = Date.now();
			//console.log(this.lastvel);
			//console.log(this.vy);
			
			//console.log(this.acDelta);
			//console.log(this.frame);
				
		
	};
	
	this.step = function(dt) {
		
		if(this.drawflag==true && this.drawing==false){
			//console.log("ESTAMOS EN LA B");
			this.drawing=true;
			
			
			
			
			}
		}
	
	
	

};
Scene1text.prototype = new Sprite();


