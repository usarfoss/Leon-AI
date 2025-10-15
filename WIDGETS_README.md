# 🎨 Leon AI Dashboard Widgets

A powerful, customizable widgets system for the Leon AI dashboard that allows users to add interactive UI elements to personalize their experience.

---

## 🌟 Features

- **6 Built-in Widget Types** - Clock, Weather, Notes, Quick Links, Stats, and Todo List
- **Custom Widgets** - Create your own with HTML/CSS/JavaScript
- **Drag & Drop** - Reorder widgets easily
- **Persistent Storage** - Widgets are saved via API
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live clock and interactive elements
- **Beginner-Friendly** - Easy to use with UI or code

---

## 📦 What's Included

### Backend (Server)
- **File:** `server/src/core/http-server/old-server.js`
- **Features:**
  - RESTful API endpoints for widgets (GET, POST, PUT, DELETE)
  - In-memory storage (easily replaceable with database)
  - User-specific widget management

### Frontend (Client)
- **Widget Manager:** `app/src/js/widget-manager.js`
  - Core widget management logic
  - Rendering engine for all widget types
  - Event handling and drag-drop functionality

- **Widget Examples:** `app/src/js/widget-examples.js`
  - Pre-built widget configurations
  - Beginner-friendly examples
  - Usage documentation

- **Styles:** `app/src/css/widgets.scss`
  - Beautiful, modern widget styling
  - Responsive grid layout
  - Glassmorphism effects
  - Dark theme compatible

- **HTML:** `app/src/index.html`
  - Widgets section container
  - Add widget dialog
  - Toggle button integration

---

## 🚀 Quick Start

### For Users (UI Method)

1. Start Leon AI server
2. Open web interface
3. Click **"Widgets"** button
4. Click **"Add Widget"**
5. Choose a widget type
6. Done! 🎉

### For Developers (Code Method)

```javascript
import WidgetManager from './widget-manager'

// Initialize
const widgetManager = new WidgetManager()
await widgetManager.init('widgets-container')

// Add a widget
await widgetManager.addWidget({
  type: 'clock',
  title: 'My Clock',
  position: 0
})
```

---

## 📋 Available Widget Types

| Widget | Icon | Description | Use Case |
|--------|------|-------------|----------|
| **Clock** | 🕐 | Real-time clock with date | Time tracking, timezone display |
| **Weather** | 🌤️ | Weather information | Quick weather check |
| **Notes** | 📝 | Simple notepad | Quick notes, reminders |
| **Quick Links** | 🔗 | Bookmarked links | Favorite websites, resources |
| **Stats** | 📊 | Display metrics | KPIs, progress tracking |
| **Todo** | ✅ | Task management | Daily tasks, checklists |
| **Custom** | 🎨 | Your own HTML | Unlimited possibilities |

---

## 🎯 Widget Placement

### Grid Layout
Widgets are displayed in a responsive grid:
- **Desktop:** 3-4 columns (auto-fit, min 280px)
- **Tablet:** 2 columns
- **Mobile:** 1 column (stacked)

### Positioning
- Widgets have a `position` property (0, 1, 2, ...)
- Drag & drop to reorder
- Automatically saved

---

## 🛠️ API Endpoints

### GET `/api/widgets`
Get all widgets for a user
```javascript
GET /api/widgets?userId=default
```

### POST `/api/widgets`
Create a new widget
```javascript
POST /api/widgets
Body: { userId: 'default', widget: {...} }
```

### PUT `/api/widgets/:id`
Update a widget
```javascript
PUT /api/widgets/:id
Body: { userId: 'default', widget: {...} }
```

### DELETE `/api/widgets/:id`
Delete a widget
```javascript
DELETE /api/widgets/:id?userId=default
```

---

## 📖 Documentation

- **Quick Start Guide:** `WIDGETS_QUICKSTART.md` - For beginners
- **Full Documentation:** `WIDGETS_GUIDE.md` - Comprehensive guide
- **Code Examples:** `app/src/js/widget-examples.js` - Ready-to-use examples

---

## 🎓 Example Use Cases

### Personal Dashboard
- Clock for time tracking
- Notes for quick thoughts
- Todo list for daily tasks

### Developer Dashboard
- Quick links to GitHub, docs, tools
- Stats for project metrics
- Notes for code snippets

### Student Dashboard
- Study task list
- Quick links to course materials
- Notes for important concepts

### Business Dashboard
- Stats for KPIs
- Quick links to tools
- Todo for action items

