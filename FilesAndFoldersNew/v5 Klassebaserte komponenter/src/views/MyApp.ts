import { BaseComponent } from "../components/BaseComponent";
import type { FilesAndFolders } from "../components/FilesAndFolders";
import type { AppState, FileOrFolder } from "../types";

export class MyApp extends BaseComponent {
  private state: AppState = {
    filesAndFolders: [
      { id: 1, name: "Handlelister" },
      { id: 2, name: "Ting som skal fikses" },
      { id: 3, name: "Oktober", parentId: 1 },
      { id: 4, name: "Tirsdag 15.", parentId: 3, content: "melk\nbrød\nost\n" },
      { id: 5, name: "Bad", parentId: 2, content: "Lekkasje, bla bla" },
      { id: 6, name: "notater.txt", content: "abc" },
    ],
    markedFilesAndFolders: new Set(),
  };

  render() {
    const hasMarkedItems = this.state.markedFilesAndFolders.size;
    this.shadowRoot!.innerHTML = /*HTML*/ `
            <breadcrumbs-panel></breadcrumbs-panel>
            <files-and-folders></files-and-folders>
            <add-file-or-folder></add-file-or-folder>
            ${
              hasMarkedItems > 0
                ? /*HTML*/ `<delete-file-or-folder></delete-file-or-folder>`
                : ""
            }
            ${
              this.isFileSelected() ? /*HTML*/ `<edit-file></edit-file>` : ""
            }                
        `;
    this.filesAndFoldersAddEventsAndSetProps();
    this.breadcrumbsSetProps();
    this.addFileOrFolderAddEvents();
    this.deleteFileOrFolderAddEvents();
    if (this.isFileSelected()) this.editFileAddEventsAndSetProps();
  }

  private isFileSelected() {
    const currentFileOrFolder = this.getCurrentFileOrFolder();
    return currentFileOrFolder && currentFileOrFolder.hasOwnProperty("content");
  }

  private getCurrentFileOrFolder() {
    return this.state.filesAndFolders.find((f) => f.id == this.state.currentId);
  }

  private editFileAddEventsAndSetProps() {
    const editFile = this.shadowRoot!.querySelector(
      "edit-file"
    ) as BaseComponent;
    editFile.set("content", this.getCurrentFileOrFolder()!.content ?? "");
    editFile.set("id", this.state.currentId);

    editFile.addEventListener("content-saved", (e: Event) => {
      const customEvent = e as CustomEvent;
      const currentFile = this.getCurrentFileOrFolder();
      if (currentFile && currentFile.hasOwnProperty("content")) {
        currentFile.content = customEvent.detail.content;
      }
    });
    editFile.addEventListener("edit-cancelled", (e: Event) => {
        const customEvent = e as CustomEvent;
        const parentId = this.state.filesAndFolders.find(f => f.id === customEvent.detail.id)?.parentId;
        this.state.currentId = parentId;
        this.scheduleRender();
    });
    }

  private deleteFileOrFolderAddEvents() {
    const deleteFileOrFolder = this.shadowRoot!.querySelector(
      "delete-file-or-folder"
    );
    if (deleteFileOrFolder) {
      deleteFileOrFolder.addEventListener(
        "delete-file-or-folder",
        this.handleDelete.bind(this)
      );
    }
  }

  private addFileOrFolderAddEvents() {
    const addFileOrFolder =
      this.shadowRoot!.querySelector("add-file-or-folder");
    addFileOrFolder?.addEventListener(
      "content-added",
      this.handleContentAdded.bind(this)
    );
  }

  breadcrumbsSetProps() {
    let id = this.state.currentId;
    if (!id) return;
    let breadcrumbs = [];
    while (id) {
      let fileOrFolder = this.state.filesAndFolders.find((f) => f.id == id);
      if (!fileOrFolder) break;
      breadcrumbs.push(fileOrFolder.name);
      id = fileOrFolder.parentId;
    }
    breadcrumbs.reverse();
    const breadcrumbsPanel = this.shadowRoot!.querySelector(
      "breadcrumbs-panel"
    )! as BaseComponent;
    breadcrumbsPanel.set("texts", breadcrumbs);
  }

  filesAndFoldersAddEventsAndSetProps() {
    const filesAndFolders = this.shadowRoot!.querySelector(
      "files-and-folders"
    ) as FilesAndFolders;
    const currentFileOrFolder = this.getCurrentFileOrFolder();
    // const folderId = currentFileOrFolder!.content ? currentFileOrFolder?.parentId : currentFileOrFolder?.id;
    const currentFilesAndFolders = this.state.filesAndFolders.filter(
      (f) => f.parentId == this.state.currentId
    );
    filesAndFolders.set("items", currentFilesAndFolders);
    filesAndFolders.set(
      "marked-files-and-folders",
      Array.from(this.state.markedFilesAndFolders)
    );
    if (currentFileOrFolder) {
      const folderId = currentFileOrFolder!.parentId ?? -1;
      filesAndFolders.set("parent-folder", folderId);
    }

    filesAndFolders.addEventListener(
      "selected",
      this.handleSelected.bind(this)
    );
    filesAndFolders.addEventListener(
      "marked-file-or-folder-changed",
      this.handleMarkedFileOrFolderChanged.bind(this)
    );
  }

  handleDelete() {
    this.state.filesAndFolders = this.state.filesAndFolders.filter(
      (f) => !this.state.markedFilesAndFolders.has(f.id)
    );
    this.scheduleRender();
  }

  handleContentAdded(e: Event) {
    const customEvent = e as CustomEvent;
    const newContent: FileOrFolder = {
      id: Math.max(...this.state.filesAndFolders.map((f) => f.id)) + 1,
      name: customEvent.detail.name,
    };
    const current = this.state.filesAndFolders.find(
      (f) => f.id == this.state.currentId
    )!;
    if (current) {
      newContent.parentId = current.hasOwnProperty("content")
        ? current?.parentId
        : current.id;
    }
    if (customEvent.detail.isFile) newContent.content = "";
    this.state.filesAndFolders.push(newContent);
    console.log(this.state);
    this.scheduleRender();
  }

  handleSelected(e: Event) {
    const customEvent = e as CustomEvent;
    const selectedFileOrFolderId = customEvent.detail;
    if (selectedFileOrFolderId == "-1") {
      delete this.state.currentId;
    } else {
      this.state.currentId = parseInt(selectedFileOrFolderId);
    }
    this.scheduleRender();
  }

  handleMarkedFileOrFolderChanged(e: Event) {
    const customEvent = e as CustomEvent;
    const { id, isChecked } = customEvent.detail;
    if (isChecked) this.state.markedFilesAndFolders.add(id);
    else this.state.markedFilesAndFolders.delete(id);
    this.scheduleRender();
  }
}
