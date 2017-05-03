var app = {
	wrap:$('#wrap'),
	nums: $('.num'),
	rate: $('.rate'),
	options: $('.ops'),
	pt: $('.point'),
	sw: $('.switch-plus'),
	done: $('.done'),
	del: $('.del'),
	isTouch: ('ontouchstart' in window),
	initEvent: function(){
		this.nums.on('click',function(){
			var operator = $(this).text();
			app.calculator.numsClick(operator);	
		});
 
		this.options.on('click',function(){
			var operator = $(this).text();
			app.calculator.opsClick(operator);		
		});

		this.pt.on('click',function(){
			app.calculator.ptClick();
			
		});

		this.sw.on('click',function(){
			app.calculator.swClick();
		})

		this.done.on('click',function(){
			app.calculator.doneClick();
		});
		
		this.del.on('click',function(){
			app.calculator.delClick();
		});

	},

	init: function(){
		this.initEvent();
		app.client.init();
		app.calculator.init();
		app.touch.init();
		app.list.init();
	}
}

$(function(){
	app.init();
})

