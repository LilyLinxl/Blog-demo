var express = require('express')
var path = require('path')
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))
app.get('/', function(req, res) {
    res.render('index.html', {
        name: '张三'
    })
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat', //配置加密字符串，它会在原有加密基础之上和这个字符串拼接起来去加密
    //增加安全性，防止客户端恶意伪造数据
    resave: false,
    saveUninitialized: true, //无论是否使用session，都默认直接分配一把钥匙
    cookie: { secure: true }
}))

app.use(router)

app.listen(4000, function() {
    console.log('running...')
})