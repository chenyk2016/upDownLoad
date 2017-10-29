# Updownload

## 基于iSroll 5.0实现的上拉加载和下拉刷新
[演示地址]（https://chenyk2016.github.io/upDownLoad/demo.html）

### 1.建立html

	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>下拉刷新，上拉加载</title>
	</head>
	<body>
	<h2>IScroll上拉加载下拉刷新</h2>
	<div class="iscroll_wrap" id="iscroll_wrap">
		<div class="iscroll">
			<!-- 方案列表 -->
			<div class="task_wrap" >
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
			</div>
		</div>
	</div>
	</body>
	</html>

>两个容器iscroll_wrap和iscroll；
iscroll为滚动元素，iscroll_wrap为固定大小的容器。
可以在iscroll新建列表

### 2.样式和图片

	<style type="text/css">
		*{ padding: 0;margin: 0; }
		h2{ text-align: center; border-bottom: 1px solid #ccc; height: 40px; background-color: #eee; }
		.iscroll_wrap { position: absolute; top: 40px; bottom: 0; width: 100%; background-color: #ccc; overflow: hidden; }
		/* min-height: 101%; 是避免内容高度小于.iscroll_wrap 的高度时，无法使用iScroll*/
		.iscroll { position: absolute; top: 0; left: 0; width: 100%; min-height: 101%; background-color: #fff; }
		.iscroll .loading { background: url(./img/loading.gif) no-repeat left center; padding-left: 30px; }
	</style>

>注：
iscroll的min-height: 101%; 是避免内容高度小于.iscroll_wrap的高度时，无法使用iScroll

### 3.引入js文件

	<script src="iscroll-probe.js"></script>
	<script src="./js/updownload.js"></script>
	<script type="text/javascript">
		// 1.创建实例
		var myRefresh = new UpDownLoad( "#iscroll_wrap" );
		// 2.绑定事件 
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

	</script>


>>注意：
上拉和下拉都有两个状态。为了显示成功状态之前执行刷新DOM，需要将操作DOM的行为放在回调里执行。

	myRefresh.success(fn);
	myRefresh.error(fn);


## 完整演示

	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>下拉刷新，上拉加载</title>

	<style type="text/css">
	*{ padding: 0;margin: 0; }
	h2{ text-align: center; border-bottom: 1px solid #ccc; height: 40px; background-color: #eee; }
	.iscroll_wrap { position: absolute; top: 40px; bottom: 0; width: 100%; background-color: #ccc; overflow: hidden; }
	/* min-height: 101%; 是避免内容高度小于.iscroll_wrap 的高度时，无法使用iScroll*/
	.iscroll { position: absolute; top: 0; left: 0; width: 100%; min-height: 101%; background-color: #fff; }
	.iscroll .loading { background: url(./img/loading.gif) no-repeat left center; padding-left: 30px; }

	</style>
	</head>
	<body>
	<h2>IScroll上拉加载下拉刷新</h2>
	<div class="iscroll_wrap" id="iscroll_wrap">
		<div class="iscroll">

			<!-- 方案列表 -->
			<div class="task_wrap" >
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
				<P>das</P>
			</div>

		</div>
	</div>

	</body>
	<script src="iscroll-probe.js"></script>
	<script src="./js/updownload.js"></script>
	<script type="text/javascript">
		// 使用
		window.onload = function () {
			var myRefresh = new UpDownLoad( "#iscroll_wrap" );
			myRefresh.on("pullDown", function (d) {
				console.log('pullDown');
				// 延时器模拟正在加载效果
				var taskWrap = document.querySelector(".task_wrap");
				taskWrap.innerHTML = "";
				setTimeout(function (res) {
					// 刷新成功后执行
					myRefresh.success(function (d) {
						var taskWrap = document.querySelector(".task_wrap");
						taskWrap.innerHTML = "<p>刷新as</p><p>a刷新s</p><p>刷新as</p><p>as</p><p>as</p><p>as</p><p>as</p><p>as</p><p>as</p><p>as</p>";
						
					});
					// 刷新失败后执行
					// myRefresh.error();
				}, 1000);
				
			} ).on("pullUp", function (d) {
				console.log('pullUp');
				setTimeout(function (res) {
					// 加载成功后执行
					myRefresh.success(function () {
						var taskWrap = document.querySelector(".task_wrap");
						var dom = document.createElement("div");
						dom.innerHTML = "<p>加载</p><p>加载</p><p>加载</p><p>加载</p><p>加载</p><p>加载</p><p>as</p><p>as</p><p>as</p><p>as</p><p>as</p><p>as</p>";
						taskWrap.appendChild(dom);
					});
					// 加载失败后执行
					// myRefresh.error();
				}, 1000);
			});
		};
	</script>
	</html>

## 关注我
>github [https://github.com/chenyk2016]
>博客园 [https://home.cnblogs.com/u/chenykblog/]

