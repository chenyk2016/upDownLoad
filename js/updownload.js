// UpDownLoad扩展 chen yk  ** https://github.com/chenyk2016/upDownLoad
(function (d) {
	var unions = (function (window, document, Math) {
		var me = {
			// 4. 移动端判断
			isMobile: function () {
				if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
					return true;
				}else {
					return false;
				}
			},
			// 5. 
			hasClass: function ( elements,cName ){
			   return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
			},
			addClass: function ( elements,cName ){
			   if( !this.hasClass( elements,cName ) ){
			      elements.className += " " + cName;
			   }
			},
			removeClass: function ( elements,cName ){
			   if( this.hasClass( elements,cName ) ){
			      elements.className = elements.className.replace( new RegExp( "(\\s+|^)" + cName + "(\\s+|$)" )," " ); // replace方法是替换
			   }
			}
		};

		return me;
	})();

	function UpDownLoad( selector ){
		var _self = this;
		_self.myScroll = new IScroll(selector, {
			probeType: 2,         //指针反应灵敏度1-3（高），
			scrollbars: true,     //滚动条
			fadeScrollbars: true, //闲置时隐藏滚动条
			click: true,          //点击
			disableTouch: false   //触摸
		});

		_self.state = "leisure";	//当前滚动状态
		_self.prevState = "";            //最后调用成功的状态
		_self.wraper = _self.myScroll.wrapper;

		// 创建Dom
		var eleDown = document.createElement("div");
		eleDown.className = "refresh_wrap";
		eleDown.innerHTML = "<span class='refresh_load' > ↓ 下拉刷新 </span>";
		eleDown.style.cssText = "position: absolute; top: -40px; left: 0; right: 0; height: 40px; line-height: 40px; padding: 0; margin: 0 auto; text-align: center; font-size: 14px;";
		var eleUp = document.createElement("div");
		eleUp.className = "load_wrap";
		eleUp.innerHTML = "<span class='load_more'>↑ 上拉加载更多</span>";
		eleUp.style.cssText = "position: absolute; bottom: -40px; left: 0; right: 0; height: 40px; line-height: 40px; padding: 0; margin: 0 auto; text-align: center; font-size: 14px;";

		_self.wraper.querySelector(".iscroll").appendChild( eleDown );
		_self.wraper.querySelector(".iscroll").appendChild( eleUp );

	    _self.pullDown = {
	        parent:  _self.wraper.querySelector(".iscroll"),
	        el: _self.wraper.querySelector(".refresh_load"),
	        static: function (d) {
	            this.el.innerHTML = " ↓ 下拉刷新";
	        },
	        move: function (d) {
	            this.el.innerHTML = " ↑ 释放立即刷新";
	        },
	        loading:function (d) {
	            this.parent.style.top = 50+"px";
	            this.el.innerHTML = " 正在刷新 ";
	            unions.addClass(this.el, "loading");
	            // 打开上拉功能
	            _self.pullUp.locked = false;
	        },
	        finish: function (fn) {
	            
	            unions.removeClass(this.el , "loading"  );
	            this.el.innerHTML = " 刷新成功 ";
	            var _this = this;
	            setTimeout(function (d) {
	            	// jshint -W084
	            	fn && fn();
	            	// jshint +W084
	                _this.clear();
	                _self.myScroll.refresh();
	                
	            }, 1000);
	        },
	        clear: function (d) {
	            this.parent.style.top = "0";
	            unions.removeClass(this.el , "loading");
	            this.static();
	            
	        },
	        error: function ( fn ) {

	            unions.removeClass(this.el , "loading"  );
	            this.el.innerHTML = " 刷新失败 ";
	            var _this = this;
	            setTimeout(function (d) {
	            	fn && fn();
	                _this.clear();
	                _self.myScroll.refresh();
	            }, 1000);
	            // 关闭上拉
	            _self.pullUp.close();
	        }
	    };

		_self.pullUp = {
			parent:  _self.wraper.querySelector(".iscroll"),
			el: _self.wraper.querySelector(".load_more"),
			locked: false,	 //关闭上拉事件
			static: function (d) {
				this.el.innerHTML = " ↑ 上拉加载";
			},
			move: function (d) {
				this.el.innerHTML = " ↓ 释放立即加载";
			},
			loading:function (d) {
				this.parent.style.top = -50+"px";
				this.el.innerHTML = " 正在加载 ";
				unions.addClass(this.el, "loading");
			},
			finish: function (fn) {
				unions.removeClass(this.el , "loading"  );
				this.el.innerHTML = " 加载成功 ";

				var _this = this;
	            setTimeout(function (d) {
	            	fn && fn();
	                _this.clear();
	                _self.myScroll.refresh();
	            }, 1000);
			},
			clear:function (d) {
				this.static();
				unions.removeClass(this.el , "loading");
				this.parent.style.top = "0";
			},
			error: function ( fn ) {

			    unions.removeClass(this.el , "loading"  );
			    this.el.innerHTML = " 加载失败 ";
			    var _this = this;
			    setTimeout(function (d) {
			    	fn && fn();
			        _this.clear();
			        _self.myScroll.refresh();
			    }, 1000);
			},
			close:function (d) {
				this.el.innerHTML = " 没有数据了 ";
				unions.removeClass(this.el, "loading"  );
				this.locked = true;
			}
		};

		// 兼容pc使用
		if (unions.isMobile()  ) {
			_self.wraper.addEventListener("touchend", clickEnd);
		} else {
			_self.myScroll.on("scrollEnd", clickEnd);
		}

		function clickEnd(d) {
			// 下拉刷新
			if (_self.state === "refresh") {
				_self.state = "busying";
				_self.prevState = "refresh";
				//清空所有状态
				_self.pullDown.loading();
				// 用户回调
				_self._user_pullDown && _self._user_pullDown();
			}
			// 上啦加载
			if (_self.state === "loadMore") {
				_self.state = "busying";
				_self.prevState = "loadMore";
				//console.log( "上拉" );

				_self.pullUp.loading();
				// 用户回调
				_self._user_pullUp && _self._user_pullUp();
			}

			setTimeout( function (d) {
				_self.state = "leisure";
			},2000);
		}

		_self.myScroll.on("scroll", function () {
			// console.log(this.y);
			//console.log( this.maxScrollY - this.y )
			// 下拉
			if ( _self.state === "leisure" && this.y >= 50) {
				_self.state = "refresh";
				_self.pullDown.move();
			}

			// 取消下拉
			if (  _self.state === "refresh" && this.y < 50 ) {
				_self.state = "leisure";
				_self.pullDown.static();
			}

			if (!_self.pullUp.locked) {
				// 上拉
				if ( _self.state === "leisure" && this.maxScrollY - this.y > 50 ) {
					_self.state = "loadMore";
					_self.pullUp.move();
				}
				// 取消上拉
				if ( _self.state === "loadMore" && this.maxScrollY - this.y < 50 ) {
					_self.state = "leisure";
					_self.pullUp.static();
				}
			}
		});
	}
	UpDownLoad.prototype = {
		// 綁定事件
		// _user_pullDown : 下拉事件
		// _user_pullUp : 上拉事件
		on: function(name , fn){
			var That = this;
			this["_user_"+name] = fn;
			return this;
		},
		//加载成功
		success :function ( fn ){
			if (this.prevState === "refresh" || !this.prevState ) {
				this.pullDown.finish(fn);
				return ;
			}
			if (this.prevState === "loadMore") {
				this.pullUp.finish(fn);
				return;
			}
		},
		error:function (fn) {
			if (this.prevState === "loadMore" ) {
				this.pullUp.error(fn);
			} else{
				this.pullDown.error(fn);
			}
		}
	};

	// UpDownLoad.unions = unions;

	if ( typeof module != 'undefined' && module.exports ) {
		module.exports = UpDownLoad;
	} else if ( typeof define == 'function' && define.amd ) {
	        define( function () { return UpDownLoad; } );
	} else {
		window.UpDownLoad = UpDownLoad;
	}

})(window, document, Math);