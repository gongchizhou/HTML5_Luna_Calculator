app.client = (function(){
	return {
		init: function(){
			this.onload();
			$(window).resize(function(){
				app.client.onload();
			});
		},

		onload: function(){
			if(!app.isTouch){
				this.width = 320;
				this.height = 568;
				$('body').addClass('pc');

				this.renderClient();
			}	
		},

		renderClient: function(){
			app.wrap.width(this.width);
			app.wrap.height(this.height);
			//$('.row div').height('80px')
			//$('.header').height('168px');
		}
	}
})()