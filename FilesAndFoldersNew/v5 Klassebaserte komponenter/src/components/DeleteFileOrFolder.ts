import { BaseComponent } from "../components/BaseComponent";

export class DeleteFileOrFolder extends BaseComponent {
    private state = {
        isInInitialPhase: true,
    };
    render() {
        const isInInitialPhase = this.state.isInInitialPhase;
        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset>
                <legend>Slett fil eller mappe</legend>
                ${isInInitialPhase ?/*HTML*/`
                    <button>Slett</button>
                `:/*HTML*/`
                    Er du sikker på at du vil slette?<br/>
                    <button>Ja, slett!</button>
                    <button>Avbryt</button>
                `}
            </fieldset>
        `;

        if (isInInitialPhase) {
            const btn = this.shadowRoot!.querySelector('button')!;
            btn.addEventListener('click', () => this.handleChangePhase(false));
        } else {
            const btns = this.shadowRoot!.querySelectorAll('button')!;
            btns[0].addEventListener('click', this.handleDelete.bind(this));
            btns[1].addEventListener('click', () => this.handleChangePhase(true));
        }
    }

    handleDelete(){
        const event = new CustomEvent('delete-file-or-folder');
        this.dispatchEvent(event);
    }

    handleChangePhase(isInInitialPhase: boolean) {
        this.state.isInInitialPhase = isInInitialPhase;
        this.render();
    }
}


