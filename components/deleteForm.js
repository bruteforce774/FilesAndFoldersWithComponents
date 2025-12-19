import { defineComponent } from '../common/framework.js';

defineComponent('delete-form', ['current'], false, self => {
  const el = self.shadowRoot;
  const current = self.props.current;

  if (!current) {
    el.innerHTML = '';
    return;
  }

  const setContent = html => {
    el.innerHTML = /*HTML*/`
      <fieldset>
        <legend>Slette</legend>
        ${html}
      </fieldset>
    `;
  }

  if (!self.state.confirm) {
    setContent(`<button>Slett ${current.name}</button>`);
    el.querySelector('button').onclick = () => {
      self.state.confirm = true;
      self.render();
    };
  } else {
    setContent(/*HTML*/`
        <div>Er du sikker på at du vil slette <strong>${current.name}</strong>?</div>
        <button id="confirm-delete">Ja, slett</button>
        <button id="cancel-delete" type="button">Avbryt</button>
    `);
    el.querySelector('#confirm-delete').onclick = () =>
      self.emit('delete-item', { id: current.id });
    el.querySelector('#cancel-delete').onclick = () => {
      self.state.confirm = false;
      self.render();
    };
  }
});