const assignPropsBySelector = (root, selectorPropMap) => {
  for (const [selector, props] of Object.entries(selectorPropMap)) {
    const el = root.querySelector(selector);
    if (!el) continue;

    for (const [key, value] of Object.entries(props)) {
      el[key] = value;
    }
  }
};

const createListen = el => (selector, eventName, handler) => {
    const target = el.querySelector(selector);
    if (!target) return;
    target.addEventListener(eventName, e => handler(e.detail));
};

const defineComponent = (tagName, propNames, autoRender, renderFn) => {
  class Component extends HTMLElement {
    static get observedAttributes() {
      return propNames;
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.props = {};
      this.state = {};
      this.appState = undefined;
      this.renderFn = renderFn;
      this.skipAttributeChangedCallback = false;
      this.renderScheduled = false;
    }

    connectedCallback() {
      for (const name of propNames) {
        if (this.hasAttribute(name)) {
          const val = this.getAttribute(name);
          try {
            this.props[name] = JSON.parse(val);
          } catch {
            this.props[name] = val;
          }
        }
      }
      if (autoRender) this.scheduleRender();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (this.skipAttributeChangedCallback) return;
      if (oldValue === newValue) return;

      try {
        this.props[name] = JSON.parse(newValue);
      } catch {
        this.props[name] = newValue;
      }
      this.scheduleRender();
    }

    render(newAppState) {
      if (newAppState !== undefined) {
        this.appState = newAppState;
      }
      this.renderFn(this);
    }

    scheduleRender() {
      if (this.renderScheduled) return;

      this.renderScheduled = true;
      requestAnimationFrame(() => {
        this.renderScheduled = false;
        this.render();
      });
    }

    emit(name, detail = {}) {
      this.dispatchEvent(new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
      }));
    }
  }

  // Dynamisk setter/getter for props
  for (const name of propNames) {
    Object.defineProperty(Component.prototype, name, {
      get() {
        return this.props[name];
      },
      set(value) {
        this.props[name] = value;

        // Bare oppdater attributt hvis det er en primitiv verdi
        if (typeof value !== 'object') {
          try {
            this.skipAttributeChangedCallback = true;
            this.setAttribute(name, value);
          } finally {
            this.skipAttributeChangedCallback = false;
          }
        }

        this.scheduleRender();
      }
    });
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, Component);
  }
};

const defineView = (tagName, renderFn) =>
    defineComponent(tagName, [], false, renderFn);

export { createListen, defineComponent, defineView, assignPropsBySelector };