import { defineComponent } from '../common/framework.js';

defineComponent('breadcrumb-path', ['currentId', 'filesAndFolders'], false, self => {
  const el = self.shadowRoot;
  const currentId = self.props.currentId;
  let breadcrumbs = [];
  let id = currentId;
  try {
    const all = self.props.filesAndFolders;
    while (id) {
      const f = all.find(f => f.id == id);
      if (!f) break;
      if (f.content === undefined) {
        breadcrumbs.unshift(`<span>${f.name}</span>`);
      }
      id = f.parentId;
    }
  } catch {
    breadcrumbs = [];
  }
  const breadcrumbsStr = breadcrumbs.length > 0 ? ' > ' + breadcrumbs.join(' > ') : '<i>rotmappe</i>';
  el.innerHTML = `<fieldset><legend>Her er du nå</legend>${breadcrumbsStr}</fieldset>`;
});