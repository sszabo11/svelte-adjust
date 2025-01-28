type Item = {
  requestFn: () => Promise<void>;
  priority: number;
  resolve: (v: unknown) => void;
  reject: (reasion: any) => void;
};
export class RequestScheduler {
  maxConcurrentRequests: number;
  queue: Item[];
  activeRequests: number;

  constructor(maxConcurrentRequests = 1) {
    this.maxConcurrentRequests = maxConcurrentRequests; // Limit concurrent requests
    this.queue = []; // Priority queue
    this.activeRequests = 0; // Track active requests
  }

  // Add a fetch request to the queue with a priority
  addRequest(requestFn: () => Promise<void>, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
      this.processQueue();
    });
  }

  // Process requests in the queue
  async processQueue() {
    if (this.activeRequests >= this.maxConcurrentRequests || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    let { requestFn, resolve, reject } = item;
    this.activeRequests++;

    try {
      const result = await requestFn();
      console.log(result);
      resolve(result); // Resolve the promise when the request completes
    } catch (error) {
      reject(error); // Reject the promise if the request fails
    } finally {
      this.activeRequests--;
      this.processQueue(); // Process the next request in the queue
    }
  }
}

export const scheduler = new RequestScheduler(5);
