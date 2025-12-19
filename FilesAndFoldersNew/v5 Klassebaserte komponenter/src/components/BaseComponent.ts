export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static props: string[];
    private isRenderScheduled: boolean = false;

    static get observedAttributes() {
        return this.props;
    }

    get(name: string): any {
        if (!this.hasAttribute(name)) {
            return null;
        }

        const value = this.getAttribute(name)!;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    set(name: string, value: any) {
        const valueToSave =
            typeof (value) != 'object'
                ? value
                : JSON.stringify(value);

        this.setAttribute(name, valueToSave);
    }

    connectedCallback() {
        this.scheduleRender();
    }

    attributeChangedCallback() {
        this.scheduleRender();
    }

    scheduleRender() {
        if (!this.isRenderScheduled) {
            this.isRenderScheduled = true;
            requestAnimationFrame(() => {
                this.isRenderScheduled = false;
                this.render();
            });
        }
    }

    render() {
    }
}