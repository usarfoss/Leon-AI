# 🎨 Leon AI Dashboard Widgets Guide

## Overview

The Leon AI Dashboard now includes a powerful **Widgets System** that allows you to customize your dashboard with interactive UI elements. This guide will help you understand, use, and create your own widgets.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Available Widget Types](#available-widget-types)
3. [Using Widgets](#using-widgets)
4. [Creating Custom Widgets](#creating-custom-widgets)
5. [Widget Placement](#widget-placement)
6. [API Reference](#api-reference)
7. [Beginner Examples](#beginner-examples)
8. [Advanced Customization](#advanced-customization)

---

## 🚀 Getting Started

### Accessing the Widgets Dashboard

1. Start your Leon AI server
2. Open the web interface
3. Click the **"Widgets"** button in the top navigation
4. Click **"Add Widget"** to start adding widgets

### Quick Start for Beginners

The easiest way to add widgets is through the UI:

1. Click **"Widgets"** button
2. Click **"Add Widget"**
3. Choose a widget type from the dialog
4. The widget will appear on your dashboard!

---

## 🧩 Available Widget Types

### 1. 🕐 Clock Widget
**Purpose:** Display current time and date

**Features:**
- Real-time clock updates
- Customizable locale
- Optional seconds display
- Date formatting

**Use Cases:**
- Keep track of time while working
- Display time in different timezones
- Quick reference for date and time

---

### 2. 🌤️ Weather Widget
**Purpose:** Show weather information

**Features:**
- Temperature display
- Weather condition
- Location name
- Refreshable data

**Use Cases:**
- Check weather at a glance
- Plan your day
- Monitor conditions

**Note:** Currently shows placeholder data. Can be connected to a weather API.

---

### 3. 📝 Notes Widget
**Purpose:** Quick notepad for thoughts and reminders

**Features:**
- Simple text area
- Auto-save on blur
- Persistent storage
- Resizable

**Use Cases:**
- Quick notes during conversations
- Temporary reminders
- Draft messages
- Brainstorming

---

### 4. 🔗 Quick Links Widget
**Purpose:** Bookmark your favorite websites

**Features:**
- Clickable links
- Custom icons (emoji)
- Link titles
- Opens in new tab

**Use Cases:**
- Frequently visited sites
- Project resources
- Documentation links
- Social media shortcuts

**Example Links:**
```javascript
{
  links: [
    { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { title: 'Docs', url: 'https://docs.example.com', icon: '📖' }
  ]
}
```

---

### 5. 📊 Stats Widget
**Purpose:** Display key metrics and statistics

**Features:**
- Multiple stat items
- Value and label display
- Grid layout
- Color-coded values

**Use Cases:**
- Dashboard KPIs
- Task completion rates
- System metrics
- Progress tracking

**Example Stats:**
```javascript
{
  stats: [
    { label: 'Tasks', value: '12' },
    { label: 'Completed', value: '8' },
    { label: 'Pending', value: '4' }
  ]
}
```

---

### 6. ✅ Todo List Widget
**Purpose:** Manage your tasks and todos

**Features:**
- Add new tasks
- Check off completed items
- Delete tasks
- Persistent storage
- Visual completion state

**Use Cases:**
- Daily task management
- Project checklists
- Shopping lists
- Goal tracking

---

### 7. 🎨 Custom Widget
**Purpose:** Create your own widget with custom HTML

**Features:**
- Full HTML support
- Custom styling
- Flexible content
- Unlimited possibilities

**Use Cases:**
- Embed external content
- Custom visualizations
- Specialized tools
- Unique layouts

---

## 💡 Using Widgets

### Adding a Widget (UI Method)

1. Click **"Add Widget"** button
2. Select widget type from the dialog
3. Widget appears with default configuration
4. Customize the widget content

### Widget Controls

Each widget has three control buttons:

- **↻ Refresh:** Reload widget data
- **⚙ Settings:** Configure widget (coming soon)
- **× Remove:** Delete the widget

### Drag and Drop

- **Grab:** Click and hold the widget header
- **Move:** Drag to desired position
- **Drop:** Release to place widget
- Widgets automatically reorder

### Editing Widget Content

Different widgets have different editing methods:

- **Notes:** Type directly in the text area
- **Todo:** Use the input field and + button
- **Quick Links:** Edit via code (see API section)
- **Stats:** Update via code (see API section)

---

## 🛠️ Creating Custom Widgets

### Method 1: Using the Custom Widget Type

```javascript
const myWidget = {
  type: 'custom',
  title: 'My Custom Widget',
  content: `
    <div style="padding: 1rem;">
      <h3>Hello World!</h3>
      <p>This is my custom widget</p>
      <button onclick="alert('Clicked!')">Click Me</button>
    </div>
  `,
  position: 0
}

await widgetManager.addWidget(myWidget)
```

### Method 2: Using Widget Examples

```javascript
import { createCustomWidget } from './widget-examples'

const widget = createCustomWidget(
  'My Widget',
  '<h2>Custom Content</h2>'
)

await widgetManager.addWidget(widget)
```

### Method 3: Programmatic Creation

```javascript
// In your JavaScript code
import WidgetManager from './widget-manager'

const widgetManager = new WidgetManager()
await widgetManager.init('widgets-container')

// Add multiple widgets
const widgets = [
  { type: 'clock', title: 'Clock', position: 0 },
  { type: 'notes', title: 'Notes', position: 1 },
  { type: 'todo', title: 'Tasks', position: 2 }
]

for (const widget of widgets) {
  await widgetManager.addWidget(widget)
}
```

---

## 📍 Widget Placement

### Grid Layout

Widgets are displayed in a responsive grid:

- **Desktop:** 3-4 columns (auto-fit)
- **Tablet:** 2 columns
- **Mobile:** 1 column

### Positioning

Widgets have a `position` property (0, 1, 2, ...):

```javascript
{
  position: 0  // First widget
}
```

### Reordering

**Via Drag & Drop:**
- Drag widget to new position
- Drop on another widget to swap

**Via Code:**
```javascript
await widgetManager.updateWidget(widgetId, {
  position: 2
})
```

---

## 📚 API Reference

### WidgetManager Class

#### Initialize
```javascript
const widgetManager = new WidgetManager()
await widgetManager.init('widgets-container')
```

#### Add Widget
```javascript
const widget = await widgetManager.addWidget({
  type: 'clock',
  title: 'My Clock',
  config: { showSeconds: true },
  position: 0
})
```

#### Update Widget
```javascript
await widgetManager.updateWidget(widgetId, {
  title: 'Updated Title',
  data: { newData: 'value' }
})
```

#### Delete Widget
```javascript
await widgetManager.deleteWidget(widgetId)
```

#### Refresh Widget
```javascript
await widgetManager.refreshWidget(widgetId)
```

### Widget Configuration Object

```javascript
{
  type: 'widget-type',      // Required: 'clock', 'notes', 'todo', etc.
  title: 'Widget Title',    // Required: Display name
  config: {                 // Optional: Widget-specific settings
    showSeconds: true,
    locale: 'en-US'
  },
  data: {                   // Optional: Widget data
    notes: 'Some text',
    todos: [...]
  },
  position: 0,              // Optional: Display order
  content: '<html>'         // Optional: For custom widgets
}
```

### Server API Endpoints

#### GET /api/widgets
Get all widgets for a user
```javascript
fetch('/api/widgets?userId=default')
```

#### POST /api/widgets
Create a new widget
```javascript
fetch('/api/widgets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'default',
    widget: { type: 'clock', title: 'Clock' }
  })
})
```

#### PUT /api/widgets/:id
Update a widget
```javascript
fetch(`/api/widgets/${widgetId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'default',
    widget: { title: 'New Title' }
  })
})
```

#### DELETE /api/widgets/:id
Delete a widget
```javascript
fetch(`/api/widgets/${widgetId}?userId=default`, {
  method: 'DELETE'
})
```

---

## 🎓 Beginner Examples

### Example 1: Simple Dashboard Setup

```javascript
// Create a basic dashboard with essential widgets
import WidgetManager from './widget-manager'
import { widgetExamples } from './widget-examples'

const widgetManager = new WidgetManager()
await widgetManager.init('widgets-container')

// Add clock
await widgetManager.addWidget(widgetExamples.clock())

// Add notes
await widgetManager.addWidget(widgetExamples.notes())

// Add todo list
await widgetManager.addWidget(widgetExamples.todo())
```

### Example 2: Custom Quick Links

```javascript
const myLinks = {
  type: 'quick-links',
  title: 'My Favorites',
  data: {
    links: [
      { title: 'Gmail', url: 'https://gmail.com', icon: '📧' },
      { title: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
      { title: 'Drive', url: 'https://drive.google.com', icon: '💾' }
    ]
  }
}

await widgetManager.addWidget(myLinks)
```

### Example 3: Project Stats Dashboard

```javascript
const projectStats = {
  type: 'stats',
  title: 'Project Progress',
  data: {
    stats: [
      { label: 'Total Tasks', value: '50' },
      { label: 'Completed', value: '35' },
      { label: 'In Progress', value: '10' },
      { label: 'Blocked', value: '5' }
    ]
  }
}

await widgetManager.addWidget(projectStats)
```

### Example 4: Custom HTML Widget

```javascript
const customWidget = {
  type: 'custom',
  title: 'Welcome Message',
  content: `
    <div style="text-align: center; padding: 2rem;">
      <h2 style="color: #1c75db;">Welcome to Leon AI!</h2>
      <p>Your personal AI assistant</p>
      <button 
        onclick="alert('Hello!')" 
        style="padding: 0.5rem 1rem; background: #1c75db; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Say Hello
      </button>
    </div>
  `
}

await widgetManager.addWidget(customWidget)
```

---

## 🔧 Advanced Customization

### Creating a New Widget Type

#### Step 1: Add Renderer in widget-manager.js

```javascript
renderWidgetContent(widget) {
  switch (widget.type) {
    // ... existing cases
    case 'my-custom-type':
      return this.renderMyCustomWidget(widget)
    default:
      return '<p>Unknown widget type</p>'
  }
}

renderMyCustomWidget(widget) {
  return `
    <div class="my-custom-widget">
      <h3>${widget.data.title}</h3>
      <p>${widget.data.description}</p>
      <div class="custom-content">
        ${widget.data.content}
      </div>
    </div>
  `
}
```

#### Step 2: Add Styles in widgets.scss

```scss
.my-custom-widget {
  padding: 1rem;
  
  h3 {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
  }
  
  .custom-content {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 8px;
  }
}
```

#### Step 3: Add Event Listeners (if needed)

```javascript
attachWidgetTypeListeners(widgetElement, widget) {
  switch (widget.type) {
    // ... existing cases
    case 'my-custom-type':
      const button = widgetElement.querySelector('.custom-button')
      button?.addEventListener('click', () => {
        // Handle click
        this.updateWidget(widget.id, {
          data: { clicked: true }
        })
      })
      break
  }
}
```

#### Step 4: Use Your New Widget

```javascript
const myWidget = {
  type: 'my-custom-type',
  title: 'My Custom Widget',
  data: {
    title: 'Hello',
    description: 'This is my custom widget type',
    content: 'Custom content here'
  }
}

await widgetManager.addWidget(myWidget)
```

### Connecting to External APIs

```javascript
// Example: Real weather widget
async function createLiveWeatherWidget(city) {
  // Fetch weather data from API
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
  )
  const data = await response.json()
  
  return {
    type: 'weather',
    title: 'Live Weather',
    config: { location: city },
    data: {
      temp: Math.round(data.main.temp - 273.15), // Convert to Celsius
      condition: data.weather[0].description,
      location: city
    }
  }
}

// Use it
const weatherWidget = await createLiveWeatherWidget('London')
await widgetManager.addWidget(weatherWidget)
```

### Widget Persistence

Widgets are automatically saved to the server. To implement database persistence:

1. Replace the `Map` in `old-server.js` with a database
2. Implement save/load functions
3. Connect to your preferred database (MongoDB, PostgreSQL, etc.)

```javascript
// Example with a database
const widgetsStore = {
  async get(userId) {
    return await db.widgets.find({ userId })
  },
  async set(userId, widgets) {
    await db.widgets.updateOne(
      { userId },
      { $set: { widgets } },
      { upsert: true }
    )
  }
}
```

---

## 🎯 Best Practices

### 1. Widget Design
- Keep widgets focused on one purpose
- Use clear, descriptive titles
- Provide visual feedback for interactions
- Make content scannable

### 2. Performance
- Avoid heavy computations in render functions
- Use efficient update mechanisms
- Limit the number of widgets (recommended: 6-12)
- Clean up event listeners when widgets are removed

### 3. User Experience
- Provide default data for new widgets
- Show loading states when fetching data
- Handle errors gracefully
- Make widgets responsive

### 4. Code Organization
- Keep widget logic in separate files
- Use the examples file as a template
- Document custom widget types
- Follow the existing code style

---

## 🐛 Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Verify widget type is valid
- Ensure widget-manager is initialized
- Check if widgets container exists

### Styles Not Applied
- Verify widgets.scss is imported
- Check for CSS conflicts
- Clear browser cache
- Rebuild the application

### Data Not Persisting
- Check server API endpoints
- Verify network requests in DevTools
- Check server console for errors
- Ensure userId is consistent

### Drag and Drop Not Working
- Verify draggable attribute is set
- Check event listeners are attached
- Ensure no CSS conflicts with pointer-events
- Test in different browsers

---

## 📖 Additional Resources

- **Leon AI Documentation:** https://docs.getleon.ai
- **Widget Examples:** See `app/src/js/widget-examples.js`
- **Widget Manager:** See `app/src/js/widget-manager.js`
- **Styles:** See `app/src/css/widgets.scss`

---

## 🤝 Contributing

Want to add new widget types or improve existing ones?

1. Fork the repository
2. Create a new widget type
3. Add documentation
4. Submit a pull request

---

## 📝 License

This widgets system is part of Leon AI and follows the same license.

---

## 🎉 Happy Widget Building!

Start customizing your Leon AI dashboard today. If you create something cool, share it with the community!

**Questions?** Join the Leon AI Discord: https://discord.gg/MNQqqKg
