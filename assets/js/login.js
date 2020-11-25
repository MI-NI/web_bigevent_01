$(function() {
    // 1.点击登录和注册相互切换
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    // 2.自定义验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码验证规则,value是再次确认密码的值
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return "两次输入不一样"
            }
        }
    })

    // 3.注册功能
    var layer = layui.layer
    $('#form_reg').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 发送请求
        $.ajax({
            method: 'POST',
            url: "http:/api/reguser",
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，注册成功')
                $('#link_login').click();
                // 清空表单中所有恶的val()
                $('#form_reg')[0].reset()
            }
        })
    })

    // 4.登录功能
    $('#form-login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: "/api/login",
            //快速获取到表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 把渠道的token值保存到本地
                localStorage.setItem('token', res.token)
                    // 跳转到index.html1
                location.href = '/index.html'
            }
        })
    })
})