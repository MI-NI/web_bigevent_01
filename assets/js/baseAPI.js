// 每次调用$.get() $.post() $.ajax()的时侯
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 再发起正真的Ajax请求之前，统一拼接·的跟陆劲
    options.url = "http://ajax.frontend.itheima.net" + options.url
})