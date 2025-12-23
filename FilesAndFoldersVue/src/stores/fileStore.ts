import { defineStore } from 'pinia'
import type { FileOrFolder, ViewState } from '@/types'

/**
 * Files and Folders Pinia Store
 *
 * This replaces:
 * - Version 1: model.js with subscribe/notify pattern
 * - Version 2: state inside MyApp component
 *
 * Requirements from exam:
 * - Use Composition API syntax
 * - All app state lives here
 * - Components can only modify state through actions
 * - Only FileBrowser view accesses this store directly
 */
export const useFileStore = defineStore('files', {
  state: () => ({
    // Initial data - same as Version 2
    filesAndFolders: [
      { id: 1, name: 'Handlelister' },
      { id: 2, name: 'Ting som skal fikses' },
      { id: 3, name: 'Oktober', parentId: 1 },
      { id: 4, name: 'Tirsdag 15.', parentId: 3, content: 'melk\nbrød\nost\n' },
      { id: 5, name: 'Bad', parentId: 2, content: 'Lekkasje, bla bla' },
      { id: 6, name: 'notater.txt', content: 'abc' },
    ] as FileOrFolder[],

    currentId: undefined as number | undefined,

    // For multi-select delete feature (from Version 2)
    markedFilesAndFolders: new Set<number>(),
  }),

  getters: {
    /**
     * getViewState - THE KEY GETTER (replaces getViewState() from Version 1)
     *
     * This will be tested in your unit tests!
     *
     * Derives view-specific data from raw state:
     * - Which folder are we in?
     * - Which files/folders to show?
     * - Is a file selected for editing?
     */
    getViewState(state): ViewState {
      const { currentId, filesAndFolders } = state

      // Helper functions (from Version 1 model.js)
      const isFile = (f: FileOrFolder) => f.content !== undefined
      const isFolder = (f: FileOrFolder) => f.content === undefined

      // Find current item
      const current = filesAndFolders.find(f => f.id === currentId) ?? null

      // Determine current folder
      const currentFolder = this.getCurrentFolder(current, filesAndFolders)

      // Filter items that belong in current folder
      const isInCorrectFolder = (f: FileOrFolder) =>
        (f?.parentId ?? null) === currentFolder.id

      const files = filesAndFolders.filter(f => isFile(f) && isInCorrectFolder(f))
      const folders = filesAndFolders.filter(f => isFolder(f) && isInCorrectFolder(f))

      // Selected file for editing (only if current is a file)
      const selectedFile = current !== null && current.content !== undefined ? current : null

      return {
        currentId,
        current,
        currentFolder,
        files,
        folders,
        selectedFile,
      }
    },

    /**
     * Helper getter - determines which folder we're currently viewing
     * From Version 1 model.js:108-116
     */
    getCurrentFolder: (state) => (
      current: FileOrFolder | null,
      filesAndFolders: FileOrFolder[]
    ) => {
      const root = { id: null as null, name: 'Rotmappe' }
      if (current === null) return root

      const isFolder = current.content === undefined
      if (isFolder) return current

      // Current is a file, find its parent folder
      const currentFolder = filesAndFolders.find(f => f.id === current.parentId)
      return currentFolder ?? root
    },
  },

  actions: {
    /**
     * Actions will go here - these replace controller functions from Version 1
     *
     * We'll implement these incrementally:
     * - setCurrentId
     * - selectParent
     * - saveFile
     * - clearCurrentId
     * - createNew
     * - deleteItem
     * - toggleMark (new for Version 2 feature)
     */

    // TODO: Implement actions as we convert components
  },
})
