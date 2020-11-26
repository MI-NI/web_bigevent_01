$(function() {
        // 1.获取渲染
        getuserInof();
        // 2.点击退出
        var layer = layui.layer
        $('#btnLogout').on('click', function() {
                layer.confirm('确定是否退出登录?', { icon: 3, title: '提示' }, function(index) {
                    //do something
                    // 清空本地存储
                    localStorage.removeItem('token')
                        // 跳转到login,html
                    location.href = "/login.html"
                        // 关闭询问框
                    layer.close(index);
                });
            })
            // 3登录拦截，优化到了BaseApi.js

    })
    // 封装一个获取信息的函数
    // 一定要写在入口函数外面，因为别的页面也要调用，写入入口函数就是局部函数
function getuserInof() {
    // 发送Ajax
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers,请求头---这里写请求头是因为，这里右权限，看说明文档
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功。渲染用户头像信息
            renderAvatar(res.data)
        }
    })
}
// 渲染项和名字
function renderAvatar(user) {
    // 1.用户名，有昵称就显示，没有就显示username
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 2.开始渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').html(text).show()
    }
}