import { BaseComponent } from "../components/BaseComponent";

export class EditFile extends BaseComponent {
    private state = {
        content: ''
    };
    static props = ['content', 'id'];
    render() {
        const content = this.get('content') as string;

        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset>
                <legend>Rediger fil</legend>
                <textarea>${content}</textarea>
                <button id='save'>Lagre</button>
                <button id='cancel'>Avbryt</button>
            </fieldset>
        `;

        this.shadowRoot!.addEventListener('input', this.handleInput.bind(this));
        this.shadowRoot!.querySelector('button#save')!.addEventListener('click', () => {
            const event = new CustomEvent('content-saved', { detail: { content: this.state.content, id: this.get('id') } });
            this.dispatchEvent(event);
        });
        this.shadowRoot!.querySelector('button#cancel')!.addEventListener('click', () => {
            const event = new CustomEvent('edit-cancelled', { detail: { id: this.get('id') } });
            this.dispatchEvent(event);
        });
    }
    private handleInput() {
        const detail = {
            content: (this.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement).value
        };
        this.state.content = detail.content;
    }
    


    /*
        Todo: 
            1. oninput/onchange på textarea => lokal state
            2. avbryt og lagre dispatcher CustomEvent
            3. Fange opp event i MyApp og enten 
                Lagre => lagre nytt innhold 
                Avbryt => sette this.state.currentId til mappen filen er 
    */
}
