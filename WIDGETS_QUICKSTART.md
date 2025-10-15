# 🚀 Widgets Quick Start Guide

## For Complete Beginners

This guide will help you add customizable widgets to your Leon AI dashboard in just a few minutes!

---

## ✨ What Are Widgets?

Widgets are small, interactive UI elements you can add to your dashboard. Think of them like apps on your phone's home screen - each one does something useful!

**Available Widgets:**
- 🕐 **Clock** - Shows current time and date
- 📝 **Notes** - Quick notepad for ideas
- ✅ **Todo List** - Manage your tasks
- 🔗 **Quick Links** - Bookmark favorite websites
- 📊 **Stats** - Display numbers and metrics
- 🌤️ **Weather** - Show weather info

---

## 🎯 Method 1: Using the UI (Easiest!)

### Step 1: Access Widgets
1. Start your Leon AI server
2. Open the web interface in your browser
3. Look for the **"Widgets"** button at the top
4. Click it!

### Step 2: Add Your First Widget
1. Click the **"Add Widget"** button
2. You'll see a dialog with widget types
3. Click on any widget type (try **Clock** first!)
4. The widget appears instantly! 🎉

### Step 3: Customize Your Widget
- **Move it:** Drag the widget header to reorder
- **Remove it:** Click the **×** button
- **Refresh it:** Click the **↻** button
- **Edit content:** Type directly in Notes or Todo widgets

### Step 4: Add More Widgets
Repeat Step 2 to add as many widgets as you want!

---

## 💻 Method 2: Using Code (For Developers)

### Basic Example

Open your browser's developer console (F12) and paste this:

```javascript
// Get the widget manager instance
const widgetManager = window.widgetManager

// Add a clock widget
await widgetManager.addWidget({
  type: 'clock',
  title: 'My Clock',
  position: 0
})

// Add a notes widget
await widgetManager.addWidget({
  type: 'notes',
  title: 'Quick Notes',
  data: { notes: 'Write your notes here...' },
  position: 1
})

// Add a todo list
await widgetManager.addWidget({
  type: 'todo',
  title: 'My Tasks',
  data: {
    todos: [
      { text: 'Learn Leon AI', completed: false },
      { text: 'Add widgets', completed: true }
    ]
  },
  position: 2
})
```

---

## 🎨 Widget Types Explained

### 1. Clock Widget
```javascript
{
  type: 'clock',
  title: 'Clock',
  config: {
    showSeconds: true,  // Show seconds? true/false
    locale: 'en-US'     // Language format
  }
}
```

### 2. Notes Widget
```javascript
{
  type: 'notes',
  title: 'My Notes',
  data: {
    notes: 'Your text here...'
  }
}
```

### 3. Todo Widget
```javascript
{
  type: 'todo',
  title: 'Tasks',
  data: {
    todos: [
      { text: 'Task 1', completed: false },
      { text: 'Task 2', completed: true }
    ]
  }
}
```

### 4. Quick Links Widget
```javascript
{
  type: 'quick-links',
  title: 'Bookmarks',
  data: {
    links: [
      { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
      { title: 'Google', url: 'https://google.com', icon: '🔍' }
    ]
  }
}
```

### 5. Stats Widget
```javascript
{
  type: 'stats',
  title: 'My Stats',
  data: {
    stats: [
      { label: 'Tasks', value: '10' },
      { label: 'Done', value: '7' }
    ]
  }
}
```

### 6. Weather Widget
```javascript
{
  type: 'weather',
  title: 'Weather',
  data: {
    temp: '72',
    condition: 'Sunny',
    location: 'New York'
  }
}
```

---

## 🛠️ Common Tasks

### How to Update a Widget

```javascript
// First, find the widget ID (shown in browser console)
const widgetId = 'widget-1234567890-abc'

// Update the widget
await widgetManager.updateWidget(widgetId, {
  title: 'New Title',
  data: { notes: 'Updated content' }
})
```

### How to Delete a Widget

**Method 1 (Easy):** Click the **×** button on the widget

**Method 2 (Code):**
```javascript
await widgetManager.deleteWidget('widget-1234567890-abc')
```

### How to Create a Custom Widget

```javascript
await widgetManager.addWidget({
  type: 'custom',
  title: 'My Custom Widget',
  content: `
    <div style="padding: 1rem; text-align: center;">
      <h2>Hello!</h2>
      <p>This is my custom widget</p>
      <button onclick="alert('Clicked!')">Click Me</button>
    </div>
  `
})
```

---

## 📍 Widget Placement

### Where Do Widgets Appear?

Widgets are displayed in a **grid layout**:
- **Desktop:** 3-4 columns
- **Tablet:** 2 columns  
- **Mobile:** 1 column (stacked)

### How to Reorder Widgets

**Method 1 (Drag & Drop):**
1. Click and hold the widget header
2. Drag to the desired position
3. Drop on another widget to swap places

