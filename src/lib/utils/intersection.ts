type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

class IntersectionObserverManager {
  private callbacks: Map<Element, IntersectionCallback>;
  private observer: IntersectionObserver;

  constructor() {
    this.callbacks = new Map();

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const callback = this.callbacks.get(entry.target);
        if (callback) callback(entry);
      });
    });
  }

  // Start observing an element
  public observe(element: Element, callback: IntersectionCallback): void {
    if (!this.callbacks.has(element)) {
      this.callbacks.set(element, callback);
      this.observer.observe(element);
    }
  }

  // Stop observing an element
  public unobserve(element: Element): void {
    if (this.callbacks.has(element)) {
      this.callbacks.delete(element);
      this.observer.unobserve(element);
    }
  }
}

// Create a singleton instance of the manager
export const intersectionObserverManager = new IntersectionObserverManager();
