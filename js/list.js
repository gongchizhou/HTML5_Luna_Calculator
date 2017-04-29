app.list = (function(){
	//var items = new Array();
	var key = 'results';
	return {
		collection: $('.lists'),
		items:new Array(),

		save: function(){
			var v = JSON.stringify(this.items); 
			localStorage.setItem(key,v);
		},

		addItem: function(item){
			this.items.push(item);
			app.list_item.render(item);
			this.count++;
			this.save();
		},

		deleteItem: function(item){
			var index = this.items.indexOf(item);
			this.items.splice(index,1);
			this.count>1 && this.count--;
			this.save();
			
		},

		init: function(){
			var d = localStorage.getItem(key);
			this.items = JSON.parse(d) || [];
			if(this.items){
				for(var i=0;i<this.items.length;i++){
					app.list_item.render(this.items[i]);
					this.count = $('.item').length;
				};
			}
		} 
	}
})()