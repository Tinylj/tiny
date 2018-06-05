

var defineProperty = function(obj,key,val)
{
    Object.defineProperty(obj,key,{
        get: function () {
            return val;
        },
        set: function (newVal) {
            if(val == newVal) return;
            val = newVal;
        }
    });
};
var observe = function(obj)
{
    Object.keys(obj).forEach(function(key)
    {
        defineProperty(obj,key,obj[key]);
    });
};
//发布者函数
var publisher = function()
{
    this.watchers = [];//订阅该发布者的订阅者
};
publisher.prototype = {
  addWatcher:function(param){ //增加订阅者
      this.watchers.add(param);
  },
  removeWatcher:function(param){ //删除订阅者

  },
  publish:function()
  {
    //发布功能
  }
};
var watcher = function(node,vm)
{

};
//编译节点
var compile = function(node,vm,publisher)
{
    var reg = /\{\{(.*)\}\}/;
    if(node.nodeType === 1) //节点类型为元素
    {
        var attr = node.attributes;
        for(var i= 0;i< attr.length;i++)
        {
            if(attr[i].nodeName == "t-model")
            {
                var name = attr[i].nodeValue;
                node.addEventListener("input",function (e) {
                   vm.data[name] = e.target.value;
                });
                node.value = vm.data[name];
                node.removeAttribute("t-model");
            }
        }
    }
    if(node.nodeType === 3)//节点类型为text
    {
        if(reg.test(node.nodeValue))
        {
            var name = RegExp.$1;
            name = name.trim();
            node.nodeValue = vm.data[name];
        }
    }
    var watcher = new watcher(node,vm)
    publisher.addWatcher(watcher);
};
//劫持节点
var nodeFragment = function(id,vm,publisher)
{
    var frag = document.createDocumentFragment(); // documentFragment 对象可以劫持 DOM结构。加入documentFragment的Node将自动从DOM中删除
    var app = document.getElementById(id);
    var child;
    while (child = app.firstChild)
    {
        compile(child,vm,publisher);
        frag.appendChild(child);
    }
    return frag;
};
//初始化
var tiny = function(param)
{
    this.data = param.data;
    observe(this.data);
    var id = param.ele;
    var dom = nodeFragment(id,this,mypublisher);
    document.getElementById(id).appendChild(dom);
    var mypublisher = new publisher();
};
