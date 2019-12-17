var express = require('express')
var User = require('./models/user')
var router = express.Router()

router.get('/', function(req, res) {
    res.render('index.html')
})
router.get('/login', function(req, res) {
    res.render('login.html')
})
router.post('/login', function(req, res) {

})
router.get('/register', function(req, res) {
    res.render('register.html')
})
router.post('/register', function(req, res) {
    //1.获取表单提交的数据
    //2.操作数据库
    // 判断该用户是否存在：如果已存在，不允许注册
    // 如果不存在，允许注册
    //3.发送响应
})
module.exports = router