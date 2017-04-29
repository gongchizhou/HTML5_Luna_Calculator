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
	var sliderHold = 100;
	var swipeTime = 500;
	var start_pt,end_pt;
	var startTime,endTime;
	var target;

	return {
		ctr:$('.controls'),
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
			if(p1 && p2){
		        var dx = p1.x - p2.x;
		        var dy = p2.y - p1.y;    
		        return angle = Math.atan2(dy , dx) * 180 / Math.PI;
	    	}
		},

		startEvt:function(e){
			if(!e.touches || e.touches.length == 1){
				start_pt = app.touch.getPos(e);
				startTime = Date.now();
				target = e.target;
			}
		},

		moveEvt: function(e){
			end_pt = app.touch.getPos(e);
			e.preventDefault(); 
		},

		endEvt: function(e){
			endTime = Date.now();
			var dist = app.touch.getDist(start_pt,end_pt);
			if(dist > swipeHold && endTime - startTime < swipeTime){
				var angle = app.touch.getAngle(start_pt,end_pt);
				
				app.touch.ctrCheck(angle);
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

		itemAction: {
			moveEvt: function(e){
				end_pt = app.touch.getPos(e);
				
				if(start_pt){
					var offset = start_pt.x - end_pt.x;
					var angle = app.touch.getAngle(start_pt,end_pt);

					if(angle < 45 && angle > -45){
						$(target).css('transform','translateX('+ -offset/2 +'px)');
					}

					var left = app.wrap[0].offsetLeft - app.wrap.width()/2;
					var top = $('.panel')[0].offsetTop + app.wrap[0].offsetTop - app.wrap.height()/2;
					var bottom = top + $('.item:last-child')[0].offsetTop + $('.item:last-child').height() - 1;
					
					if(end_pt.x <= left || end_pt.y <= top || end_pt.y >= bottom){
						$(target).trigger(end);
					}
				}
			},

			endEvt: function(e){
				var dist = app.touch.getDist(start_pt,end_pt);
				var angle = app.touch.getAngle(start_pt,end_pt);

				if(dist > sliderHold){
					if(angle < 45 && angle > -45){
						app.list_item.swipeLeft(target);
					}
				}else{
					$(target).animate({transform:'translateX(0px)'},300);
				}
				
				start_pt = null;
				end_pt = null;
			}

		},

		listInit: function(item){
			item.on(start,this.startEvt);
			item.on(move,this.itemAction.moveEvt);
			item.on(end,this.itemAction.endEvt);
		},

		init: function(){
			this.ctr.on(start,this.startEvt);
			this.ctr.on(move,this.moveEvt);
			this.ctr.on(end,this.endEvt);
		}
	}
})()