# Understanding the Frameworkless Code - Learning Guide

## What You're Looking At

This is a file/folder browser application built WITHOUT any framework (no React, Vue, or Angular). Instead, it uses:
- **Web Components** (custom HTML elements)
- **Shadow DOM** (encapsulated component styling/DOM)
- **Observer Pattern** (for state management)
- A custom mini-framework in `framework.js`

## Architecture Pattern: Observer Pattern (Similar to MVC)

```
┌─────────────────────────────────────────────────────────┐
│                    index.html                           │
│  Subscribes to model, calls render on state changes     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  fileBrowser (View)                     │
│  - Gets derived state from getViewState()               │
│  - Passes props to child components                     │
│  - Listens to component events                          │
│  - Calls model controller functions                     │
└───┬─────────────────────────────────────────────────────┘
    │
    ├─► breadcrumbPath ─┐
    ├─► fileAndFolderList ┼─► Components receive props
    ├─► fileEditor       │   and emit events
    ├─► newForm          │
    └─► deleteForm ──────┘
                  │
                  ▼ (events bubble up)
┌─────────────────────────────────────────────────────────┐
│                   model.js (Model)                      │
│  - Holds centralized state                              │
│  - Controller functions modify state                    │
│  - notify() triggers all subscribers                    │
│  - getViewState() derives UI data                       │
└─────────────────────────────────────────────────────────┘
```

## Detailed Code Flow Example: Clicking a Folder

Let's trace what happens when you click on "Emne 1" folder:

### 1. User Clicks Link (fileAndFolderList.js:22-27)

```javascript
// The component renders links for folders/files
html += `📁 <a href="#" data-id="${folder.id}">${folder.name}</a><br/>`;

// Click handler emits a custom event
a.onclick = e => {
  e.preventDefault();
  self.emit('select', { id: +a.dataset.id }); // Emits event with folder ID
};
```

**What's happening:**
- User clicks the link
- Event handler prevents default navigation
- Component emits a custom event called 'select' with the folder's ID
- Event bubbles up (because of `composed: true` in framework.js:82)

### 2. Event Reaches fileBrowser (fileBrowser.js:40)

```javascript
const listen = createListen(el);
listen('file-and-folder-list', 'select', model.setCurrentId);
```

**What's happening:**
- `createListen` finds the child component
- When 'select' event fires, it calls `model.setCurrentId`
- The event detail `{ id: ... }` is passed as argument

### 3. Model Updates State (model.js:38-41)

```javascript
function setCurrentId({ id }) {
  state.app.currentId = id;  // Updates state
  notify();                   // Notifies all subscribers!
}
```

**What's happening:**
- State is mutated directly
- `notify()` is called, triggering all subscribed listeners

### 4. Subscribers Get Notified (model.js:28-30)

```javascript
function notify() {
  for (const l of listeners) l(getStateCopy());
}
```

**What's happening:**
- Creates a frozen copy of state (immutable)
- Calls each subscriber with the new state

### 5. index.html Subscriber Triggers Re-render (index.html:25-28)

```javascript
model.subscribe(state => {
  const el = document.querySelector('file-browser');
  if (el) el.render(state);  // Triggers fileBrowser to re-render
});
```

**What's happening:**
- The callback receives the new state
- Calls `render()` on the file-browser component

### 6. fileBrowser Re-renders (fileBrowser.js:9-37)

```javascript
const {
  currentId,
  current,
  currentFolder,
  files,
  folders,
  selectedFile
} = model.getViewState(self.appState);  // Derives view data

// Re-creates ALL child components (innerHTML = ...)
el.innerHTML = /*HTML*/`
  <h1>Filer og mapper</h1>
  <breadcrumb-path></breadcrumb-path>
  <file-and-folder-list></file-and-folder-list>
  ...
