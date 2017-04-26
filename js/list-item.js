app.list_item = (function(){
	return {
		render: function(item){
			this.el = $('<li class="item">\
							<div class="res">'+item.value+'</div>\
							<span class=" '+(item.title?'':'none')+' ">'+'('+item.title+')'+'</span>\
							<label class="check">\
								<input type="checkbox" class="checkbox">\
								<div></div>\
							</label>\
						</li>');
			this.el.appendTo(app.list.collection);
			this.initEvent(item);
		},
		swipeLeft: function(){
			/*   */
		},

		sliderLeft: function(){
			app.list.deleteItem();
		},

		setCheckBoxShow: function(args){
			if(args){
				$('.check').show();
			}else{
				$('.checkbox:not(:checked)').parent().hide();
			}
		},

		setDisabled: function(dom){
			dom.attr('disabled','disabled');
		},

		clearDisabled: function(){
			$('.checkbox').removeAttr('disabled');
		},

		checkInit: function(){
			this.clearDisabled();
			//$('.checkbox:checked').trigger('change');
			$('.checkbox + div').css('backgroundColor','transparent');
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

				if($(this).is(':checked')){
					var checkbox = $(this).parent().parent().siblings().find('.checkbox');
					app.list_item.setDisabled(checkbox);

					$('.checkbox:not(:checked)').parent().hide();

					ac.color = ac.setBg();
					$(this).next().css('backgroundColor',ac.color);

					var li = $(this).parent().parent();
					li.css('backgroundColor',ac.color);
					setTimeout(function(){
						li.css('backgroundColor','transparent');
					},100);
				    
					ac.resultView = ac.resultView + ac.currentView;
				    ac.appendResultUI(ac.currentView);
				    ac.currentView = ac.preView = "";
				    ac.hasResult = true;
				}else{
					app.list_item.clearDisabled();
					
					$('.check').show();

					$(this).next().css('backgroundColor','transparent');

					ac.deleteResultUI();

					var index = ac.resultView.lastIndexOf(ac.currentView);
					ac.resultView = ac.resultView.substring(0,index);
					ac.preView = ac.input.text();

					if(ac.resultView == ""){
						ac.clearView();
					}
				}	
				ac.setNum(ac.resultView);
			});	
		}
	}
})()