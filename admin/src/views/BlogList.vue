<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="updated" label="更新时间" />
            <el-table-column prop="date" label="创建时间" />
            <el-table-column prop="action" label="操作">
                <template #default="scope">
                    <el-button plain @click="toEdit(scope.row)">编辑</el-button>
                    <el-button type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
    
<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { getBlogList } from '../lib/http'
import { onMounted, ref } from 'vue';

const Router = useRouter()
const tableData = ref([])

onMounted(() => {
    getBlogList().then(res => {
        console.log(res)
        tableData.value = res.data.data
    })
})


const toEdit = (record: { id: string }) => {
    Router.push(`/blog-edit?id=${record.id}`)
}

</script>
    
<style></style>