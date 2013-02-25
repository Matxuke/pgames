// ActionScript Document

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60); 
	};
})(); //OJOOOOOOO this is not the FPS ^^^^^^^^!!!!!!

var CANVASES=5;

var anim_cnt = 0;
var dt= 1000/60;
var e=0;
var lastLoop = 0;
var thisLoop = 0;
var loopcount=0;
var loopi=0;

var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 1000/60;

var Game = new function() {
	// Game Initialization
	var domerror= this;
	this.ctx = [];
	/*this.m_canvas=[];
	this.m_ctx= [];*/ //pre-rendering canvases
	this.initialize = function(canvasElementId,sprite_data,callback) {
		for(var i=0; i< CANVASES;i++){	
			//console.log("canvas"+i);
			this.canvas = document.getElementById("canvas"+i);
			this.width = this.canvas.width;
			this.height= this.canvas.height;
			// Set up the rendering context
			this.ctx[i] = this.canvas.getContext && this.canvas.getContext('2d');
			this.ctx[i].fillStyle='white';
			this.ctx[i].clearRect(0, 0, this.width, this.height);
			
			/*this.m_canvas[i] = document.createElement("canvas");
			this.m_canvas[i].width = 320;
			this.m_canvas[i].height = 480;
			this.m_ctx[i] = this.m_canvas[i].getContext('2d');*/
		}
		if(!this.ctx[0]) { return alert("Please upgrade your browser to play"); 
		}
// Set up input
		//this.setupInput();
// Start the game loop
		this.loop();
// Load the sprite sheet and pass forward the callback.
		SpriteSheet.load(sprite_data,callback);
	};

// Handle Input: Entzun eta game.keys ekin kontrolatu botoiren bat sakatua bada
	/*var KEY_CODES = { 37:'left', 39:'right'};
	this.keys = {};
	
	this.setupInput = function() {
		window.addEventListener('keydown',function(e) {
			if(KEY_CODES[window.event.keyCode]) {
				Game.keys[KEY_CODES[window.event.keyCode]] = true;
				e.preventDefault();
			}
		},false);
		window.addEventListener('keyup',function(e) {
			if(KEY_CODES[window.event.keyCode]) {
				Game.keys[KEY_CODES[window.event.keyCode]] = false;
				e.preventDefault();
			}
		},false);
	}*/


// Game Loop
	var boards = []; // The boards are the pieces of the game updated and drawn onto the canvas

	this.loop = function() {
//step time
		
//The Game.loop function loops through all the boards, checks if there is a board at
//that index, and if so, calls that board’s step method with the approximate number of seconds that
//have passed, followed by calling the board’s draw method
		/*var delta = Date.now() - lastUpdateTime;
    	if (acDelta > msPerFrame)
    	{
        	acDelta = 0;*/
        	
			for(var i=0, len = boards.length;i<len;i++) { 
				//console.log(i);
				if(boards[i]) {
				
				boards[i].step(dt);
				
				
				//console.log(boards[i]);
				/*domerror.ctx.fillStyle="#F7BE81";
  				domerror.ctx.fillRect(0,0, 320, 480);*/
				boards[i] && boards[i].clear(Game.ctx);
				boards[i] && boards[i].draw(Game.ctx);
				boards[i].keeplastvalues();
				
				//boards[i][0].draw(Game.ctx);
				
				}
			}
			
			// PRE_RENDERING LAYERS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			/*for(var i=0;i<CANVASES;i++){
					Game.ctx[i].drawImage(Game.m_canvas[i], 0, 0);
				}*/
			
			thisLoop = new Date;
    		var fps = 1000 / (thisLoop - lastLoop);
			loopcount+=fps;
    		lastLoop = thisLoop;
			if(loopi==120)
			{
				loopi=0;
				//console.log(loopcount/120);
				loopcount=0;
			}
			else
			{
				loopi++;
			}
			
			
    	/*} else
    	{
        	acDelta += delta;
    	}

    	lastUpdateTime = Date.now();*/
		
		
		
		requestAnimFrame(domerror.loop);
	};
// Change an active game board
	this.setBoard = function(num,board) { boards[num] = board; };

};

//We will define a default sprite sheet here
var SpriteSheet = new function() {
	this.map = { };
	this.load = function(spriteData,callback) {
		this.map = spriteData;
		this.image = new Image();
		this.image.onload = callback;
		this.image.src = 'images/sprite-45-50.png';
	};

	this.draw = function(ctx,sprite,x,y,frame,scale,canvasid) {
		var s = this.map[sprite];
		if(!frame) frame = 0;
		Game.ctx[canvasid].drawImage(this.image,
			s.sx + frame * s.w,
			s.sy,
			s.w, s.h,
			x, y,
			s.w*scale, s.h*scale);
	};
	this.clear = function(ctx,sprite,x,y,scale,canvasid) {
		var s = this.map[sprite];
		Game.ctx[canvasid].clearRect(Math.floor(x),Math.floor(y),s.w*scale+1,s.h*scale+1);
		
	};
	
}

