/**
 * The Gift Brief — SPA Router
 * Hash-based routing with transition support
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.appContainer = null;
    this.onBeforeNavigate = null;
    this.onAfterNavigate = null;
    this._initialized = false;
  }

  /**
   * Initialize the router
   * @param {string} containerId - ID of the main app container element
   */
  init(containerId) {
    this.appContainer = document.getElementById(containerId);
    if (!this.appContainer) {
      throw new Error(`Router: Container element #${containerId} not found`);
    }

    window.addEventListener('hashchange', () => this._handleRouteChange());
    this._initialized = true;

    // Handle initial route
    this._handleRouteChange();
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., 'home', 'input', 'insight')
   * @param {Function} handler - Function that returns HTML string or DOM element
   * @param {Object} options - { title, onEnter, onLeave }
   */
  register(path, handler, options = {}) {
    this.routes.set(path, { handler, ...options });
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {Object} params - Optional route parameters
   */
  async navigate(path, params = {}) {
    if (this.onBeforeNavigate) {
      const shouldContinue = await this.onBeforeNavigate(path, this.currentRoute);
      if (!shouldContinue) return;
    }

    window.location.hash = path;
  }

  /**
   * Get the current route path
   */
  getCurrentPath() {
    const hash = window.location.hash.slice(1) || 'home';
    return hash;
  }

  /**
   * Handle route changes
   */
  async _handleRouteChange() {
    const path = this.getCurrentPath();
    const route = this.routes.get(path);

    if (!route) {
      console.warn(`Router: No route registered for "${path}", falling back to home`);
      window.location.hash = 'home';
      return;
    }

    // Call onLeave for current route
    if (this.currentRoute) {
      const currentRouteConfig = this.routes.get(this.currentRoute);
      if (currentRouteConfig?.onLeave) {
        await currentRouteConfig.onLeave();
      }
    }

    const previousRoute = this.currentRoute;
    this.currentRoute = path;

    // Update page title
    if (route.title) {
      document.title = `${route.title} — The Gift Brief`;
    }

    // Render with transition
    await this._transitionTo(route, previousRoute);

    // Call onEnter for new route
    if (route.onEnter) {
      await route.onEnter();
    }

    if (this.onAfterNavigate) {
      this.onAfterNavigate(path, previousRoute);
    }
  }

  /**
   * Transition between pages with animation
   */
  async _transitionTo(route, previousRoute) {
    if (!this.appContainer) return;

    const isSameRoute = this.currentRoute === previousRoute;

    if (!isSameRoute) {
      // Fade out current content
      this.appContainer.classList.add('page-exit');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Render new content
    const content = await route.handler();

    if (typeof content === 'string') {
      this.appContainer.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.appContainer.innerHTML = '';
      this.appContainer.appendChild(content);
    }

    if (!isSameRoute) {
      // Fade in new content
      this.appContainer.classList.remove('page-exit');
      this.appContainer.classList.add('page-enter');
      await new Promise(resolve => setTimeout(resolve, 300));
      this.appContainer.classList.remove('page-enter');
    }
  }

  /**
   * Go back in browser history
   */
  back() {
    window.history.back();
  }
}

// Singleton router instance
const router = new Router();
export default router;
