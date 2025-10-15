/**
 * Widget Manager - Handles dashboard widgets
 * Provides functionality to create, manage, and render customizable widgets
 */

class WidgetManager {
  constructor() {
    this.widgets = []
    this.container = null
    this.apiBaseUrl = '/api/widgets'
    this.userId = 'default'
    this.draggedWidget = null
  }

  /**
   * Initialize the widget manager
   */
  async init(containerId = 'widgets-container') {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      console.error(`Widget container #${containerId} not found`)
      return
    }

    await this.loadWidgets()
    this.renderWidgets()
    this.setupEventListeners()
  }

  /**
   * Load widgets from the server
   */
  async loadWidgets() {
    try {
      const response = await fetch(`${this.apiBaseUrl}?userId=${this.userId}`)
      const data = await response.json()
      if (data.success) {
        this.widgets = data.widgets
      }
    } catch (error) {
      console.error('Failed to load widgets:', error)
    }
  }

  /**
   * Add a new widget
   */
  async addWidget(widgetConfig) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.userId,
          widget: widgetConfig
        })
      })
      const data = await response.json()
      if (data.success) {
        this.widgets.push(data.widget)
        this.renderWidgets()
        return data.widget
      }
    } catch (error) {
      console.error('Failed to add widget:', error)
    }
  }

  /**
   * Update an existing widget
   */
  async updateWidget(widgetId, updates) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${widgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.userId,
          widget: updates
        })
      })
      const data = await response.json()
      if (data.success) {
        const index = this.widgets.findIndex(w => w.id === widgetId)
        if (index !== -1) {
          this.widgets[index] = data.widget
          this.renderWidgets()
        }
      }
    } catch (error) {
      console.error('Failed to update widget:', error)
    }
  }

  /**
   * Delete a widget
   */
  async deleteWidget(widgetId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${widgetId}?userId=${this.userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        this.widgets = this.widgets.filter(w => w.id !== widgetId)
        this.renderWidgets()
      }
    } catch (error) {
      console.error('Failed to delete widget:', error)
    }
  }

  /**
   * Render all widgets
   */
  renderWidgets() {
    if (!this.container) return

    this.container.innerHTML = ''
    
    // Sort widgets by position
    const sortedWidgets = [...this.widgets].sort((a, b) => {
      return (a.position || 0) - (b.position || 0)
    })

    sortedWidgets.forEach(widget => {
      const widgetElement = this.createWidgetElement(widget)
      this.container.appendChild(widgetElement)
    })
  }

  /**
   * Create a widget DOM element
   */
  createWidgetElement(widget) {
    const widgetDiv = document.createElement('div')
    widgetDiv.className = `widget widget-${widget.type}`
    widgetDiv.id = widget.id
    widgetDiv.draggable = true
    widgetDiv.dataset.widgetId = widget.id

    // Widget header
    const header = document.createElement('div')
    header.className = 'widget-header'
    header.innerHTML = `
      <h3 class="widget-title">${widget.title || 'Widget'}</h3>
      <div class="widget-controls">
        <button class="widget-btn widget-refresh" title="Refresh">↻</button>
        <button class="widget-btn widget-settings" title="Settings">⚙</button>
        <button class="widget-btn widget-close" title="Remove">×</button>
      </div>
    `

    // Widget body
    const body = document.createElement('div')
    body.className = 'widget-body'
    body.innerHTML = this.renderWidgetContent(widget)

    widgetDiv.appendChild(header)
    widgetDiv.appendChild(body)

    // Add event listeners
    this.attachWidgetEventListeners(widgetDiv, widget)

    return widgetDiv
  }

  /**
   * Render widget content based on type
   */
  renderWidgetContent(widget) {
    switch (widget.type) {
      case 'clock':
        return this.renderClockWidget(widget)
      case 'weather':
        return this.renderWeatherWidget(widget)
      case 'notes':
        return this.renderNotesWidget(widget)
      case 'quick-links':
        return this.renderQuickLinksWidget(widget)
      case 'stats':
        return this.renderStatsWidget(widget)
      case 'todo':
        return this.renderTodoWidget(widget)
      case 'custom':
        return widget.content || '<p>Custom widget content</p>'
      default:
        return '<p>Unknown widget type</p>'
    }
  }

  /**
   * Clock widget renderer
   */
  renderClockWidget(widget) {
    const now = new Date()
    const timeString = now.toLocaleTimeString(widget.config?.locale || 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: widget.config?.showSeconds ? '2-digit' : undefined
    })
    const dateString = now.toLocaleDateString(widget.config?.locale || 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
      <div class="clock-widget">
        <div class="clock-time">${timeString}</div>
        <div class="clock-date">${dateString}</div>
      </div>
    `
  }

  /**
   * Weather widget renderer
   */
  renderWeatherWidget(widget) {
    const weather = widget.data || {
      temp: '--',
      condition: 'Loading...',
      location: widget.config?.location || 'Unknown'
    }

    return `
      <div class="weather-widget">
        <div class="weather-location">${weather.location}</div>
        <div class="weather-temp">${weather.temp}°</div>
        <div class="weather-condition">${weather.condition}</div>
      </div>
    `
  }

  /**
   * Notes widget renderer
   */
  renderNotesWidget(widget) {
    const notes = widget.data?.notes || ''
    return `
      <div class="notes-widget">
        <textarea class="notes-input" placeholder="Write your notes here...">${notes}</textarea>
      </div>
    `
  }

  /**
   * Quick links widget renderer
   */
  renderQuickLinksWidget(widget) {
    const links = widget.data?.links || []
    const linksHtml = links.map(link => `
      <a href="${link.url}" target="_blank" class="quick-link">
        <span class="quick-link-icon">${link.icon || '🔗'}</span>
        <span class="quick-link-title">${link.title}</span>
      </a>
    `).join('')

    return `
      <div class="quick-links-widget">
        ${linksHtml || '<p class="empty-state">No links added yet</p>'}
      </div>
    `
  }

  /**
   * Stats widget renderer
   */
  renderStatsWidget(widget) {
    const stats = widget.data?.stats || []
    const statsHtml = stats.map(stat => `
      <div class="stat-item">
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('')

    return `
      <div class="stats-widget">
        ${statsHtml || '<p class="empty-state">No stats available</p>'}
      </div>
    `
  }

  /**
   * Todo widget renderer
   */
  renderTodoWidget(widget) {
    const todos = widget.data?.todos || []
    const todosHtml = todos.map((todo, index) => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete" data-index="${index}">×</button>
      </div>
    `).join('')

    return `
      <div class="todo-widget">
        <div class="todo-list">
          ${todosHtml || '<p class="empty-state">No todos yet</p>'}
        </div>
        <div class="todo-input-container">
          <input type="text" class="todo-input" placeholder="Add a new todo...">
          <button class="todo-add-btn">+</button>
        </div>
      </div>
    `
  }

  /**
   * Attach event listeners to widget
   */
  attachWidgetEventListeners(widgetElement, widget) {
    // Close button
    const closeBtn = widgetElement.querySelector('.widget-close')
    closeBtn?.addEventListener('click', () => {
      this.deleteWidget(widget.id)
    })

    // Refresh button
    const refreshBtn = widgetElement.querySelector('.widget-refresh')
    refreshBtn?.addEventListener('click', () => {
      this.refreshWidget(widget.id)
    })

    // Drag events
    widgetElement.addEventListener('dragstart', (e) => {
      this.draggedWidget = widget.id
      widgetElement.classList.add('dragging')
    })

    widgetElement.addEventListener('dragend', (e) => {
      widgetElement.classList.remove('dragging')
      this.draggedWidget = null
    })

    widgetElement.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    widgetElement.addEventListener('drop', (e) => {
      e.preventDefault()
      if (this.draggedWidget && this.draggedWidget !== widget.id) {
        this.swapWidgets(this.draggedWidget, widget.id)
      }
    })

    // Widget-specific event listeners
    this.attachWidgetTypeListeners(widgetElement, widget)
  }

  /**
   * Attach widget-type specific event listeners
   */
  attachWidgetTypeListeners(widgetElement, widget) {
    switch (widget.type) {
      case 'notes':
        const notesInput = widgetElement.querySelector('.notes-input')
        notesInput?.addEventListener('blur', (e) => {
          this.updateWidget(widget.id, {
            data: { notes: e.target.value }
          })
        })
        break

      case 'todo':
        // Add todo
        const addBtn = widgetElement.querySelector('.todo-add-btn')
        const todoInput = widgetElement.querySelector('.todo-input')
        addBtn?.addEventListener('click', () => {
          if (todoInput.value.trim()) {
            const todos = widget.data?.todos || []
            todos.push({ text: todoInput.value, completed: false })
            this.updateWidget(widget.id, { data: { todos } })
            todoInput.value = ''
          }
        })

        // Toggle todo
        widgetElement.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
          checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index)
            const todos = widget.data?.todos || []
            todos[index].completed = e.target.checked
            this.updateWidget(widget.id, { data: { todos } })
          })
        })

        // Delete todo
        widgetElement.querySelectorAll('.todo-delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index)
            const todos = widget.data?.todos || []
            todos.splice(index, 1)
            this.updateWidget(widget.id, { data: { todos } })
          })
        })
        break

      case 'clock':
        // Update clock every second
        const updateClock = () => {
          const clockWidget = widgetElement.querySelector('.clock-widget')
          if (clockWidget) {
            clockWidget.innerHTML = this.renderClockWidget(widget).match(/<div class="clock-widget">([\s\S]*)<\/div>/)[1]
          }
        }
        setInterval(updateClock, 1000)
        break
    }
  }

  /**
   * Refresh a specific widget
   */
  async refreshWidget(widgetId) {
    const widget = this.widgets.find(w => w.id === widgetId)
    if (widget) {
      // Refresh widget data based on type
      if (widget.type === 'weather') {
        // Fetch weather data (placeholder)
        console.log('Refreshing weather widget...')
      }
      this.renderWidgets()
    }
  }

  /**
   * Swap positions of two widgets
   */
  swapWidgets(widgetId1, widgetId2) {
    const widget1 = this.widgets.find(w => w.id === widgetId1)
    const widget2 = this.widgets.find(w => w.id === widgetId2)

    if (widget1 && widget2) {
      const pos1 = widget1.position || 0
      const pos2 = widget2.position || 0

      this.updateWidget(widgetId1, { position: pos2 })
      this.updateWidget(widgetId2, { position: pos1 })
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Add widget button
    const addWidgetBtn = document.getElementById('add-widget-btn')
    addWidgetBtn?.addEventListener('click', () => {
      this.showAddWidgetDialog()
    })
  }

  /**
   * Show dialog to add a new widget
   */
  showAddWidgetDialog() {
    const dialog = document.getElementById('add-widget-dialog')
    if (dialog) {
      dialog.style.display = 'flex'
    }
  }

  /**
   * Hide add widget dialog
   */
  hideAddWidgetDialog() {
    const dialog = document.getElementById('add-widget-dialog')
    if (dialog) {
      dialog.style.display = 'none'
    }
  }
}

// Export for use in other modules
export default WidgetManager