---

## 🔧 Customization

### Create Custom Widget Type

1. **Add renderer** in `widget-manager.js`
2. **Add styles** in `widgets.scss`
3. **Add event listeners** if needed
4. **Use your widget**

Example:
```javascript
// 1. Add to renderWidgetContent()
case 'my-widget':
  return this.renderMyWidget(widget)

// 2. Create render function
renderMyWidget(widget) {
  return `<div class="my-widget">${widget.data.content}</div>`
}

// 3. Add styles
.my-widget {
  padding: 1rem;
  color: #fff;
}

// 4. Use it
await widgetManager.addWidget({
  type: 'my-widget',
  title: 'My Widget',
  data: { content: 'Hello!' }
})
```

---

## 💡 Best Practices

### Design
- Keep widgets focused on one purpose
- Use clear, descriptive titles
- Provide visual feedback
- Make content scannable

### Performance
- Avoid heavy computations
- Limit number of widgets (6-12 recommended)
- Clean up event listeners
- Use efficient updates

### User Experience
- Provide default data
- Show loading states
- Handle errors gracefully
- Make widgets responsive

---

## 🔄 Persistence

### Current Implementation
- In-memory storage using JavaScript `Map`
- Data persists during server session
- Lost on server restart

### Database Integration (Recommended)

Replace the `widgetsStore` in `old-server.js`:

```javascript
// MongoDB example
const widgetsStore = {
  async get(userId) {
    return await db.collection('widgets').findOne({ userId })
  },
  async set(userId, widgets) {
    await db.collection('widgets').updateOne(
      { userId },
      { $set: { widgets } },
      { upsert: true }
    )
  }
}
```

---

## 🎨 Styling

### Theme
- Dark theme by default
- Glassmorphism effects
- Neon accents (pink/blue)
- Smooth animations

### Customization
All styles in `app/src/css/widgets.scss`:
- Widget container layout
- Individual widget styles
- Responsive breakpoints
- Color schemes

---

## 🐛 Troubleshooting

### Common Issues

**Widgets not appearing?**
- Check if widgets section is visible (click "Widgets" button)
- Check browser console for errors
- Verify widget-manager is initialized

**Styles not applied?**
- Ensure `widgets.scss` is imported in `style.scss`
- Clear browser cache
- Rebuild application

**Data not persisting?**
- Check server API endpoints
- Verify network requests
- Check server console
- Implement database storage for permanent persistence

---

## 🚀 Future Enhancements

### Potential Features
- Widget marketplace
- More widget types (calendar, RSS feed, etc.)
- Widget themes
- Widget sharing
- Advanced settings dialog
- Widget templates
- Import/export widgets
- Widget analytics

### API Integrations
- Real weather data
- Stock prices
- News feeds
- Social media
- Calendar events
- Email notifications

---

## 📝 File Structure

```
Leon-AI/
├── server/src/core/http-server/
│   └── old-server.js              # Widget API endpoints
├── app/src/
│   ├── js/
│   │   ├── widget-manager.js      # Core widget logic
│   │   ├── widget-examples.js     # Example widgets
│   │   └── main.js                # Integration
│   ├── css/
│   │   ├── widgets.scss           # Widget styles
│   │   └── style.scss             # Main styles (imports widgets)
│   └── index.html                 # HTML structure
├── WIDGETS_README.md              # This file
├── WIDGETS_QUICKSTART.md          # Beginner guide
└── WIDGETS_GUIDE.md               # Full documentation
```

---

## 🤝 Contributing

Want to improve the widgets system?

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Write documentation
5. Submit a pull request

### Ideas for Contributions
- New widget types
- Better styling
- Performance improvements
- Database integration examples
- API integration examples
- More documentation

---

## 📄 License

Part of Leon AI - follows the same license as the main project.

---

## 🎉 Get Started!

Ready to customize your dashboard?

1. **Beginners:** Start with `WIDGETS_QUICKSTART.md`
2. **Developers:** Check out `WIDGETS_GUIDE.md`
3. **Examples:** Look at `app/src/js/widget-examples.js`

**Questions?** Join the Leon AI Discord community!

---

## 📞 Support

- **Documentation:** See `WIDGETS_GUIDE.md`
- **Examples:** See `WIDGETS_QUICKSTART.md`
- **Community:** https://discord.gg/MNQqqKg
- **Issues:** GitHub Issues

---

**Made with ❤️ for the Leon AI community**
