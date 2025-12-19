export interface AppState{
    currentId?: number;
    filesAndFolders: FileOrFolder[];
    markedFilesAndFolders: Set<number>;
}

export interface FileOrFolder{
    id: number;
    name: string;
    content?: string;
    parentId?: number;
}