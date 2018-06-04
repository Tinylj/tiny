var obj = {}
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