var GameBoard = function(){
	
	var board = this; //JS thing. To use 'board' to refer 'this object'
	//This array contains the current list of objects
	this.objects = [];
	this.cnt = [];
	
	//Add new object to the object list
	this.add = function(obj){
		obj.board=this; //Set a 'board' property to the object
		this.objects.push(obj);
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) +1; // Cuenta cuantos elementos del tipo hay
		return obj;
	};
	
	//Mark an object for removal
	this.remove = function(obj){
		var wasStillAlive = this.removed.indexOf(obj) != -1;//searchs index no. of that object, if exists
		if(wasStillAlive) { this.removed.push(obj); }
		return wasStillAlive;
	};
	
	//reset the list of removed objects
	this.resetRemoved = function() { this.removed = [];}
	
	//Remove objects marked for removal from the list
	this.finalizeRemoved= function() {
		for( var i=0, len=this.removed.lenght; i<len;i++){
			var idx = this.objects.indexOf(this.removed[i]);
			if(idx != -1) {
				this.cnt[this.removed[i].type]--;
				this.objects.splice(idx,1); //Add,remove from array (index, how many)
			}
		}
	}
	
	// Call the same method on all current objects. Para draw/step
	this.iterate = function(funcName) {
		var args = Array.prototype.slice.call(arguments,1); //get arguments
		for(var i=0,len=this.objects.length;i<len;i++) {
			var obj = this.objects[i];
			
			obj[funcName].apply(obj,args); 
			
			
		}
	};
	
	// Find the first object for which func is true
	this.detect = function(func) {
	for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
		if(func.call(this.objects[i])) return this.objects[i];
		}
		return false;
	};
	
	// Call step on all objects and then delete
	// any objects that have been marked for removal
	
	this.step = function(dt) {
		this.resetRemoved();
		this.iterate('step',dt);
		this.finalizeRemoved();
		//console.log("stepping inside gameboard");
	};	 
	this.keeplastvalues = function() {
		
		this.iterate('keeplastvalues');
		
	};
	// Draw all the objects
	this.draw= function(ctx) {
		this.iterate('draw',ctx);
		//console.log("drawing elements inside gameboard");
		
	};
	this.clear= function(ctx) {
		this.iterate('clear',ctx);
		//console.log("drawing elements inside gameboard");
		
	};
	
	// ARE THEY OVERLAPPING?
	this.overlap = function(o1,o2) {
		return !((o1.y+o1.ho-1<o2.y) || (o1.y>o2.y+o2.ho-1) ||
		(o1.x+o1.wo-1<o2.x) || (o1.x>o2.x+o2.wo-1));
	};
	
	//MUST THEY COLLIDE?
	this.collide = function(obj,type) {
		return this.detect(function() { //
			if(obj != this) {
				var col = (!type || this.type & type) && board.overlap(obj,this)
				return col ? this : false; //If col true->this, if false->false
			}
		});
	};
}

var Sprite = function() { } //Dummy Sprite object

Sprite.prototype.setup = function(sprite,props) { //Extending setup to the sprite object
	this.sprite = sprite;
	//this.lastx=0;
	//this.lasty=0;
	this.drawflag=false;
	this.drawing=true;
	//this.canvasid=1;
	this.clearing=true;
	this.scale=1;
	this.merge(props);
	this.frame = this.frame || 0;
	this.w = SpriteSheet.map[sprite].w;
	this.h = SpriteSheet.map[sprite].h;
	this.wo=this.w;
	this.ho=this.h;
}
Sprite.prototype.merge = function(props) { //Extending merge to the sprite object
	if(props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
}
Sprite.prototype.draw = function(ctx) {   //Extending draw to the sprite object
	
	if(this.drawing==true)SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame, this.scale, this.canvasid);
}

Sprite.prototype.clear = function(ctx) {   //Extending draw to the sprite object
	
	if(this.clearing==true)SpriteSheet.clear(ctx,this.sprite,this.lastx,this.lasty, this.scale, this.canvasid);
}

Sprite.prototype.keeplastvalues = function() {   //Extending draw to the sprite object
	
	this.lastx=this.x;
	if(this.lastx<0)this.lastx=0;
	this.lasty=this.y;
	if(this.lasty<0)this.lasty=0;
}