app.client = (function(){
	return {
		init: function(){
			this.onload();
			$(window).resize(function(){
				app.client.onload();
			});
		},

		onload: function(){
			alert(app.isTouch);
			if(!app.isTouch){
				this.width = 320;
				this.height = 568;
				$('body').addClass('pc');

				//this.renderClient();
			}else{
				this.width = window.innerWidth;
				this.height = window.innerHeight;
			}
			//this.renderClient();	
		},

		renderClient: function(){
			app.wrap.width(this.width);
			app.wrap.height(this.height);
		}
	}
})()