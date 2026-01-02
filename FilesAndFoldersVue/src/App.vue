<script setup lang="ts">
/**
 * App.vue - Day 1: Just testing Breadcrumbs component
 *
 * We're starting simple - no Pinia yet, just hardcoded data
 * to understand how props work in Vue
 */
import { ref } from 'vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import FilesAndFolders from './components/FilesAndFolders.vue'

// Hardcoded breadcrumb path for testing
// This simulates being in: Handlelister > Oktober
const breadcrumbPath = ref(['Handlelister', 'Oktober'])

// Let's also test what happens with an empty path (root folder)
const emptyPath = ref([])

const testItems = ref([
  { id: 1, name: 'Oktober' },  // folder (no content)
  { id: 2, name: 'notes.txt', content: 'abc' }  // file (has content)
])

function changePath() {
  breadcrumbPath.value = ['Handlelister', 'Oktober', 'Uke 1']
}

function goUpOneLevel () {
  if(breadcrumbPath.value.length > 0) 
    breadcrumbPath.value = breadcrumbPath.value.slice(0, -1)
}

function handleSelected(id: number) {
  console.log('Selected item with id:', id)
}
</script>

<template>
  <main>
    <h1>Filer og mapper - Day 1 Test</h1>

    <h2>Test 1: With breadcrumb path</h2>
    <Breadcrumbs :texts="breadcrumbPath" />

    <h2>Test 2: At root (empty path)</h2>
    <Breadcrumbs :texts="emptyPath" />

    <h2>Test 3: No prop passed at all</h2>
    <Breadcrumbs />

    <button @click="changePath">Forandre sti</button>
    <button @click="goUpOneLevel">Gå opp ett nivå</button>
    <h2>Test FilesAndFolders</h2>
    <FilesAndFolders :items="testItems" @selected="handleSelected" />
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
}

h1 {
  color: #42b883;
}

h2 {
  margin-top: 2rem;
  color: #666;
  font-size: 1.2rem;
}
button {
  margin-top: 2rem; 
}
</style>
