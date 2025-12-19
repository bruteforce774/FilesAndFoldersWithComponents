import { BaseComponent } from "../components/BaseComponent";

export class Breadcrumbs extends BaseComponent {
    static props = ['texts'];
    render() {
        const items = this.get('texts') as string[];
        const text = !items || items.length == 0
            ? '<i>rotmappe</i>'
            : ' > ' + items.join(' > ');
        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset>
                <legend>Her er du nå</legend>
                ${text}
            </fieldset>
        `;
    }
}
