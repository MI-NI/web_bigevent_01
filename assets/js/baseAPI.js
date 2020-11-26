// 每次调用$.get() $.post() $.ajax()的时侯
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 1.再发起正真的Ajax请求之前，统一拼接·的跟陆劲
    options.url = "http://ajax.frontend.itheima.net" + options.url
        // 2.对需要权限的接口配置头信息
        // 必须my开头才行
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 3.登录拦截
    // 发送请求，无论失败成功都会有一次回调函数--complete
    options.complete = function(res) {
        // 请求失败，而且是是否认证失败，就进行强制跳转和销毁token
        if (res.responseJSON.status !== 0 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})