<template>
  <div class="upload-container">
    <input type="file" @change="handleFileSelect" />
    <button @click="handleUpload" :disabled="!selectedFile">上传文件</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const handleUpload = () => {
  if (!selectedFile.value) return
  console.log('准备上传文件:', selectedFile.value.name)
}
</script>

<style scoped>
.upload-container {
  margin: 20px;
}
</style> 