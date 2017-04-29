app.list_item = (function(){
	return {
		render: function(item){
			this.el = $('<li class="item" id=" '+item.id+' ">\
							<div class="res">'+item.value+'</div>\
							<span class=" '+(item.title?'':'none')+' ">'+'('+item.title+')'+'</span>\
							<label class="check">\
								<input type="checkbox" class="checkbox" checked="false">\
								<div></div>\
							</label>\
							<div class="remove">delete<div>\
						</li>');
			this.el.appendTo(app.list.collection);
			this.initEvent(item);
			app.touch.listInit(this.el);
		},

		swipeLeft: function(target){
			$(target).animate({transform:'translateX(-400px)'},300);
			setTimeout(function(){
				
				$(target).remove();
				app.list.deleteItem(target);
			},300);
		},

		setCheckBoxShow: function(args){
			if(args){
				$('.check').show();
			}else{
				$('.checkbox[checked="false"]').parent().hide();
			}
		},

		setDisabled: function(dom){
			dom.attr('disabled','disabled');
		},

		clearDisabled: function(){
			$('.checkbox[checked="false"]').removeAttr('disabled');
		},

		checkInit: function(){
			//this.clearDisabled();
			$('.checkbox').removeAttr('disabled');
			$('.checkbox').attr('checked',false);
			$('.checkbox + div').css('backgroundColor','transparent');
			this.setCheckBoxShow(false);
		},

		initEvent: function(item){
			this.el.find('.checkbox').on('change',function(){ 
				var ac = app.calculator;
				ac.currentView = item.value;//$(this).parent().prev().prev().text();

				var lastChar = ac.resultView.charAt(ac.resultView.length-1);
				if(item.value == 0 && lastChar == "÷"){
					app.calculator.shake();
					return;
				}

				if($(this).attr('checked') == 'false'){
					var checkbox = $(this).parent().parent().siblings().find('.checkbox');
					app.list_item.setDisabled(checkbox);
					$(this).attr('checked',true);

					$('.checkbox[checked="false"]').parent().hide();

					ac.color = ac.setBg();
					$(this).next().css('backgroundColor',ac.color);

					var li = $(this).parent().parent();
					li.css('backgroundColor',ac.color);
					setTimeout(function(){
						li.css('backgroundColor','transparent');
					},100);
				    
					ac.resultView = ac.resultView + ac.currentView;
				    ac.appendResultUI(ac.currentView);
				    ac.currentView = "";
				    ac.hasResult = true;
				}else{
					app.list_item.clearDisabled();
					$(this).attr('checked',false);
					
					$('.check').show();
					$(this).next().css('backgroundColor','transparent');

					ac.deleteResultUI();

					var index = ac.resultView.lastIndexOf(ac.currentView);
					ac.resultView = ac.resultView.substring(0,index);
					ac.currentView = ac.input.text();

					if(ac.resultView == ""){
						ac.clearView();
					}
				}	
				ac.setNum(ac.resultView);
			});	
		}
	}
})()