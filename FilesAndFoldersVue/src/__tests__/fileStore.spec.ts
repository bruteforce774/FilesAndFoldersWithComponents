import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFileStore } from '@/stores/fileStore'

describe('fileStore - getViewState', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance before each test
    setActivePinia(createPinia())
  })

  it('Test 1: should show root folder items when currentId is undefined', () => {
    const store = useFileStore()
    // currentId is undefined by default
    
    const viewState = store.getViewState
    
    // What should you test?
    // - currentFolder should be root { id: null, name: 'Rotmappe' }
    // - files should include items without parentId that have content
    // - folders should include items without parentId that don't have content
    
    expect(viewState.currentFolder.name).toBe('Rotmappe')

    // Which items are at root? Look at initial data in fileStore.ts
    // - { id: 1, name: 'Handlelister' } - no parentId = root folder
    // - { id: 2, name: 'Ting som skal fikses' } - no parentId = root folder  
    // - { id: 6, name: 'notater.txt', content: 'abc' } - no parentId = root file

    expect(viewState.folders).toHaveLength(2) // Handlelister, Ting som skal fikses
    expect(viewState.files).toHaveLength(1) // notater.txt

    // More specific assertions
    expect(viewState.folders.map(f => f.name)).toContain('Handlelister')
    expect(viewState.files[0]?.name).toBe('notater.txt')
  })

  it('Test 2: should show items inside a folder when folder is selected', () => {
    const store = useFileStore()
    // Set currentId to folder 1 (Handlelister)
    store.currentId = 1
    
    const viewState = store.getViewState
    
    // What should you test?
    // - currentFolder should be the folder with id: 1
    // - files and folders should only include items with parentId: 1
  })

  it('Test 3: should set selectedFile when a file is selected', () => {
    const store = useFileStore()
    // Set currentId to file 6 (notater.txt)
    store.currentId = 6
    
    const viewState = store.getViewState
    
    // What should you test?
    // - selectedFile should be the file object
    // - selectedFile should have content property
  })
})
