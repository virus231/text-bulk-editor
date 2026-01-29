# Text Transformer Tool - Project Specification

## Project Overview

Create a web-based text transformation tool for editing and manipulating lists of phrases (line-by-line). The tool must handle up to 10,000 lines efficiently with a comprehensive set of text operations.

**Reference UI/UX**: [Mike's Marketing Tools - Keyword Tool](http://www.mikes-marketing-tools.com/keyword-tool/)

**Core Objectives**:
- Demonstrate clean UI/state architecture
- Handle strings/Unicode correctly
- Maintain performance with large datasets
- Deliver high code quality, UX, and attention to detail

***

## 1. Technical Stack & Constraints

### Allowed
- **Framework**: React or Angular (your choice)
- **UI Library**: Bootstrap, Tailwind, MUI, or custom CSS
- **Storage**: In-memory state + optional LocalStorage/IndexedDB for auto-save

### Not Required
- Backend server
- Database
- Authentication/authorization

### Deployment
- **Required**: Deploy to Vercel, Netlify, GitHub Pages, or your own server
- Must work entirely in the browser (client-side only)

***

## 2. UI/UX Requirements

### Main Interface

**Essential Components**:
1. **Large Text Input Area**
   - Textarea or editor component for pasting/editing lines
   - Should handle 10,000+ lines without performance issues

2. **Operations Panel**
   - Buttons/controls for all text transformations
   - Organized logically by category (Case, Symbols, Cleaning, etc.)

3. **Results Display**
   - Show transformed text (can be same field or separate preview)
   - Clear visual feedback when operations complete

4. **Status Bar/Metrics**
   - Total line count
   - Empty lines count
   - Last operation execution time
   - Character count (optional bonus)

### Core Actions
- **Clear All**: Empty the text field
- **Copy to Clipboard**: Copy current result
- **Import/Export**: Upload/download `.txt` files (recommended)

***

## 3. Text Operations (Required)

### Input Example
For demonstration purposes, consider input: `сОк цЕНа`

***

### 3.1 Case Transformations

| Operation | Example Output |
|-----------|---------------|
| **All UPPERCASE** | `СОК ЦЕНА` |
| **all lowercase** | `сок цена` |
| **Title Case (Each Word)** | `Сок Цена` |
| **Sentence case (First word only)** | `Сок цена` |

***

### 3.2 Symbol Wrapping/Prefixes

| Operation | Example Output |
|-----------|---------------|
| **Add + before each word** | `+сОк +цЕНа` |
| **Remove + from words** | `сОк цЕНа` |
| **Wrap in quotes** | `"сОк цЕНа"` |
| **Wrap in square brackets** | `[сОк цЕНа]` |
| **Add - at start of line** | `-сОк цЕНа` |
| **Add -[...] at start** | `-[сОк цЕНа]` |
| **Add -"..." at start** | `-"сОк цЕНа"` |

***

### 3.3 Cleaning Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| **Remove extra spaces** | Collapse multiple spaces, trim edges | `сОк  цЕНа` -> `сОк цЕНа` |
| **Remove tabs** | Delete all `\t` characters | - |
| **Remove after " -"** | Delete everything after space+dash | `сок цена -вишня` -> `сок цена` |
| **Replace spaces with _** | All spaces become underscores | `сОк_цЕНа` |
| **Remove special chars** | Delete: `() \ ~ ! @ # $ % ^ & * _ = + [ ] { } | ; ' : " , / < > ?` | - |
| **Replace special chars with space** | Same symbols -> space | - |

***

### 3.4 Find & Replace

- **Two input fields**: "Find" and "Replace"
- Apply replacement across all lines
- **Basic**: Simple string replacement (required)
- **Bonus**: Regex support (optional)

***

### 3.5 Sorting & Deduplication

| Operation | Description |
|-----------|-------------|
| **Sort A-Z** | Alphabetical ascending (use `localeCompare` for Ukrainian/Russian) |
| **Sort Z-A** | Alphabetical descending |
| **Remove duplicates** | Keep only unique lines (case-sensitive or insensitive - your choice) |

***

## 4. History Management (Undo/Redo)

### Requirements
- **Minimum 10 steps** of history
- **Undo**: Revert last operation
- **Redo**: Re-apply undone operation
- **Branching behavior**: After Undo -> new operation clears Redo stack (standard editor behavior)

### Implementation Notes
- Each operation = 1 history step
- Store snapshots of text state (optimize for memory if needed)
- Display Undo/Redo buttons with disabled state when unavailable

***

## 5. Non-Functional Requirements

### 5.1 Performance

**10,000 Line Target**:
- Operations must complete without freezing the UI
- Use performance optimization techniques:
  - Batch processing
  - `requestAnimationFrame`
  - `setTimeout` chunking
  - Web Workers (optional, for heavy operations)
- **Avoid**: Rendering 10k individual DOM elements per line
- **Preferred**: Work with text/arrays efficiently, render once

### 5.2 Code Quality

**Architecture**:
- Clean, modular structure (components/hooks/services/utilities)
- Separation of concerns (UI logic vs. text transformation logic)
- Reusable utility functions

**Edge Cases**:
- Handle empty lines gracefully
- Normalize line endings (`\r\n` vs `\n`)
- Trim leading/trailing whitespace consistently
- Unicode/Cyrillic character support

**Error Handling**:
- Operations should not crash the app
- Provide user feedback for errors (toast/alert)
- Validate inputs where necessary

### 5.3 UX Polish

- **Loading States**: Show spinner/progress for slow operations
- **Visual Feedback**: Highlight changed text, show success messages
- **Keyboard Shortcuts**: Consider Ctrl+Z/Ctrl+Y for Undo/Redo (bonus)
- **Responsive Design**: Works on desktop (mobile optimization optional)
- **Accessibility**: Proper labels, keyboard navigation

***

## 6. Suggested Project Structure (React Example)

```
src/
├── components/
│   ├── Editor.jsx           # Main textarea/editor
│   ├── OperationsPanel.jsx  # Transformation buttons
│   ├── StatusBar.jsx        # Metrics display
│   └── HistoryControls.jsx  # Undo/Redo buttons
├── hooks/
│   ├── useTextEditor.js     # Main state + history logic
│   └── useClipboard.js      # Copy to clipboard helper
├── utils/
│   ├── transformations.js   # All text operation functions
│   ├── parsing.js           # Line splitting/joining helpers
│   └── storage.js           # LocalStorage persistence (optional)
├── App.jsx
└── index.js
```

***

## 7. Deliverables Checklist

### Core Features
- [ ] Text input area handles 10k+ lines smoothly
- [ ] All 20+ operations implemented and working correctly
- [ ] Undo/Redo (minimum 10 steps)
- [ ] Status bar with metrics (line count, execution time)
- [ ] Clear/Copy to clipboard functionality

### Nice-to-Have
- [ ] Import/Export `.txt` files
- [ ] LocalStorage auto-save
- [ ] Regex support in Find & Replace
- [ ] Keyboard shortcuts
- [ ] Dark mode toggle

### Technical
- [ ] No UI freezing with 10,000 lines
- [ ] Clean, commented code
- [ ] Proper error handling
- [ ] Unicode/Cyrillic text support
- [ ] Deployed and publicly accessible

***

## 8. Testing Scenarios

### Performance Test
1. Paste 10,000 lines (generate programmatically if needed)
2. Apply "All UPPERCASE" -> should complete in <1s
3. Undo -> should be instant
4. Apply "Sort A-Z" -> should complete in <2s

### Functionality Test
1. Input: `  сОк  цЕНа  -вишня  `
2. Apply "Remove extra spaces" -> `сОк цЕНа -вишня`
3. Apply "Remove after ' -'" -> `сОк цЕНа`
4. Apply "Title Case" -> `Сок Цена`
5. Undo 3 times -> back to original

### Edge Cases
- Empty input
- Single character lines
- Lines with only whitespace
- Mixed Cyrillic/Latin text
- Special Unicode characters (emoji, etc.)

***

## 9. Evaluation Criteria

| Criterion | Weight | Details |
|-----------|--------|---------|
| **Functionality** | 30% | All operations work correctly |
| **Performance** | 25% | Handles 10k lines smoothly |
| **Code Quality** | 20% | Clean architecture, readable code |
| **UX/UI** | 15% | Intuitive, polished interface |
| **Edge Cases** | 10% | Proper handling of Unicode, empty lines, etc. |

***

## 10. Bonus Points

- Regex support in Find & Replace
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S for save)
- Batch operations (apply multiple transformations at once)
- Export operation history as JSON
- Dark/light theme toggle
- Progressive Web App (PWA) support
- Animated transitions for UI feedback
- Custom operation builder (user-defined transformations)

***

## Getting Started Tips

1. **Start simple**: Get basic textarea + 1-2 operations working first
2. **Test early**: Use 1000 lines to verify performance approach works
3. **Separate logic**: Keep text transformations in pure utility functions
4. **Use memoization**: Cache computed values (line counts, metrics)
5. **Debounce metrics**: Don't recalculate on every keystroke
6. **Version control**: Commit frequently as you add features

***

**Good luck! Focus on clean code, smooth UX, and solid performance. The goal is to demonstrate your ability to build a production-quality tool with attention to detail.**
