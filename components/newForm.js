import { defineComponent } from '../common/framework.js';

defineComponent('new-form', ['currentFolder'], false, self => {
  const el = self.shadowRoot;
  const currentFolder = self.props.currentFolder;

  el.innerHTML = /*HTML*/`
    <fieldset>
      <legend>Opprette mappe eller file</legend>
      <input placeholder="Skriv inn navn">
      <button>Ny mappe</button>
      <button>Ny fil</button>
      <br/>
    </fieldset>
  `;
  const btns = el.querySelectorAll('button');  
  const emit = isFolder => () => {
    const name = el.querySelector('input').value.trim();
    if (name) self.emit('create-new', { name, parentId: currentFolder.id, isFolder });
  };
  btns[0].addEventListener('click', emit(true));
  btns[1].addEventListener('click', emit(false));
});