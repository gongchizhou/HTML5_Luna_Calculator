app.touch = (function(){
	var start,move,end;
	if(app.isTouch){
		start = 'touchstart';
		move = 'touchmove';
		end = 'touchend';
	}else{
		start = 'mousedown';
		move = 'mousemove';
		end = 'mouseup';
	}

	var swipeHold = 10;
	var sliderHold = 60;
	var swipeTime = 500;
	var start_pt,end_pt;
	var startTime,endTime;

	return {
		ctr:$('.controls'),
		item:$('.item'),
		scroll:$('.list-scroll'),
		getPos: function(e){
			if(e.touches && e.touches[0]){
				return{
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
				}
			}else{
				return{
					x: e.clientX,
					y: e.clientY
				}

			}
		},

		getDist: function(p1,p2){
			if(p1 && p2){
				return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
			}
		},

		getAngle: function(p1,p2){
	        var dx = p1.x - p2.x;
	        var dy = p2.y - p1.y;    
	        return angle = Math.atan2(dy , dx) * 180 / Math.PI;
		},

		startEvt:function(e){
			if(!e.touches || e.touches.length == 1){
				start_pt = app.touch.getPos(e);
				startTime = Date.now();
			}
		},

		moveEvt: function(e){
			end_pt = app.touch.getPos(e);
			e.preventDefault(); 
			//if(!e.touches) return;	
		},

		endEvt: function(e){
			endTime = Date.now();
			var dist = app.touch.getDist(start_pt,end_pt);

			if(dist > swipeHold && endTime - startTime < swipeTime){

				var angle = app.touch.getAngle(start_pt,end_pt);
				switch(this){
					case app.touch.ctr[0]: 
						app.touch.ctrCheck(angle);
						break;
					case app.touch.item[0]:  
						app.touch.listItemCheck(dist,angle);
						break;
				}	
			}
			start_pt = null;
			end_pt = null;
		},

		ctrCheck: function(angle){
	        if(angle >= -135 && angle <= -45){
	        	this.ctr.removeClass('down').addClass('up');
	        	setTimeout(function(){
	        		app.touch.scroll.removeClass('pa-bottom');
	        	},300)
	        }
	        if(angle >= 45 && angle < 135){
	        	this.ctr.removeClass('up').addClass('down');
	        	this.scroll.addClass('pa-bottom');
	        }
		},

		listItemCheck: function(dist,angle){
			if(angle < 45 && angle > -45){
				app.item.swipeLeft();
				dist > sliderHold && app.item.sliderLeft();
			}
		},

		init: function(){
			this.ctr.on(start,this.startEvt);
			this.ctr.on(move,this.moveEvt);
			this.ctr.on(end,this.endEvt);

			this.item.on(start,this.startEvt);
			this.item.on(move,this.moveEvt);
			this.item.on(end,this.endEvt);
		}
	}
})()