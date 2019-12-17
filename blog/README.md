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

models

user.js



五

处理注册请求

安装md5