`;

// Assigns new props to components
assignPropsBySelector(el, {
  'breadcrumb-path': { currentId, filesAndFolders: self.appState.filesAndFolders },
  'file-and-folder-list': { files, folders, currentId, current },
  ...
});

// Re-attaches event listeners
const listen = createListen(el);
listen('file-and-folder-list', 'select', model.setCurrentId);
...
```

**What's happening:**
- `getViewState()` derives which files/folders to show
- Entire DOM is recreated (no virtual DOM!)
- Props are assigned to child components
- Event listeners are re-attached

### 7. Child Components Re-render

When props are assigned via `assignPropsBySelector`, it triggers:

```javascript
// In framework.js Component class
set(value) {
  this.props[name] = value;
  this.scheduleRender();  // Triggers component re-render
}
```

Each component's render function runs, updating its Shadow DOM.

## Key Concepts Explained

### getViewState() - The View Model (model.js:84-106)

This is CRITICAL - it derives UI-specific data from raw state:

```javascript
function getViewState(appState) {
  const { currentId } = appState.app;
  const { filesAndFolders } = appState;

  // Helper functions
  const isFile = f => f.content !== undefined;
  const isFolder = f => f.content === undefined;
  const current = find(currentId);
  const currentFolder = getCurrentFolder(current, filesAndFolders);
  const isInCorrectFolder = f => (f?.parentId ?? null) === currentFolder.id;

  // Derived data
  const files = filesAndFolders.filter(f => isFile(f) && isInCorrectFolder(f));
  const folders = filesAndFolders.filter(f => isFolder(f) && isInCorrectFolder(f));
  const selectedFile = current !== null && current.content !== undefined ? current : null;

  return {
    currentId,
    current,
    currentFolder,
    files,
    folders,
    selectedFile
  }
}
```

**Why it matters:**
- Raw state is just an array of items and a currentId
- getViewState figures out:
  - Which folder we're in
  - Which files/folders to show in current folder
  - Whether a file is selected for editing
- This is what you'll need to test in Pinia!

### Component Lifecycle (framework.js)

```javascript
defineComponent('component-name', ['prop1', 'prop2'], autoRender, renderFn)
```

1. **connectedCallback**: Runs when component is added to DOM
2. **attributeChangedCallback**: Runs when attribute changes
3. **render()**: Re-runs the render function
4. **scheduleRender()**: Uses requestAnimationFrame for batched updates

### Props vs State

**Props** (`self.props`):
- Data passed from parent
- Triggers re-render when changed
- Reactive via setters/getters

**State** (`self.state`):
- Local component state
- See `deleteForm.js:21` - confirmation state
- Doesn't trigger auto re-render, component calls `self.render()` manually

**App State** (`self.appState`):
- Global application state from model
- Passed via `render(newAppState)` in index.html

## What's Different from Vue?

| Frameworkless | Vue Equivalent |
|---------------|----------------|
| `defineComponent` | `defineComponent` (but built-in) |
| `self.emit('event', data)` | `emit('event', data)` |
| `assignPropsBySelector` | Props binding `:prop="value"` |
| `subscribe/notify` | Pinia store reactivity |
| `getViewState` | Pinia getters |
| Controller functions in model | Pinia actions |
| Manual `innerHTML` | Template + Virtual DOM |
| Manual event listeners | `@event="handler"` |
| `self.props.propName` | `defineProps<{}>()` |
| `self.state` | `ref()` or `reactive()` |

## Questions to Test Your Understanding

1. What happens if you change state WITHOUT calling `notify()`?
2. Why does fileBrowser re-create all components on every render?
3. How does the breadcrumb know which folders to show?
4. Why does deleteForm use `self.state.confirm` instead of getting it from the model?
5. What's the difference between `current` and `currentFolder` in getViewState?

## Next Steps

Now that you understand the frameworkless code, we'll:
1. Create TypeScript types for all data structures
2. Convert one simple component (BreadcrumbPath) to Vue
3. Set up Pinia store incrementally
4. Convert remaining components
5. Add tests for getViewState logic

Ready to start coding? 🚀