**Method 2 (Position Number):**
```javascript
// Set widget position (0 = first, 1 = second, etc.)
await widgetManager.updateWidget(widgetId, {
  position: 0  // Move to first position
})
```

---

## 🎓 Beginner-Friendly Examples

### Example 1: Personal Dashboard

Create a simple personal dashboard with essential widgets:

```javascript
// Clock
await widgetManager.addWidget({
  type: 'clock',
  title: 'Time',
  position: 0
})

// Quick notes
await widgetManager.addWidget({
  type: 'notes',
  title: 'Scratch Pad',
  position: 1
})

// Daily tasks
await widgetManager.addWidget({
  type: 'todo',
  title: 'Today',
  data: {
    todos: [
      { text: 'Morning meeting', completed: false },
      { text: 'Lunch at 12pm', completed: false },
      { text: 'Review code', completed: false }
    ]
  },
  position: 2
})
```

### Example 2: Developer Dashboard

Perfect for coding sessions:

```javascript
// Quick links to dev tools
await widgetManager.addWidget({
  type: 'quick-links',
  title: 'Dev Tools',
  data: {
    links: [
      { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
      { title: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '📖' },
      { title: 'VS Code', url: 'vscode://file/', icon: '💻' }
    ]
  },
  position: 0
})

// Project stats
await widgetManager.addWidget({
  type: 'stats',
  title: 'Project Stats',
  data: {
    stats: [
      { label: 'Commits', value: '42' },
      { label: 'PRs', value: '5' },
      { label: 'Issues', value: '3' }
    ]
  },
  position: 1
})
```

### Example 3: Student Dashboard

Great for studying and organizing:

```javascript
// Study tasks
await widgetManager.addWidget({
  type: 'todo',
  title: 'Study Plan',
  data: {
    todos: [
      { text: 'Read Chapter 5', completed: false },
      { text: 'Complete homework', completed: false },
      { text: 'Review notes', completed: false }
    ]
  },
  position: 0
})

// Important links
await widgetManager.addWidget({
  type: 'quick-links',
  title: 'Resources',
  data: {
    links: [
      { title: 'Course Portal', url: 'https://school.edu', icon: '🎓' },
      { title: 'Library', url: 'https://library.edu', icon: '📚' },
      { title: 'Calendar', url: 'https://calendar.edu', icon: '📅' }
    ]
  },
  position: 1
})

// Study notes
await widgetManager.addWidget({
  type: 'notes',
  title: 'Quick Notes',
  data: { notes: 'Important formulas and concepts...' },
  position: 2
})
```

---

## 🎨 Styling Tips

### Change Widget Colors (Advanced)

Add custom CSS in your browser's developer tools:

```css
/* Make a widget stand out */
#widget-id {
  border: 2px solid #1c75db;
  background: rgba(28, 117, 219, 0.1);
}

/* Customize widget title */
.widget-title {
  color: #ed297a;
  font-size: 1.2rem;
}
```

---

## ❓ Troubleshooting

### Widget Not Showing Up?

1. **Check if widgets section is visible**
   - Click the "Widgets" button at the top
   
2. **Refresh the page**
   - Press F5 or Ctrl+R
   
3. **Check browser console**
   - Press F12 and look for errors

### Can't Edit Widget Content?

- **Notes Widget:** Click inside the text area and type
- **Todo Widget:** Use the input field at the bottom
- **Other Widgets:** Update via code (see examples above)

### Widgets Disappeared After Refresh?

- Widgets are stored in memory by default
- To persist widgets, you need to implement database storage
- See the full documentation for database integration

---

## 🚀 Next Steps

### Ready for More?

1. **Read the Full Guide:** Check out `WIDGETS_GUIDE.md` for advanced features
2. **Explore Examples:** Look at `app/src/js/widget-examples.js`
3. **Create Custom Types:** Learn to build your own widget types
4. **Connect APIs:** Integrate real data (weather, stocks, etc.)

### Share Your Creations!

Created something cool? Share it with the Leon AI community on Discord!

---

## 📚 Quick Reference

### Widget Structure
```javascript
{
  type: 'widget-type',    // Required
  title: 'Title',         // Required
  config: { ... },        // Optional
  data: { ... },          // Optional
  position: 0,            // Optional
  content: '<html>'       // For custom widgets
}
```

### Common Commands
```javascript
// Add widget
await widgetManager.addWidget({ type: 'clock', title: 'Clock' })

// Update widget
await widgetManager.updateWidget(id, { title: 'New Title' })

// Delete widget
await widgetManager.deleteWidget(id)

// Refresh widget
await widgetManager.refreshWidget(id)
```

---

## 🎉 You're Ready!

Start building your perfect dashboard now. Remember:
- Start simple with the UI
- Experiment with different widget types
- Use code for advanced customization
- Have fun! 🚀

**Need Help?** Join the Leon AI Discord community!
