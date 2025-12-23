/**
 * Core data types for Files and Folders application
 * Adapted from frameworkless Version 2
 */

export interface FileOrFolder {
  id: number
  name: string
  content?: string    // If present, it's a file; if undefined, it's a folder
  parentId?: number   // If undefined, item is in root folder
}

export interface AppState {
  currentId?: number  // ID of currently selected file or folder
  filesAndFolders: FileOrFolder[]
  markedFilesAndFolders: Set<number>  // IDs of items marked for deletion
}

/**
 * View state derived from AppState - similar to getViewState() in Version 1
 * This will be computed in a Pinia getter
 */
export interface ViewState {
  currentId?: number
  current: FileOrFolder | null
  currentFolder: FileOrFolder | { id: null; name: string }
  files: FileOrFolder[]
  folders: FileOrFolder[]
  selectedFile: FileOrFolder | null
}
