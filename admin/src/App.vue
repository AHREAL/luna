
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderBar />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <SideMenu />
        </el-aside>
        <el-container>
          <el-main>
            <RouterView />
          </el-main>
          <el-footer>Copyright © 2023 Create by 🏃🏻‍♀️赶时间的人</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeadBar.vue';
import SideMenu from './components/SideMenu.vue';
import { RouterView } from 'vue-router'
</script>


<style scoped>
.common-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: gray;
}
</style>
