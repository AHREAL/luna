<template>
    <el-menu class="el-menu-vertical">
        <el-menu-item index="1" @click="toMenu('/blog-list')">
            <el-icon>
                <Document />
            </el-icon>
            <span>博客列表</span>
        </el-menu-item>
        <el-menu-item index="2">
            <el-icon>
                <Edit />
            </el-icon>
            <span>写作</span>
        </el-menu-item>
    </el-menu>
</template>
  
<script lang="ts" setup>
import {
    Edit,
    Document
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toMenu = (key) => {
    router.push(key)
}
</script>
<style scoped>
.el-menu-vertical {
    height: 100%;
}
</style>
  