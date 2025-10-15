/**
 * Widget Examples for Beginners
 * Simple, easy-to-understand widget implementations
 */

/**
 * EXAMPLE 1: Simple Clock Widget
 * Shows current time that updates every second
 */
export const createSimpleClockWidget = () => {
  return {
    type: 'clock',
    title: 'Clock',
    config: {
      showSeconds: true,
      locale: 'en-US'
    },
    position: 0
  }
}

/**
 * EXAMPLE 2: Personal Notes Widget
 * A simple notepad for quick notes
 */
export const createNotesWidget = () => {
  return {
    type: 'notes',
    title: 'My Notes',
    data: {
      notes: 'Write your notes here...'
    },
    position: 1
  }
}

/**
 * EXAMPLE 3: Todo List Widget
 * Manage your daily tasks
 */
export const createTodoWidget = () => {
  return {
    type: 'todo',
    title: 'My Tasks',
    data: {
      todos: [
        { text: 'Learn about Leon AI', completed: false },
        { text: 'Create custom widgets', completed: false },
        { text: 'Explore widget features', completed: false }
      ]
    },
    position: 2
  }
}

/**
 * EXAMPLE 4: Quick Links Widget
 * Bookmark your favorite websites
 */
export const createQuickLinksWidget = () => {
  return {
    type: 'quick-links',
    title: 'Quick Links',
    data: {
      links: [
        { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
        { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
        { title: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '📖' },
        { title: 'Leon AI', url: 'https://getleon.ai', icon: '🤖' }
      ]
    },
    position: 3
  }
}

/**
 * EXAMPLE 5: Stats Widget
 * Display key metrics and statistics
 */
export const createStatsWidget = () => {
  return {
    type: 'stats',
    title: 'Dashboard Stats',
    data: {
      stats: [
        { label: 'Tasks', value: '12' },
        { label: 'Completed', value: '8' },
        { label: 'Pending', value: '4' }
      ]
    },
    position: 4
  }
}

/**
 * EXAMPLE 6: Weather Widget
 * Display weather information
 */
export const createWeatherWidget = (location = 'Your City') => {
  return {
    type: 'weather',
    title: 'Weather',
    config: {
      location: location
    },
    data: {
      temp: '72',
      condition: 'Sunny',
      location: location
    },
    position: 5
  }
}

/**
 * EXAMPLE 7: Custom HTML Widget
 * Create your own custom widget with HTML
 */
export const createCustomWidget = (title, htmlContent) => {
  return {
    type: 'custom',
    title: title,
    content: htmlContent,
    position: 6
  }
}

/**
 * HOW TO USE THESE EXAMPLES:
 * 
 * 1. Import the widget manager in your code:
 *    import WidgetManager from './widget-manager'
 *    import { createSimpleClockWidget } from './widget-examples'
 * 
 * 2. Initialize the widget manager:
 *    const widgetManager = new WidgetManager()
 *    await widgetManager.init('widgets-container')
 * 
 * 3. Add a widget using the examples:
 *    const clockWidget = createSimpleClockWidget()
 *    await widgetManager.addWidget(clockWidget)
 * 
 * 4. Or create your own custom widget:
 *    const myWidget = {
 *      type: 'custom',
 *      title: 'My Custom Widget',
 *      content: '<h2>Hello World!</h2><p>This is my custom widget</p>',
 *      position: 0
 *    }
 *    await widgetManager.addWidget(myWidget)
 */

/**
 * BEGINNER TIPS:
 * 
 * 1. Widget Types:
 *    - 'clock': Shows current time
 *    - 'weather': Displays weather info
 *    - 'notes': Simple notepad
 *    - 'quick-links': Bookmark links
 *    - 'stats': Show statistics
 *    - 'todo': Task list
 *    - 'custom': Your own HTML
 * 
 * 2. Widget Structure:
 *    {
 *      type: 'widget-type',        // Required: Type of widget
 *      title: 'Widget Title',      // Required: Display title
 *      config: { ... },            // Optional: Widget settings
 *      data: { ... },              // Optional: Widget data
 *      position: 0                 // Optional: Display order
 *    }
 * 
 * 3. Updating Widget Data:
 *    await widgetManager.updateWidget(widgetId, {
 *      data: { newData: 'value' }
 *    })
 * 
 * 4. Deleting a Widget:
 *    await widgetManager.deleteWidget(widgetId)
 * 
 * 5. Widget Positions:
 *    - Widgets are displayed in a grid layout
 *    - Position determines the order (0, 1, 2, ...)
 *    - You can drag and drop to reorder
 */

/**
 * ADVANCED: Creating a Custom Widget Type
 * 
 * To create a completely new widget type:
 * 
 * 1. Add a new case in widget-manager.js renderWidgetContent():
 *    case 'my-widget':
 *      return this.renderMyWidget(widget)
 * 
 * 2. Create the render function:
 *    renderMyWidget(widget) {
 *      return `
 *        <div class="my-widget">
 *          <h3>${widget.data.title}</h3>
 *          <p>${widget.data.content}</p>
 *        </div>
 *      `
 *    }
 * 
 * 3. Add styles in widgets.scss:
 *    .my-widget {
 *      padding: 1rem;
 *      h3 { color: #fff; }
 *    }
 * 
 * 4. Use your new widget:
 *    const myCustomWidget = {
 *      type: 'my-widget',
 *      title: 'My Widget',
 *      data: {
 *        title: 'Hello',
 *        content: 'This is my custom widget type!'
 *      }
 *    }
 */

// Export all examples as a collection
export const widgetExamples = {
  clock: createSimpleClockWidget,
  notes: createNotesWidget,
  todo: createTodoWidget,
  quickLinks: createQuickLinksWidget,
  stats: createStatsWidget,
  weather: createWeatherWidget,
  custom: createCustomWidget
}

export default widgetExamples
