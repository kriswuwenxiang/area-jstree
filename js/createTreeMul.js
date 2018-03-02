/*
 * author:wenxiang wu
 * functionality:动态建立树选择框(多选)
 * date:2016-7-26
 */

/**
 * treeId:树的id
 * inputSelectId:树选择框id
 * inputSelectName:树选择框name
 * leafGrade:叶子节点的层级
 * param:参数
 * url:action地址
 * callback:初始化树回调函数 
 * clickCallback:点击节点回调函数 
 */
function CreateTreeMul(treeId,inputSelectId,inputSelectName,leafGrade,param,url,callback,clickCallback){
	this.data = null;//源数据
	this.dataOneDimensional = null;//一维json数据
	this.treeId = treeId;
	this.inputSelectId = inputSelectId;
	this.inputSelectName = inputSelectName;
	this.leafGrade = leafGrade;
	this.param = param;
	this.url = url;
	this._init(callback,clickCallback);
}

/**
 * 初始化插件
 * callback:初始化树回调函数 
 * clickCallback:点击节点回调函数 
 */
CreateTreeMul.prototype._init = function(callback,clickCallback){
	var that = this;
	that.dispose();
	that.createTreeMul();
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
CreateTreeMul.prototype.dispose = function(){
	var that = this;
	$('#'+that.treeId).remove();
};

/**
 * 动态建立树选择框所需的dom节点
 */
CreateTreeMul.prototype.createTreeMul = function(){
	var that = this;
	$('#'+that.inputSelectName).after('<div id="'+that.treeId+'" class="treediv"></div>');
};

/**
 * 从后台获取树的数据
 */
CreateTreeMul.prototype.loadData = function(callback){
	var that = this;
	/*$.ajax({
		type:'post',
		url:that.url,
		dataType:'json',
		async:true,
		data:that.param,
		success:function(data){// 请求成功处理
			that.data = data[0];
			that.dataOneDimensional = data[1];
			callback();
		},
		error:function(){// 请求出错处理
			
		}
	});*/
	var tree_data = [
			         {
			        	 'text': '国家',
			        	 'id': -11,
			        	 'type': 'country',
			        	 'grade': '1',
			        	 /*'state': {
			        		 'opened': true,
			        		 'disabled': true
			        		 //'selected': true,
  	            		     //'loaded': true
			        	 },*/
			        	 'children': [
			        	              {
			        	            	  'text': '福建',
			        	            	  'id': 11,
			        	            	  'type': 'province',
			        	            	  /*'state': {
							        		 'selected': true
							        	 },*/
			        	            	  'grade': '2'
			        	              },
			        	              {
			        	            	  'text': '四川',
			        	            	  'id': 12,
			        	            	  'type': 'province',
			        	            	  'grade': '2',
			        	            	  'children': [
			        	            	               {
			        	            	            	   'text': '成都',
			        	            	            	   'id': 121,
			        	            	            	   'type': 'city',
			        	            	            	   'grade': '3'
			        	            	               }
			        	            	               ]
			        	              },
			        	              {
			        	            	  'text': '广东',
			        	            	  'id': 13,
			        	            	  'type': 'province',
			        	            	  'grade': '2',
			        	            	  'children': [
			        	            	               {
			        	            	            	   'text': '广州',
			        	            	            	   'id': 131,
			        	            	            	   'type': 'city',
			        	            	            	   'grade': '3'
			        	            	               },
			        	            	               {
			        	            	            	   'text': '广州2',
			        	            	            	   'id': 132,
			        	            	            	   'type': 'city',
			        	            	            	   'grade': '3'
			        	            	               }
			        	            	               ]
			        	              }
			        	              ]
			         }
			         ];
	var tree_data2 = [
					    {
					        "text": "国家",
					        "id": -11,
					        "type": "country",
					        "grade": "1",
					        "state": {
					            "opened": true,
					            "disabled": true
					        }
					    },
					    {
					        "text": "福建",
					        "id": 11,
					        "type": "province",
					        "state": {
					            "selected": true
					        },
					        "grade": "2"
					    },
					    {
					        "text": "四川",
					        "id": 12,
					        "type": "province",
					        "grade": "2"
					    },
					    {
					        "text": "广东",
					        "id": 13,
					        "type": "province",
					        "grade": "2"
					    },
					    {
					        "text": "成都",
					        "id": 121,
					        "type": "city",
					        "grade": "3"
					    },
					    {
					        "text": "广州",
					        "id": 131,
					        "type": "city",
					        "grade": "3"
					    },
					    {
					        "text": "广州2",
					        "id": 132,
					        "type": "city",
					        "grade": "3"
					    }
					];
	that.data = tree_data;
	that.dataOneDimensional = tree_data2;
	callback();
};

/**
 * 使用jstree插件建立树
 */
CreateTreeMul.prototype.buildTree = function(clickCallback){
	var that = this;

	//加载树
	$('#'+that.treeId)
	.bind('loaded.jstree', function (e, data) {// 展开树
		$('#'+that.treeId).jstree('open_all');
	})
	.jstree({
		'core': {
			'data': that.data
		},
		'plugins' : [ 'types', 'checkbox' ],
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
			},
			'checkbox' : {
				'keep_selected_style' : false
			}
		}
	})
	.bind('click.jstree', function(event) {//单击事件 (节点的图标和文字)
		that.setSelNodeByArray();//根据选中节点赋值到选择框
        clickCallback();
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
 * 根据选中节点赋值到选择框
 */
CreateTreeMul.prototype.setSelNodeByArray = function(){
	var that = this;
	var selNodesArray = $('#'+that.treeId).jstree().get_checked();//选中的所有节点
	var treeDataOneDimensional = that.dataOneDimensional;//所有节点数据
	var treeDataSel = [];
	var selNodesId = '';
	var selNodesText = '';
		
	for(var i=0; i<treeDataOneDimensional.length; i++){//获取选中节点的具体信息(过滤无用节点信息)
		for(var j=0; j<selNodesArray.length; j++){
			if(treeDataOneDimensional[i].id == selNodesArray[j] && treeDataOneDimensional[i].grade == that.leafGrade){
				treeDataSel.push(treeDataOneDimensional[i]);
			}
		}
	}
	for(var i=0; i<treeDataSel.length; i++){
		if(i==0){
		    selNodesId += treeDataSel[i].id;
		    selNodesText += treeDataSel[i].text;
		}else{
		    selNodesId += (","+treeDataSel[i].id);
		    selNodesText += (","+treeDataSel[i].text);
		}
	}

	that.setValue(selNodesId,selNodesText);//赋值
};

/**
 * 选中树的节点
 * @param ids  节点id
 */
CreateTreeMul.prototype.setSelNode = function(ids){
	var that = this;
	if($('#'+that.treeId).text()!='加载中 ...'){//树加载完
		var selNodesArray = [];
		if(typeof(ids) === 'string'){//把参数放到数组中
			selNodesArray = ids.split(',');
		}else{
			selNodesArray = ids.toString().split(',');
		}
		for(var i=0; i<selNodesArray.length; i++){//选中节点
			var node = $('#'+that.treeId).jstree("get_node", $('#'+selNodesArray[i]+'_anchor'));
			$('#'+that.treeId).jstree('select_node', node);
		}

		that.setSelNodeByArray();//根据选中节点赋值到选择框
	}else{//树加载中
		window.setTimeout(function(){
			that.setSelNode(ids);
		},100);
	}
	
};

/**
 * 将树的值设置到相应的树选择框中
 * @param id  节点id
 * @param name  节点名称
 */
CreateTreeMul.prototype.setValue = function(id,name){
	var that = this;
	$('#'+that.inputSelectId).val(id);
	$('#'+that.inputSelectName).val(name);
};

/**
 * 点击树选择框的事件（自适应树的位置）
 */
CreateTreeMul.prototype.clickTreeInput = function(){
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
CreateTreeMul.prototype.clickTreeOtherArea = function(){
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
CreateTreeMul.prototype.checkIn = function(event){
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
CreateTreeMul.prototype.openAll = function(){
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
CreateTreeMul.prototype.closeAll = function(){
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
CreateTreeMul.prototype.disableNode = function(id){
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
CreateTreeMul.prototype.enableNode = function(id){
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