var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')
var router = express.Router()

router.get('/', function(req, res) {
    console.log(req.session.user + "11")
    res.render('index.html')
})
router.get('/login', function(req, res) {
    res.render('login.html')
})
router.get('/logout', function(req, res) {
    //清除登录状态
    req.session.user = null
        //重定向到登录页面
    res.redirect('login.html')
})
router.post('/login', async function(req, res) {
    //1.获取表单提交的数据
    //2.操作数据库
    // 判断该用户email是否存在：如果已存在，判断密码是否正确
    // 如果不存在，提示用户不存在，请注册账号
    //3.发送响应
    var body = req.body
    try {
        if (!await User.findOne({
                email: body.email,
                password: md5(md5(body.password))
            })) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or password is invalid.'
            })
        }
        req.session.user = user
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
router.get('/register', function(req, res) {
    res.render('register.html')
})
router.post('/register', function(req, res) {
        //1.获取表单提交的数据
        //2.操作数据库
        // 判断该用户是否存在：如果已存在，不允许注册
        // 如果不存在，允许注册
        //3.发送响应
        var body = req.body
        User.findOne({
            $or: [{
                email: body.email
            }, {
                nickname: body.nickname
            }]
        }, function(err, data) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Server error'
                })
            }
            if (data) {
                //邮箱或昵称已存在
                return res.status(200).json({
                    err_code: 1,
                    message: 'Email or nickname is already exists'
                })
            }
            //对密码进行md5重复加密
            body.password = md5(md5(body.password))
            new User(body).save(function(err, user) {
                if (err) {
                    return res.status(500).json({
                        err_code: 500,
                        message: 'Server error'
                    })
                }
                //注册成功，使用session记录用户登陆状态
                req.session.user = user
                res.status(200).json({
                    err_code: 0,
                    message: 'Ok'
                })
            })

        })
    })
    // router.post('/register', async function(req, res) {
    //     var body = req.body
    //     try {
    //         if (await User.findOne({ email: body.email })) {
    //             return res.status(200).json({
    //                 err_code: 1,
    //                 message: 'email is already exits.'
    //             })
    //         }
    //         if (await User.findOne({ email: body.nickname })) {
    //             return res.status(200).json({
    //                 err_code: 2,
    //                 message: 'nickname is already exits.'
    //             })
    //         }
    //         // 对密码进行md5重复加密
    //         body.password = md5(md5(body.password))

//         // 创建用户，执行注册
//         await new User(body).save()

//         res.status(200).json({
//             err_code: 0,
//             message: 'Ok'
//         })

//     } catch (err) {
//         return res.status(500).json({
//             err_code: 500,
//             message: 'Server error'
//         })
//     }
// })
module.exports = router