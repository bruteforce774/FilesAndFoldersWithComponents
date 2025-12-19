# Comparing Two Frameworkless Implementations

You now have TWO versions of the Files and Folders app to study:

## Version 1: FilesAndFoldersWithComponents (JavaScript)
**Location:** Root directory (framework.js, model.js, etc.)

## Version 2: FilesAndFoldersNew v5 (TypeScript)
**Location:** `FilesAndFoldersNew/v5 Klassebaserte komponenter/`

Let's compare them to deepen your understanding!

---

## Key Differences

| Aspect | Version 1 (JS) | Version 2 (TS) |
|--------|---------------|----------------|
| **Language** | JavaScript | TypeScript |
| **Types** | No types | `types.ts` with interfaces |
| **Framework** | `defineComponent()` function | `BaseComponent` class |
| **State Management** | Observer pattern (model.js) | State in MyApp component |
| **State Location** | Centralized in `model.js` | Inside `MyApp` class |
| **State Updates** | `notify()` → subscribers | `scheduleRender()` on MyApp |
| **Components Get Data** | Via subscribe → props | Via parent setting attributes |
| **Controller Functions** | In model.js (setCurrentId, etc.) | In MyApp methods (handleSelected, etc.) |
| **getViewState()** | Separate function in model | Inline logic in MyApp render |
| **Marking/Multi-delete** | ❌ No | ✅ Yes (Set of IDs) |

---

## Architecture Comparison

### Version 1: Observer Pattern (MVC-like)

```
┌─────────────────────────────────────┐
│         index.html                  │
│   model.subscribe(state => ...)    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│      fileBrowser (View)             │
│   - getViewState()                  │
│   - assignPropsBySelector()         │
│   - createListen()                  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│         model.js (Model)            │
│   - state                           │
│   - subscribe/notify                │
│   - controller functions            │
│   - getViewState()                  │
└─────────────────────────────────────┘
```

**Flow:**
1. Component emits event → fileBrowser listener → model function
2. Model function modifies state → notify()
3. notify() calls all subscribers with new state
4. index.html subscriber → fileBrowser.render(state)
5. fileBrowser calls getViewState() → assigns props to children
6. Children re-render

### Version 2: Component State (More Direct)

```
┌─────────────────────────────────────┐
│           main.ts                   │
│   customElements.define(...)       │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│        MyApp (View + Model)         │
│   - state: AppState                 │
│   - render()                        │
│   - handleSelected()                │
│   - handleContentAdded()            │
│   - handleDelete()                  │
│   - scheduleRender()                │
└──────────┬──────────────────────────┘
           │
           └─► Child components
                (via .set('prop', value))
```

**Flow:**
1. Component emits event → MyApp event listener
2. MyApp handler modifies this.state → scheduleRender()
3. render() updates innerHTML and calls child.set() for props
4. Child's attributeChangedCallback → scheduleRender()
5. Child re-renders

---

## Code Examples: Same Feature, Different Implementation

### Feature: Breadcrumbs

**Version 1 (JS) - breadcrumbPath.js:**
```javascript
defineComponent('breadcrumb-path', ['currentId', 'filesAndFolders'], false, self => {
  const el = self.shadowRoot;
  const currentId = self.props.currentId;
  let breadcrumbs = [];
  let id = currentId;
  const all = self.props.filesAndFolders;

  while (id) {
    const f = all.find(f => f.id == id);
    if (!f) break;
    if (f.content === undefined) {
      breadcrumbs.unshift(`<span>${f.name}</span>`);
    }
    id = f.parentId;
  }

  const breadcrumbsStr = breadcrumbs.length > 0
    ? ' > ' + breadcrumbs.join(' > ')
    : '<i>rotmappe</i>';
  el.innerHTML = `<fieldset><legend>Her er du nå</legend>${breadcrumbsStr}</fieldset>`;
});
```

**Key points:**
- Component receives `currentId` and entire `filesAndFolders` array
- Builds breadcrumb path itself by walking up parent chain
- "Dumb component" - just renders what it's given

**Version 2 (TS) - Breadcrumbs.ts:**
```typescript
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
```

**Key points:**
- Component receives pre-computed `texts` array
- Much simpler - just displays what parent gives it
- Parent (MyApp) does the work in `breadcrumbsSetProps()` (lines 92-107)

