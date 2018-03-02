/*
 * author:wenxiang wu
 * functionality:动态建立树选择框
 * date:2016-7-20
 */

/**
 * treeId:树的id
 * inputSelectId:树选择框id
 * inputSelectName:树选择框name
 * param:参数
 * url:action地址
 * callback:初始化树回调函数 
 * clickCallback:点击节点回调函数 
 */
function CreateTree(treeId,inputSelectId,inputSelectName,param,url,callback,clickCallback){
	this.data = null;//源数据
	this.treeId = treeId;
	this.inputSelectId = inputSelectId;
	this.inputSelectName = inputSelectName;
	this.param = param;
	this.url = url;
	this._init(callback,clickCallback);
}

/**
 * 初始化插件
 * callback:初始化树回调函数 
 * clickCallback:点击节点回调函数 
 */
CreateTree.prototype._init = function(callback,clickCallback){
	var that = this;
	that.dispose();
	that.createTree();
	that.loadData(function(){
		that.buildTree(function(){
			if (clickCallback != null){//点击节点回调函数 
				clickCallback();
			}	
		});	
		if (callback != null){//初始化树回调函数 
			callback();
		}			
	});
	that.clickTreeInput();
	that.clickTreeOtherArea();
};

/**
 * 销毁树对象
 */
CreateTree.prototype.dispose = function(){
	var that = this;
	$('#'+that.treeId).remove();
};

/**
 * 动态建立树选择框所需的dom节点
 */
CreateTree.prototype.createTree = function(){
	var that = this;
	$('#'+that.inputSelectName).after('<div id="'+that.treeId+'" class="treediv"></div>');
};

/**
 * 从后台获取树的数据
 */
CreateTree.prototype.loadData = function(callback){
	var that = this;
	/*$.ajax({
		type:'post',
		url:that.url,
		dataType:'json',
		async:true,
		data:that.param,
		success:function(data){// 请求成功处理
			that.data = data;
			callback();
		},
		error:function(){// 请求出错处理
			
		}
	});*/
	var tree_data = [
			         {
			        	 'text': '国家',
			        	 'id': -1,
			        	 'type': 'country',
			        	 'grade': '1',
			        	 'state': {
			        		 'opened': true,
			        		 'disabled': true
			        		 //'selected': true,
  	            		     //'loaded': true
			        	 },
			        	 'children': [
			        	              {
			        	            	  'text': '福建',
			        	            	  'id': 1,
			        	            	  'type': 'province',
			        	            	  'grade': '2'
			        	              },
			        	              {
			        	            	  'text': '四川',
			        	            	  'id': 2,
			        	            	  'type': 'province',
			        	            	  'grade': '2',
			        	            	  'children': [
			        	            	               {
			        	            	            	   'text': '成都',
			        	            	            	   'id': 21,
			        	            	            	   'type': 'city',
			        	            	            	   'grade': '3'
			        	            	               }
			        	            	               ]
			        	              },
			        	              {
			        	            	  'text': '广东',
			        	            	  'id': 3,
			        	            	  'type': 'province',
			        	            	  'grade': '2'
			        	              }
			        	              ]
			         }
			         ];
	that.data = tree_data;
	callback();
};

/**
 * 使用jstree插件建立树
 */
CreateTree.prototype.buildTree = function(clickCallback){
	var that = this;

	//加载树
	$('#'+that.treeId)
	/*.bind('loaded.jstree', function (e, data) {// 展开树
		$('#'+that.treeId).jstree('open_all');
	})*/
	.jstree({
		'core': {
			'data': that.data
		},
		'plugins' : [ 'types' ],
		'types': {
			'default': {
				'icon': ''
			},
			'country': {
				'icon': 'icon_country'
			},
			'province': {
				'icon': 'icon_province'
			},
			'city': {
				'icon': 'icon_city'
			},
			'unit': {
				'icon': 'icon_unit'
			},
			'inverter': {
				'icon': 'icon_inverter'
			},
			'junctionBox': {
				'icon': 'icon_junctionBox'
			}
		}
	})
	.bind('click.jstree', function(event) {//单击事件 (节点的图标和文字)
		var eventNodeId, nodeId,//节点id
    		eventNodeName,//节点名称
    		eventNextSiblingNode;//子节点(若是叶子节点该值为null)
    	var isDisabled = false;//是否置灰
    	
    	eventNodeId = ((event.target.id==undefined || event.target.id=='')? event.target.parentNode.id : event.target.id);
    	eventNodeName = ((event.target.text==undefined || event.target.text=='') ? event.target.parentNode.text : event.target.text);
    	nodeId = eventNodeId.substring(0, eventNodeId.indexOf('_'));
    	eventNextSiblingNode= event.target.nextSibling;
        
        if(typeof(event.target.parentNode.text) !== 'undefined' && event.target.id === ''){//单击节点的图标
        	if(event.target.parentNode.className.indexOf('jstree-disabled') > -1){//判断是否置灰
        		isDisabled = true;
        	}
        }else{
        	if(event.target.className.indexOf('jstree-disabled') > -1){//判断是否置灰
        		isDisabled = true;
        	}
        }
        
        if(!isDisabled && typeof(eventNodeName) !== 'undefined'){//没有置灰且点击节点的图标和文字
        	that.setValue(nodeId,eventNodeName);//赋值
        	clickCallback();
        }
    });
};

