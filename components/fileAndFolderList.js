import { defineComponent } from '../common/framework.js';

defineComponent('file-and-folder-list', ['files', 'folders', 'currentId', 'current'], false, self => {
  const el = self.shadowRoot;
  const { files, folders, currentId, current } = self.props;
  let html = '';

  if (currentId != null && current !== undefined && current.content === undefined) {
    html += `📁 <a href="#" data-id="..">..</a><br/>`;
  }

  for (const folder of folders ?? []) {
    html += `📁 <a href="#" data-id="${folder.id}">${folder.name}</a><br/>`;
  }
  for (const file of files ?? []) {
    html += `<span>🗎</span> <a href="#" data-id="${file.id}">${file.name}</a><br/>`;
  }

  el.innerHTML = `<fieldset><legend>Mapper og filer</legend>${html}</fieldset>`;

  el.querySelectorAll('a').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      const selectedId = a.dataset.id;
      if (selectedId === '..') self.emit('select-parent', { id: currentId });
      else self.emit('select', { id: +a.dataset.id });
    };
  });
});