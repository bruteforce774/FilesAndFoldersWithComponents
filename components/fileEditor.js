import { defineComponent } from '../common/framework.js';

defineComponent('file-editor', ['file'], false, self => {
  const el = self.shadowRoot;
  let file = self.props.file;
  if (!file) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = /*HTML*/`
    <fieldset>
      <legend>Redigering</legend>
      <textarea id="editArea">${file.content}</textarea><br/>
      <button id="save">Lagre</button>
      <button id="cancel">Avbryt</button>
    </fieldset>
  `;

  el.querySelector('#save').onclick = () => {
    const content = el.querySelector('#editArea').value;
    self.emit('save', { id: file.id, content });
  };
  el.querySelector('#cancel').onclick = () =>
    self.emit('cancel');
});