/**
 * 获取树的所有节点数据
 */
CreateTree.prototype.getTreeNodes = function(){
    var that = this;
   	return that.data;
};

/**
 * 选中树的节点
 * @param id  节点id
 */
CreateTree.prototype.setSelNode = function(id){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		var node = $('#'+that.treeId).jstree("get_node", $('#'+id+'_anchor'));
		$('#'+that.treeId).jstree('select_node', node);
		that.setValue(id,node.text);
	}else{//树加载中
		window.setTimeout(function(){
			that.setSelNode(id);
		},100);
	}
	
};

/**
 * 将树的值设置到相应的树选择框中
 * @param id  节点id
 * @param name  节点名称
 */
CreateTree.prototype.setValue = function(id,name){
	var that = this;
	$('#'+that.inputSelectId).val(id);
	$('#'+that.inputSelectName).val(name);
	$("#"+that.treeId).hide();
};

/**
 * 点击树选择框的事件（自适应树的位置）
 */
CreateTree.prototype.clickTreeInput = function(){
	var that = this;
	$('#'+that.inputSelectName).click(function (){
		$('#'+that.treeId).css('position', 'absolute').css('z-index',1)
		.css('left', $('#'+that.inputSelectName).position().left + 0 + 'px')
		.css('top', $('#'+that.inputSelectName).position().top + $('#'+that.inputSelectName).outerHeight() + 'px')
		.css('width', $('#'+that.inputSelectName).outerWidth() - 2 + 'px')
		.show();
	});
};

/**
 * 当点击tree树其他区域，关闭区域树选择框
 */
CreateTree.prototype.clickTreeOtherArea = function(){
	var that = this;
	$(document).click(function(e){
	     var is = that.checkIn(e);
	     if(!is){
	    	 $('#'+that.treeId).hide();
	     }
	 });
};

/**
 * 判断点击事件是否发生在tree的div所在区域
 * @param e
 * @returns {Boolean}
 */
CreateTree.prototype.checkIn = function(event){
	var that = this;
	var e = window.event || event, // 兼容IE7
    obj = $(e.srcElement || e.target);
    if ($(obj).is('#'+that.inputSelectName+',#'+that.treeId+',#'+that.treeId+' *')) { 
       return true;
    } else {     
       return false;
    } 
};

/**
 * 展开树所有节点
 */
CreateTree.prototype.openAll = function(){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		$('#'+that.treeId).jstree('open_all');
	}else{//树加载中
		window.setTimeout(function(){
			that.openAll();
		},100);
	}
};

/**
 * 关闭树所有节点
 */
CreateTree.prototype.closeAll = function(){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		$('#'+that.treeId).jstree('close_all');
	}else{//树加载中
		window.setTimeout(function(){
			that.closeAll();
		},100);
	}
};

/**
 * 置灰节点
 */
CreateTree.prototype.disableNode = function(id){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		var node = $('#'+that.treeId).jstree("get_node", $('#'+id+'_anchor'));
		$('#'+that.treeId).jstree('disable_node',node);
	}else{//树加载中
		window.setTimeout(function(){
			that.disableNode(id);
		},100);
	}
};

/**
 * 恢复节点(置灰)
 */
CreateTree.prototype.enableNode = function(id){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		var node = $('#'+that.treeId).jstree("get_node", $('#'+id+'_anchor'));
		$('#'+that.treeId).jstree('enable_node',node);
	}else{//树加载中
		window.setTimeout(function(){
			that.enableNode(id);
		},100);
	}
};