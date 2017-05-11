app.calculator = (function(){

	return {
		title: $('.title input'),
		hd: $('.header'),
		cal: $('.cal'),
		output: $('.cal-output'),
		inputWrap: $('.cal-input p'),
		input: $('.cal-input p span:last-child'),
		ctr: $('.controls'),

		currentView: "",
		resultView: "",
 		ptExist: false,
		hasResult: false,

		savable: false,
		clearable: false,
		colors: ['#88b443','#d49d33','#e78023','#e3320f','#e23a8d','#35bbd4','#2bb361'],

		textAjust: function(){
			var l = this.output.text().length;
			if(l > 11){
				this.output.css('font-size',48*11/l);
			}else{
				this.output.css('font-size',48);
			}
		},

		setView: function(view){
			this.input.text(view);
			this.textAjust();
		},

		setNum:	function(view){
			var num = this.calNum(view);
			this.output.text(num);
		},

		calNum: function(view){
			if(view){
				var calCurrentView = (view + "").replace(/x/g,'*').replace(/÷/g,'/').replace(/%/g,'/100');
				var lastChar = calCurrentView.charAt(calCurrentView.length-1);

				if(lastChar == "+" || lastChar == "-"){
					calCurrentView = calCurrentView + "0";
				}
				if(lastChar == "*" || lastChar == "/"){
					calCurrentView = calCurrentView + "1";
				}
				return eval(calCurrentView);
			}else{
				return "";
			}
		},

		isLastNum: function(view){
			var lastChar = view.charAt(view.length-1);
			var reg = /[0-9]/;
			return reg.test(lastChar)?true:false;
		},

		isLastOps: function(view){
			var lastChar = view.charAt(view.length-1);
			var reg = /[\+\-\x\÷]/;
			return reg.test(lastChar)?true:false;
		},

		setSaveStatus: function(args){
			this.savable = args;
			if(this.savable){
				app.done.text('save');
			}else{
				app.done.text('=');
			}
		},

		setClearStatus:	function(args){
			this.clearable = args;
			if(this.clearable){
				app.del.text('clear');
			}else{
				app.del.text('del');
			}
		},

		initColor: function(){
			this.color = this.colors[Math.floor(Math.random()*this.colors.length)];
		},

		setBg: function(){
			var index = this.colors.indexOf(this.color)+1;
			if(index > this.colors.length-1){
				index = 0;
			}
			var bg = this.colors[index];
			return bg;
		},

		shake: function(){
			this.inputWrap.addClass('shake');
			setTimeout(function(){
				app.calculator.inputWrap.removeClass('shake');
			},100);
		},

		numsClick: function(operator){
			var isLastNum = this.isLastNum(this.resultView.toString());
			var lastChar = this.resultView.charAt(this.resultView.length-1);

			if(lastChar == "%" || (isLastNum && this.input.text() == "") || (operator == "0" && lastChar == "÷")){
					this.shake();
					return;
			}

			if(!this.hasResult && this.input.text() == ""){
				this.setSaveStatus(true);
				this.setClearStatus(false);
			}

			if(lastChar == "."){
				this.ptExist = true;
			}	
			
			var preChar = this.resultView.charAt(this.resultView.length-2);
			if(lastChar == "0" && (/[\+\-\x\÷]/.test(preChar) || preChar == "")){
				// solve 000.2 unexcept end;
				this.currentView = this.currentView.slice(0,-1) + operator;
				this.resultView = this.resultView.slice(0,-1) + operator;

			}else{
				this.refreshView(operator);
			}

			this.setView(this.currentView);
			this.setNum(this.resultView);
			app.list_item.setCheckBoxShow(false);
		},

		opsClick: function(operator){
			var isLastNum = this.isLastNum(this.resultView.toString());
			var lastChar = this.resultView.charAt(this.resultView.length-1);

			if((lastChar == "" && this.input.text() == "") || (lastChar == "%" && operator == "%") || lastChar == "."){
				this.shake();
				return;
			}

			this.setClearStatus(false);
			this.setSaveStatus(false);

			if(this.isLastOps(this.currentView)){
				this.currentView = this.currentView.slice(0,-1);
				this.resultView = this.resultView.slice(0,-1);
			}

			this.refreshView(operator);
			
			if(this.ptExist){
				this.ptExist = false;
			}
			app.list_item.setCheckBoxShow(true);
			app.list_item.clearDisabled();

			this.setView(this.currentView);
			this.setNum(this.resultView);	
		},

		ptClick: function(){
			var lastChar = this.currentView.charAt(this.currentView.length-1);
			if(this.ptExist || lastChar == "÷" || lastChar == "%" || (this.hasResult && this.input == "")){
				this.shake();
				return;
			}
			var operator = ".";
			var isLastNum = this.isLastNum(this.currentView.toString());
			if(!isLastNum){
				operator = "0" + operator;
			}

			this.refreshView(operator);

			this.setView(this.currentView);
			this.setNum(this.resultView);

			this.ptExist = true;
			if(lastChar == ""){
				this.setSaveStatus(true);
			}
		},

		refreshView: function(operator){
			this.currentView = this.currentView + operator;
			this.resultView = this.resultView + operator;
		},

		doneClick: function(){
			this.currentView = this.calNum(this.resultView);
			this.resultView = this.currentView.toString();

			if(!this.savable){
				if(this.input.text() == "" && !this.hasResult){
					return;
				}
				this.setSaveStatus(true);
				this.setClearStatus(true);
				this.hasResult = true;
				this.ptExist = true;

				this.setView(this.currentView);
				this.setNum(this.resultView);

				this.concatResultUI();

				this.currentView = "";
				app.list_item.setCheckBoxShow(false);

			}else{
				
				this.setSaveStatus(false);
				this.setClearStatus(false);
				this.hasResult = false;

				var item = {
					title:this.title.val(),
					value:this.resultView,
					id:Math.random()
				};

				app.list.addItem(item);
				this.saveAni();	
				app.list_item.setCheckBoxShow(true);
			}
			app.list_item.checkInit();

		},

		concatResultUI: function(){
			this.color = this.setBg();
			this.inputWrap.empty();
			this.appendResultUI(this.resultView);
			
			this.inputWrap.addClass('bounceIn');
			setTimeout(function(){
				app.calculator.inputWrap.removeClass('bounceIn');
			},500);
		},

		appendResultUI: function(view){
			this.inputWrap.append('<span>'+view+'</span><span></span>');
			this.input = $('.cal-input p span:last-child');
			var viewDom = $('.cal-input p span:nth-last-child(2)');
			viewDom.css({'backgroundColor':this.color, 'padding':'0 8px'});
		},

		saveAni: function(){
			this.title.val()?this.hd.addClass('move'):this.cal.addClass('move');
			this.ctr.addClass('move');

			setTimeout(function(){
				var ac = app.calculator;
				ac.clearView();
				ac.title.val("");

				ac.hd.removeClass('move');
				ac.cal.removeClass('move');
				ac.ctr.removeClass('move');
				ac.input.css({'backgroundColor':'transparent', 'padding':'0'});
			},300);		
		},

		deleteResultUI: function(){
			var viewDom1 = $('.cal-input p span:last-child');
			var viewDom2 = $('.cal-input p span:nth-last-child(2)');
			viewDom1.remove();
			viewDom2.remove();
			this.input = $('.cal-input p span:last-child');
		},

		delClick: function(){
			if(this.clearable){
				this.clearView();
			}else{
				var isLastNum = this.isLastNum(this.resultView.toString());
				if(this.hasResult && this.input.text() == "" && isLastNum){
					var view = $('.cal-input p span:nth-last-child(2)').text();
					this.deleteResultUI();
					app.list_item.setCheckBoxShow(true);

					var index = this.resultView.lastIndexOf(view);
					this.resultView = this.resultView.substring(0,index);
					//this.currentView = this.resultView.charAt(this.resultView.length-1);
					this.currentView = this.input.text();

					this.setView(this.currentView); 
					this.setNum(this.resultView);
				}else{
					var lastChar = this.currentView.charAt(this.currentView.length - 1);
					var preChar = this.currentView.charAt(this.currentView.length - 2);

					//var isLastNum = this.isLastNum(this.currentView.toString());
					if(lastChar == "."){
						this.ptExist = false;
					}

					if(this.isLastOps(preChar)){
						app.list_item.setCheckBoxShow(true);
					}
					
					if(this.isLastOps(lastChar)){
						var ptIndex = this.resultView.indexOf('.');
						(ptIndex == -1)?(this.ptExist = false):(this.ptExist = true);
						app.list_item.setCheckBoxShow(false);
					}

					this.resultView = this.resultView.slice(0,-1);
					this.currentView = this.currentView.slice(0,-1);

					this.setView(this.currentView); 
					this.setNum(this.resultView);	

				}
				if(this.resultView.length == 0){
					this.clearView();
				}	
				this.input = $('.cal-input p span:last-child');
					
			}
		},

		clearView: function(){
			this.resultView = this.currentView = "";
			this.setView(this.currentView);
			this.setNum(this.resultView);
			this.ptExist = false;
			this.hasResult = false;
			this.setSaveStatus(false);
			this.setClearStatus(false);
			app.list_item.setCheckBoxShow(true);

			this.inputWrap.empty();
			this.inputWrap.append('<span></span>');
			this.input = $('.cal-input p span:last-child');
		},

		swClick: function(){
			var isLastNum = this.isLastNum(this.resultView.toString());
			if(this.hasResult && this.input.text() == "" && isLastNum){
				var lastView = $('.cal-input p span:nth-last-child(2)');
				var viewNum = lastView.text();
				lastView.text(-1*viewNum);

				var index = this.resultView.lastIndexOf(viewNum);
				this.resultView = this.resultView.substring(0,index) + (-1*viewNum);
				this.setNum(this.resultView);
			}else{
				var nearPlus = this.currentView.lastIndexOf("+");
				var nearMinus = this.currentView.lastIndexOf("-");
				if(nearPlus > nearMinus){
					this.currentView = replaceOps(this.currentView,nearPlus,'-');

					var index = this.resultView.lastIndexOf('+');
					this.resultView = replaceOps(this.resultView,index,'-');				
				}else if(nearPlus < nearMinus){
					var view = this.currentView.substr(0,nearMinus);
					if(this.isLastOps(view)){
						this.currentView = replaceOps(this.currentView,nearMinus,'');

						var index = this.resultView.lastIndexOf('-');
						this.resultView = replaceOps(this.resultView,index,'');	
					}else{
						this.currentView = replaceOps(this.currentView,nearMinus,'+');

						var index = this.resultView.lastIndexOf('-');
						this.resultView = replaceOps(this.resultView,index,'+');
					}
				}else{
					if(this.hasResult){
						var index = this.resultView.lastIndexOf(this.currentView.charAt(0));

						this.currentView = insertOps(this.currentView,1,'-');
						this.resultView = insertOps(this.resultView,index+1,'-');	
					}else{
						this.currentView = "-" + this.currentView;
						this.resultView = this.currentView;
					}
				}
				this.setView(this.currentView);
				this.setNum(this.resultView);
			}
			function replaceOps(view,pos,ops){
				var temp = view.substr(0,pos) + ops + view.substring(pos+1,view.length);
				return temp;
			}
			function insertOps(view,pos,ops){
				var temp = view.substr(0,pos) + ops + view.substring(pos,view.length);
				return temp;
			}
		},

		init: function(){
			this.initColor();
		}
	}

})()










