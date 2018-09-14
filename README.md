# AJ-AJ-AJ
For AJ, for limit shoes, for bonus sale
### 为了突袭发售！！！
1.首先，使用setInterval函数每个1800mm请求一次nike列表页面，读取列表鞋子信息。

2.拿到数据以后，和本地localStorage中存储的上次nikeshoes信息做比对，判断是否有新鞋子发售。

3.如果localStorage中的nikeshoed对象中不当前id，那么向nikeshoes中添加以当前id值作为键名的属性，同时在浏览器弹出对应id的图片。

4.跟新本地localStorage中的nikeshoes信息。

### 目前暂持才用这种比较麻烦的方法，依赖程序持续运行，而且尽能在浏览器中生效
