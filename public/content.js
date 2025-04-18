
const data = {
  companyName: "TechCorp",
  matchScore: 86,
  accountStatus: "Target"
};

class LinkedInProfileEnhancer {
  constructor() {
    this.isWidgetVisible = true;
    this.init();
  }

  async init() {
    await this.loadVisibilityState();
    this.createWidget();
    this.createToggleButton();
    this.updateWidgetVisibility();
  }

  async loadVisibilityState() {
    const result = await chrome.storage.local.get('widgetVisible');
    this.isWidgetVisible = result.widgetVisible !== false;
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'lpe-widget';
    widget.innerHTML = `
      <div class="lpe-widget-header">
        <h3 class="lpe-company-name">${data.companyName}</h3>
      </div>
      <div class="lpe-score-container">
        <div class="lpe-progress-bar">
          <div class="lpe-progress" style="width: ${data.matchScore}%"></div>
        </div>
        <div style="margin-top: 8px;">
          Match Score: ${data.matchScore}%
        </div>
      </div>
      <div class="lpe-status ${data.accountStatus.toLowerCase()}">${data.accountStatus}</div>
    `;
    document.body.appendChild(widget);
    this.widget = widget;
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'lpe-toggle-btn';
    button.innerHTML = '👁️';
    button.addEventListener('click', () => this.toggleWidget());
    document.body.appendChild(button);
    this.toggleButton = button;
  }

  async toggleWidget() {
    this.isWidgetVisible = !this.isWidgetVisible;
    await chrome.storage.local.set({ widgetVisible: this.isWidgetVisible });
    this.updateWidgetVisibility();
  }

  updateWidgetVisibility() {
    if (this.isWidgetVisible) {
      this.widget.classList.remove('hidden');
      this.toggleButton.classList.remove('hidden');
    } else {
      this.widget.classList.add('hidden');
      this.toggleButton.classList.add('hidden');
    }
  }
}

// Initialize the widget when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LinkedInProfileEnhancer());
} else {
  new LinkedInProfileEnhancer();
}
