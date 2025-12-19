import { BaseComponent } from "../components/BaseComponent";
import type { FileOrFolder } from "../types";

export class FilesAndFolders extends BaseComponent {
    static props = ['items', 'parent-folder', 'marked-files-and-folders'];
    render() {
        const filesAndFolders = this.get('items') as FileOrFolder[] || [];
        const parentFolder = this.get('parent-folder') as number || false;
        const markedFilesAndFolders = this.get('marked-files-and-folders') || [];

        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset>
                <legend>Mapper og filer</legend>
                ${parentFolder ?/*HTML*/`
                    📁 <a href="" data-id="${parentFolder}">..</a><br/>` : ''}
                ${filesAndFolders.filter(f => !f.hasOwnProperty('content')).map(f =>/*HTML*/`
                    <input data-id="${f.id}" type="checkbox" ${markedFilesAndFolders.includes(f.id) ? 'checked' : ''}/>
                    📁 <a href="" data-id="${f.id}">${f.name}</a><br/>
                `).join('')}
                ${filesAndFolders.filter(f => f.hasOwnProperty('content')).map(f =>/*HTML*/`
                    <input data-id="${f.id}" type="checkbox" ${markedFilesAndFolders.includes(f.id) ? 'checked' : ''}/>
                    <span>🗎</span> <a href="" data-id="${f.id}">${f.name}</a><br/>
                `).join('')}
            </fieldset>
        `;
        this.shadowRoot!.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e: Event) {
        const target = e.target! as HTMLElement;
        const idStr = target.getAttribute('data-id');
        if (target.matches('a')) {
            e.preventDefault();
            const event = new CustomEvent('selected', { detail: idStr });
            this.dispatchEvent(event);
        }
        if (target.matches('input')) {
            const checkbox = target as HTMLInputElement;
            const id = parseInt(idStr!);
            const isChecked = checkbox.checked;
            const detail = { id, isChecked };
            const event = new CustomEvent('marked-file-or-folder-changed', { detail });
            this.dispatchEvent(event);
        }
    }
}


