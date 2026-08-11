import { IEventBus, OpenApplyEventType, EventCallback } from '../../core/ports/IEventBus';

/**
 * In-memory event bus implementing publish-subscribe event dispatching.
 */
export class EventBus implements IEventBus {
  private subscribers: Map<OpenApplyEventType, Set<EventCallback>>;

  constructor() {
    this.subscribers = new Map();
  }

  public subscribe(event: OpenApplyEventType, callback: EventCallback): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }

    const set = this.subscribers.get(event)!;
    set.add(callback);

    return () => {
      set.delete(callback);
    };
  }

  public publish(event: OpenApplyEventType, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Error executing subscriber for ${event}:`, err);
        }
      });
    }
  }
}

/**
 * Global singleton EventBus instance.
 */
export const eventBus = new EventBus();
