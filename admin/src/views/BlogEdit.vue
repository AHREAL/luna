<template>
    <div>
        编辑页
        {{ isEdit }}
    </div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { getBlogDetail } from '../lib/http'

const route = useRoute()
const isEdit = ref(false)
const blogInfo = ref({})

onMounted(() => {
    console.log(route.query)
    const id = route.query.id
    if (id) {
        isEdit.value = true
    } else {
        isEdit.value = false
    }
})

const getData = (id) => {
    if (!id) return
    getBlogDetail({})
}
</script>
    
<style></style>