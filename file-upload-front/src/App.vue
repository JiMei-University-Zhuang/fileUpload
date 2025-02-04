<script setup>
import FileUpload from './components/FileUpload.vue'
</script>

<template>
  <div>
    <h1>文件分片上传示例</h1>
    <FileUpload />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
