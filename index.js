//导入木块
const express = require('express');
const dbHelper = require('./libs/dbHelper');
// 导入文件上传中间件
const multer = require('multer')
// 设置保存的地址
const upload = multer({
    dest: 'views/imgs/'
})
// 导入path模块
const path = require('path')
//实例化服务器=对象
const app = express()
app.use(express.static('views'))
//开启监听
app.get('/herolist', (req, res) => {
    // console.log(req);

    // 接收数据 页码
    const pagenum = parseInt(req.query.pagenum)
    // 接收数据 页容量
    const pagesize = parseInt(req.query.pagesize)

    // 接收数据 查询条件
    const query = req.query.query
    dbHelper.find('cqlist', {}, (result) => {
        const temArr = result.filter(v => {
            if (v.heroName.indexOf(query) != -1 || v.skillName.indexOf(query) != -1) {
                return true
            }

        })
        // console.log(temArr);

        let list = [];
        const startIndex = (pagenum - 1) * pagesize
        const endIndex = startIndex + pagesize
        // 获取当前这一页的数据
        for (let i = startIndex; i < endIndex; i++) {
            if (temArr[i]) {
                list.push(temArr[i])
            }
        }
        // 获取总页数
        const totalPage = Math.ceil(temArr.length / pagesize)
        // 返回数据
        res.send({
            totalPage,
            list
        })
    })
})
// 路由2 英雄详情
app.get('/heroDetail', (req, res) => {
    // 获取id
    const id = req.query.id
    // 根据id查询数据
    dbHelper.find('cqlist', {
        _id: dbHelper.ObjectId(id)
    }, result => {
        // 返回查询的数据
        res.send(result)
    })
})
//增加英雄
app.post('/heroAdd', upload.single('heroIcon'), (req, res) => {
    const heroName = req.body.heroName
    const skillName = req.body.skillName
    // 图片本地地址 托管静态资源的时候 views已经设置 访问时不需要
    const heroIcon = path.join('imgs', req.file.filename)
    dbHelper.insertOne(
        'cqlist', {
            heroName,
            skillName,
            heroIcon
        },
        result => {
            res.send({
                mode: '200',
                message: '添加成功'
            })
        }
    )
})
//修改英雄
app.post('/heroUpdate', upload.single('heroIcon'), (req, res) => {
    const heroName = req.body.heroName
    const skillName = req.body.skillName
    // 图片本地地址 托管静态资源的时候 views已经设置 访问时不需要
    const heroIcon = path.join('imgs', req.file.filename)
    const id = req.body.id;
    dbHelper.updateOne('cqlist',
    {_id: dbHelper.ObjectId(id)},
     {
        heroName,
        skillName,
        heroIcon,
        
    }, 
    result => {
        res.send({
            code: 'ok',
            msg: '修改成功'
        })
    })
})
//删除英雄
app.get('/heroDelete',(req,res)=>{
    const id=req.query.id;
    dbHelper.deleteOne('cqlist',
    {_id: dbHelper.ObjectId(id)},
    result=>{
        res.send({
            code:'ok',
            msg:'删除成功'
        }
            
        )
    }
    )
})
app.listen(4399)