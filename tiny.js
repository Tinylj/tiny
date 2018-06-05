var obj = {};
Object.defineProperty(obj,"hello",{
    get: function () {
        console.log("get方法被调用了");
    },
    set: function () {
        console.log("set方法被调用了");
    }
});
obj.hello;
obj.hello = "abc";

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


//编译节点
var compile = function(node,vm)
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
};
//劫持节点
var nodeFragment = function(id,vm)
{
    var frag = document.createDocumentFragment(); // documentFragment 对象可以劫持 DOM结构。加入documentFragment的Node将自动从DOM中删除
    var app = document.getElementById(id);
    var child;
    while (child = app.firstChild)
    {
        compile(child,vm);
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
    var dom = nodeFragment(id,this);
    document.getElementById(id).appendChild(dom);
};
