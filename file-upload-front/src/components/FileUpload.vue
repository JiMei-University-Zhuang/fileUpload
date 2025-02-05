<template>
  <div class="upload-container">
    <input type="file" @change="handleFileSelect" />
    <div v-if="selectedFile" class="file-info">
      <p>文件名: {{ selectedFile.name }}</p>
      <p>文件大小: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
    </div>
    <button @click="handleUpload" :disabled="!selectedFile || uploading">
      {{ uploading ? '上传中...' : '上传文件' }}
    </button>
    <div v-if="uploadProgress > 0" class="progress">
      <div class="progress-bar" :style="{ width: uploadProgress + '%' }">
        {{ uploadProgress }}%
      </div>
    </div>
    <div v-if="uploadStatus" :class="['status', uploadStatus.type]">
      {{ uploadStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const uploadProgress = ref(0)
const uploading = ref(false)
const uploadStatus = ref(null)
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB per chunk

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
  uploadProgress.value = 0
  uploadStatus.value = null
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

const uploadChunk = async (chunk, index) => {
  const formData = new FormData()
  formData.append('chunk', chunk)
  formData.append('index', index)
  formData.append('filename', selectedFile.value.name)

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    console.error('上传分片失败:', error)
    throw error
  }
}

const mergeFile = async (filename, totalChunks) => {
  try {
    const response = await fetch('http://localhost:3000/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename,
        totalChunks
      })
    })
    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    console.error('合并文件失败:', error)
    throw error
  }
}

const handleUpload = async () => {
  if (!selectedFile.value || uploading.value) return
  
  uploading.value = true
  uploadStatus.value = null
  
  try {
    const chunks = createFileChunk(selectedFile.value)
    const totalChunks = chunks.length
    
    // 上传所有分片
    for (let i = 0; i < chunks.length; i++) {
      await uploadChunk(chunks[i], i)
      uploadProgress.value = Math.round(((i + 1) / totalChunks) * 90) // 预留10%给合并进度
    }
    
    // 请求合并文件
    uploadStatus.value = { type: 'info', message: '正在合并文件...' }
    await mergeFile(selectedFile.value.name, totalChunks)
    
    uploadProgress.value = 100
    uploadStatus.value = { type: 'success', message: '文件上传成功！' }
  } catch (error) {
    console.error('上传失败:', error)
    uploadStatus.value = { type: 'error', message: `上传失败: ${error.message}` }
    uploadProgress.value = 0
  } finally {
    uploading.value = false
  }
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

.status {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.status.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.status.error {
  background-color: #f2dede;
  color: #a94442;
}

.status.info {
  background-color: #d9edf7;
  color: #31708f;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 