**Which is better?**
- Version 2 is more "Vue-like" - parent computes, child displays
- Version 1 gives component more responsibility
- For Vue conversion, Version 2's approach is closer to what you'll do!

---

### Feature: Clicking a File/Folder

**Version 1 (JS) - fileAndFolderList.js:**
```javascript
el.querySelectorAll('a').forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    const selectedId = a.dataset.id;
    if (selectedId === '..')
      self.emit('select-parent', { id: currentId });
    else
      self.emit('select', { id: +a.dataset.id });
  };
});

// In fileBrowser.js:
listen('file-and-folder-list', 'select', model.setCurrentId);
```

**Flow:** Component emit → fileBrowser listen → model.setCurrentId

**Version 2 (TS) - FilesAndFolders.ts:**
```typescript
handleClick(e: Event) {
  const target = e.target! as HTMLElement;
  const idStr = target.getAttribute('data-id');
  if (target.matches('a')) {
    e.preventDefault();
    const event = new CustomEvent('selected', { detail: idStr });
    this.dispatchEvent(event);
  }
}

// In MyApp.ts:
filesAndFolders.addEventListener('selected', this.handleSelected.bind(this));

handleSelected(e: Event) {
  const customEvent = e as CustomEvent;
  const selectedFileOrFolderId = customEvent.detail;
  if (selectedFileOrFolderId == "-1") {
    delete this.state.currentId;
  } else {
    this.state.currentId = parseInt(selectedFileOrFolderId);
  }
  this.scheduleRender();
}
```

**Flow:** Component dispatchEvent → MyApp listener → handleSelected → scheduleRender

---

## TypeScript Types (Version 2)

```typescript
export interface AppState {
  currentId?: number;
  filesAndFolders: FileOrFolder[];
  markedFilesAndFolders: Set<number>;  // NEW FEATURE!
}

export interface FileOrFolder {
  id: number;
  name: string;
  content?: string;      // If present, it's a file
  parentId?: number;     // If absent, it's in root
}
```

**Key insight:**
- File vs Folder distinction: presence of `content` property
- Same as Version 1, but now with type safety
- `markedFilesAndFolders` is new - allows multi-select delete

---

## What Version 2 Has That Version 1 Doesn't

### 1. **Multi-select with Checkboxes**
```typescript
// In state
markedFilesAndFolders: Set<number>

// In component
<input data-id="${f.id}" type="checkbox"
  ${markedFilesAndFolders.includes(f.id) ? 'checked' : ''}/>
```

### 2. **TypeScript Type Safety**
- Interfaces for data structures
- Type checking at compile time
- Better IDE autocomplete

### 3. **BaseComponent Class**
- Object-oriented approach
- `get()` and `set()` methods for attributes
- Static `props` array

---

## Implications for Vue Conversion

**From Version 1, you learned:**
- Observer pattern → Pinia's reactivity system
- `subscribe/notify` → Pinia's state watchers
- `getViewState()` → Pinia getters
- Controller functions → Pinia actions

**From Version 2, you learned:**
- TypeScript types → Copy these to your Vue project!
- Component hierarchy → Similar to Vue's parent-child
- Event flow → Vue's emit system
- Set() for tracking selections → Can use in Pinia store

**For your exam, you'll likely need:**
1. TypeScript types (Version 2 has them!)
2. Component structure (both versions show this)
3. State management pattern (Version 1's model.js → Pinia)
4. Event handling (both versions, but Vue uses `@event` and `emit()`)

---

## Understanding Questions

Now that you've seen both versions, try these:

**1. Why does Version 1 use subscribe/notify but Version 2 doesn't?**

**2. In Version 2, where would you move the state if converting to use Observer pattern like Version 1?**

**3. Which version's approach is closer to Vue's architecture? Why?**

**4. How would you implement the `markedFilesAndFolders` feature in Version 1?**

**5. What are the pros/cons of Version 1's getViewState() vs Version 2's inline logic in render()?**

---

## Next Steps

1. **Test your understanding** - Answer the questions above
2. **Pick which version to convert** - Version 2 might be easier (TypeScript already done!)
3. **Start with types** - Version 2's types.ts is a great starting point
4. **Incremental conversion** - One component at a time

Ready to discuss your answers and start coding? 🚀
