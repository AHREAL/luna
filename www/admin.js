const fs = require('fs')
const path = require('path')
const markdownit = require('markdown-it')()


const getContentById = (id) => {
    return fs.readFileSync(path.resolve(__dirname, '..', 'source', '_posts', id), 'utf-8')
}

const getMateInfo = (content) => {
    let pardata = []
    try {
        pardata = markdownit.parse(content, {})
    } catch (error) {
        console.error('解析markdown出错', error)
        return {}
    }
    const mateStartIndex = pardata.findIndex(i => i.markup === '-' && i.nesting === 1)
    const mateInfoIndex = mateStartIndex + 1
    const mateInfo = {}
    pardata = pardata[mateInfoIndex].children.filter(i => i.type === 'text')

    pardata.forEach(i => {
        const separatorIndex = i.content.indexOf(':')
        const key = i.content.slice(0, separatorIndex)
        const value = ((separatorIndex + 2) > i.content.length) ? '' : i.content.slice(separatorIndex + 2)
        mateInfo[key] = value
    })

    return mateInfo
}

const register = (app) => {
    app.get('/blog_list', (req, res) => {
        const postPath = path.resolve(__dirname, '..', 'source', '_posts')
        // 读取source下下的_posts目录
        const posts = fs.readdirSync(postPath)
        const list = posts.filter((fileName) => {
            if (!fileName.includes('.md')) return false
            return true
        }).map(postTitle => {
            const content = getContentById(postTitle)
            return {
                id: postTitle,
                content: content
            }
        })

        for (let i = 0; i < list.length; i++) {
            const blog = list[i]
            const mateInfo = getMateInfo(blog.content)
            blog.title = mateInfo.title
            blog.date = mateInfo.date
            blog.tags = mateInfo.tags
            blog.categories = mateInfo.categories
            blog.updated = mateInfo.updated
            blog.cover = mateInfo.cover
            blog.top_img = mateInfo.top_img
            blog.description = mateInfo.description
            blog.mateInfo = mateInfo.mateInfo
        }

        res.status(200).send({
            msg: 'success',
            data: list
        })
    })

    app.get('/blog_detail', (req, res) => {
        const { id } = req.query
        const postPath = path.resolve(__dirname, '..', 'source', '_posts', id)
        const postContent = fs.readFileSync(postPath, 'utf-8')
        res.status(200).send({
            msg: 'success',
            data: postContent
        })
    })

    app.post('/blog_save', (req, res) => {
        const { id, content } = req.body
        const postPath = path.resolve(__dirname, '..', 'source', '_posts', id)
        fs.writeFileSync(postPath, content)
        res.status(200).send({
            msg: 'success',
            data: null
        })
    })

    app.post('/blog_delete', (req, res) => {
        const { id } = req.body
        const postPath = path.resolve(__dirname, '..', 'source', '_posts', id)
        fs.unlinkSync(postPath)
        res.status(200).send({
            msg: 'success',
            data: null
        })
    })
}

module.exports = register