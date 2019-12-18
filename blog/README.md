## 回顾
### MongoDB数据库

### mongoose
### Promise
解决回调地狱
## 一、项目结构
### 1.package.json   
npm init -f
### 2.reademe ,.gitignore
### 3.安装express mongoose
### 4.新建public公共资源文件夹
img,css,js
### 5.app.js
#### path模块:http://nodejs.cn/api/path.html#path_path_dirname_path
#### __dirname和__filename(推荐与path.join配合使用)
动态获取当前模块/文件所在的绝对路径
不受执行node命令所属路径影响

在文件操作中，使用相对路径是不可靠的，因为在Node中文件操作的路径被设计为相对于
执行node命令所处的路径
所以为了解决这个问题，只需要把相对路径变为绝对路径就可以了，但是如果项目迁移了，就很不方便了
所以最后我们可以使用__dirname或者 __filename来解决问题

## 二、模板引擎
先安装，再把基础代码写上

### 2.1 将公共模块独立出来
#### 子模板：  {{include './header.html'}}
模板继承：

#### 建立模板
{{extend './layout.html'}}
{{block 'content'}} 默认内容 {{/block}}

使用模板时的格式一样
{{extend './layout.html'}} {{block 'content'}}

<div>
    <h1>index 页面填坑内容</h1>
</div>
{{/block}}

#### 在模板中引入样式和js文件：jquery，bootstrap
#### 给css和js资源也留一个待填的”坑“,用于不同页面引用自己的样式和js

## 三、路由设计

| 路径      | 方法 | get参数 | post参数                | 是否需要登录 | 备注         |
| --------- | ---- | ------- | ----------------------- | ------------ | ------------ |
| /         | GET  |         |                         |              | 渲染首页     |
| /register | GET  |         |                         |              | 渲染注册页面 |
| /register | POST |         | email,nickname,password |              | 处理注册请求 |
| /login    | GET  |         |                         |              | 渲染登录首页 |
| /login    | POST |         | email,password          |              | 处理登录请求 |
| /logout   | GET  |         |                         |              | 处理退出请求 |

### 3.1 编写路由

...

处理注册页面，配置body-parser

## 四、设计用户数据模型

models>

user.js



## 五、处理注册请求
### 5.1.获取表单提交的数据
通过req.body
### 5.2.操作数据库
#### 5.2.1 判断该用户是否存在（邮箱和昵称不能重复，但是二者是单独判断的）：findOne
当条件是“或关系”时，将或关系的条件分别放在对象中
然后将条件对象放在数组中作为$or的值。
```javascript
$or: [{
            email: req.body.email
        }, {
            nickname: req.body.nickname
        }]
```
#### 5.2.2 如果已存在，不允许注册
因为前端通过ajax异步请求，请求数据的格式是json，
所以后端需要传递一个json对象给前端

express提供了一个响应方法：json
该方法接收一个对象作为参数，它会
自动帮你把对象转化为字符串再发送给浏览器
```javascript
res.status(200).json({
            success: true
        })
```
```javascript
 function(err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
        if (data) {
            //邮箱或昵称已存在
            return res.status(200).json({
                success: false,
                message: 'email or nickname is already exists'
            })
        }
 }
```

#### 5.2.3 如果不存在，允许注册
```javascript
new User(body, function(err, data) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error'
                })
            }
            res.status(200).json({
            success: true,
            message: 'ok'
        })
        })
       
```
+ 尝试注册出错：
ValidationError: Product validation failed: age: Path `nickname` is required.
果然，在初始化设计数据表的时候我nickname写成nike那么了，这种错误很有可能就是
设计数据表的时候出错了

+ 在返回信息中添加错误码err_code
便于前端判断并给出不同的响应
```javascript
if (err_code === 0) {
    window.location.href = '/'
} else if (err_code === 1) {
    window.alert('邮箱已存在！')
}
...
```
### 5.3.发送响应
安装md5:npm install blueimp-md5
对密码进行md5重复加密
```javascript 
body.password = md5(md5(body.password))
```
### 5.4 使用新的异步方法来实现注册业务
async function:异步函数
await 等待后面的异步函数结束后才能执行下一个异步函数
```javascript
router.post('/register', async function(req, res) {
    var body = req.body
    try {
        if (await User.findOne({ email: body.email })) {
            return res.status(200).json({
                err_code: 1,
                message: 'email is already exits.'
            })
        }
        if (await User.findOne({ email: body.nickname })) {
            return res.status(200).json({
                err_code: 2,
                message: 'nickname is already exits.'
            })
        }
        // 对密码进行md5重复加密
        body.password = md5(md5(body.password))

        // 创建用户，执行注册
        await new User(body).save()

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })

    } catch (err) {
        return res.status(500).json({
            err_code: 500,
            message: 'Server error'
        })
    }
})
```
### 5.5 表单的同步提交和异步提交
表单具有默认的提交行为，默认是同步的，同步表单提交，浏览器会锁死（转圈儿）等待服务端的响应结果。
ajax没有出现之前：表单的同步提交之后，无论服务端响应的是什么，都会直接把响应的结果覆盖掉当前页面。
提示和表单不在同一个页面

后端处理完数据后再重定向到当前页面并把提示和已经填写的数据渲染到页面上
这种方式安全但是很耗服务器

现在做的是前后端混合，但更推荐前后端分离

### 5.6 客户端重定向针对异步请求无效
```javascript
 window.location.href = '/'
```
## 六、通过Session保存登陆状态
Express需要使用第三方中间件：
express-session来支持Session和Cookie的使用
1.安装，
2.配置(一定要在app.use(router)之前)
https://www.npmjs.com/package/express-session
3.使用
当把这个插件配置好之后，我们就可以通过req.session 来访问和设置Session成员
添加Session数据:req.session.foo='bar'
访问Session数据:req.session.foo

```javascript
//注册成功，使用session记录用户登陆状态
req.session.user = user;
//获取session中的用户
res.render('index.html', {
        user: req.session.user
    })
```
bug:无法获取到session信息，无法打印信息
提示：默认session数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境
会把Session进行持久化存储
## 七、处理完成登录功能
## 八、处理完成退出功能
