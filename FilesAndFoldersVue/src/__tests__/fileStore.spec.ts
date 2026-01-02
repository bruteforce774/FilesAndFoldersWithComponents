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

    expect(viewState.currentFolder.name).toBe('Handlelister') // currentFolder should be Handlelister
    expect(viewState.currentFolder.id).toBe(1) // currentFolder id should be 1
    expect(viewState.folders).toHaveLength(1) // Only Oktober folder inside Handlelister
    expect(viewState.folders[0]?.name).toBe('Oktober') // The folder inside Handlelister
    expect(viewState.files).toHaveLength(0) // No files inside Handlelister
    expect(viewState.selectedFile).toBeNull() // No file selected
  })

  it('Test 3: should set selectedFile when a file is selected', () => {
    const store = useFileStore()
    // Set currentId to file 6 (notater.txt)
    store.currentId = 6
    
    const viewState = store.getViewState
    
    // What should you test?
    // - selectedFile should be the file object
    // - selectedFile should have content property

    // The selected file should be set
    expect(viewState.selectedFile).not.toBeNull()
    expect(viewState.selectedFile?.name).toBe('notater.txt')
    expect(viewState.selectedFile?.content).toBeDefined()
    expect(viewState.selectedFile?.content).toBe('abc')

    // The current item should also be the file
    expect(viewState.current?.name).toBe('notater.txt')

    // Since notater has no parentId, we're stil at root folder
    expect(viewState.currentFolder.name).toBe('Rotmappe')
    expect(viewState.currentFolder.id).toBe(null)
  })
})
