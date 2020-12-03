$(function() {
    // 1获取文章列表信息
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                // 调用模板引擎
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2.为添加类别1绑定点击事件
    var layer = layui.layer
    var indexAdd = null
    $('#btnAdd').on('click', function() {
        // 用框架添加弹出层 
        indexAdd = layer.open({
            type: 1,
            title: '文章类别分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    });

    // 3.添加功能-submit
    // 因为是动态生成二点，所以要事件委托
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您，添加成功');
                //自动关闭弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 4.编辑功能
    var idexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function() {
        // 用框架添加弹出层 
        indexEdit = layer.open({
            type: 1,
            title: '修改文章类别分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取编辑的Id，然后修改相应的
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            method: "GET",
            // 路劲的最后面带/后面是字符串和变量拼接
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    });
    // 5.提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('修改成功')
                layer.close(indexEdit)
            }
        })
    });
    // 6.删除 
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
            function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        initArtCateList();
                        layer.msg('删除成功')
                        layer.close(index);
                    }
                })

            });
    })
})