<template>
  <div class="upload-container">
    <input type="file" @change="handleFileSelect" />
    <div v-if="selectedFile" class="file-info">
      <p>文件名: {{ selectedFile.name }}</p>
      <p>文件大小: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
    </div>
    <button @click="handleUpload" :disabled="!selectedFile">上传文件</button>
    <div v-if="uploadProgress > 0" class="progress">
      <div class="progress-bar" :style="{ width: uploadProgress + '%' }">
        {{ uploadProgress }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const uploadProgress = ref(0)
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB per chunk

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
  uploadProgress.value = 0
}

const createFileChunk = (file, size = CHUNK_SIZE) => {
  const chunks = []
  let cur = 0
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + size))
    cur += size
  }
  return chunks
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  const chunks = createFileChunk(selectedFile.value)
  console.log(`文件被分成了 ${chunks.length} 个分片`)
  
}
</script>

<style scoped>
.upload-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.file-info {
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.progress {
  margin-top: 20px;
  width: 100%;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  text-align: center;
  line-height: 20px;
  color: white;
  transition: width 0.3s ease;
}
</style> 