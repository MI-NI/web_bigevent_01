$(function() {
    // 时间过滤器
    template.defaults.imports.dateFormat = function(daStr) {
        var dt = new Date(daStr)

        var n = dt.getFullYear()
        var y = padZero(dt.getMonth() + 1)
        var r = padZero(dt.getDate())

        var s = padZero(dt.getHours())
        var f = padZero(dt.getMinutes())
        var m = padZero(dt.getSeconds())

        return n + '-' + y + '-' + r + ' ' + s + ':' + f + ':' + m
    }

    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1.定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的Id
        state: "", //文章的状态，可选值，预发布，草稿
    }

    // 2.获取列表并渲染
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml)
                    // total就是数据条数，这个来自与文档
                rendPage(res.total)
            }
        });
    }
    // 3.初始化下拉分类
    var form = layui.form
    initCate()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎
                var strHtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strHtml)
                    // 通知layui重新渲染下拉菜单
                form.render()
            }
        });
        // 4.晒选功能
        $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取值
            var state = $('[name=state]').val()
            var cate_id = $('[name=cate_id]').val()
                // 赋值
            q.state = state
            q.cate_id = cate_id
                // 重新渲染
            initTable()
        })
    }

    // 4.分页
    var laypage = layui.laypage

    function rendPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条数据
            curr: q.pagenum, //第几页
            // 分页模块显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 每页显示多少条数据的选择器
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值给q
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //首次不执行
                    // 执行laypage.render有两种方法
                    // 1.点击分页的时侯
                    // 2.渲染列表得到时侯
                    // 所以不判断就会死循环，first是true,!first就是undefind
                    // ！first就是点击的时侯触发
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }
    // 5.删除
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 5.1弹出询问狂
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 5.2发送请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                        //页面汇总删除按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                        // 因为更新成功所以冲i性能渲染
                        initTable()
                    layer.close(index);
                }
            })
        });
    })
})