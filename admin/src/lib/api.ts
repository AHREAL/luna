import axios from 'axios'

export const getBlogList = () => axios.get('/api/blog_list')

export const getBlogDetail = () => axios.get('/api/blog_detail')
