import { FilesAndFolders } from "./components/FilesAndFolders";
import { AddFileOrFolder } from "./components/AddFileOrFolder";
import { DeleteFileOrFolder } from "./components/DeleteFileOrFolder";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { EditFile } from "./components/EditFile";
import { MyApp } from "./views/MyApp";

customElements.define('files-and-folders', FilesAndFolders);
customElements.define('add-file-or-folder', AddFileOrFolder);
customElements.define('delete-file-or-folder', DeleteFileOrFolder);
customElements.define('breadcrumbs-panel', Breadcrumbs);
customElements.define('edit-file', EditFile);
customElements.define('my-app', MyApp);

