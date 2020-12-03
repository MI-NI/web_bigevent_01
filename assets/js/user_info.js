$(function() {
    // 1.自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度为1 ~ 6位之间"
            }
        }
    });
    initUserInfo()
        // 2.用户渲染
    var layer = layui.layer

    // 封装请求函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                // 第一个值是form的lay-filter
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 3.表单重置
    $('#btnReset').on('click', function(e) {
        // 阻止默认重置
        e.preventDefault();
        // 从新用户渲染
        initUserInfo()
    });
    // 4，修改用户信息-监听表单提交事件
    $('.layui-form').on("submit", function(e) {
        // 阻止默认的表单提交事件
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }
                layer.msg('恭喜您，用户信息修改成功！');
                // 调用父页面中的更新用户信息和头像发法
                // window.parent就是--ifmeam区域
                window.parent.getuserInof();

            }
        })
    })
})