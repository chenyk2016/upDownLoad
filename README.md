# Updownload

## 基于iSroll 5.0实现的上拉加载和下拉刷新

1.创建实例

	var myRefresh = new UpDownLoad( "#iscroll_wrap" );

2.绑定事件 

	myRefresh.on("pullDown", function (d) {
		// 下拉事件触发行为
		myRefresh.success(function (d) {
			// 刷新成功后执行
		});
		myRefresh.error(function (d) {
			// 刷新失败后执行
		});
	}).on("pullUp",function (d) {
		// 上拉事件触发行为
		myRefresh.success(function (d) {
			// 上拉成功后执行	
		});
		myRefresh.error(function (d) {
			// 上拉失败后执行
		});
	});

>>上拉和下拉都有两个状态

	myRefresh.success(fn);
	myRefresh.error(fn);

>>为了显示成功状态之前执行刷新DOM，需要将操作DOM的行为放在回调里执行。

