type Handler<T> = (data: T) => void;

export default class Signal<T> {
  #handlers: Handler<T>[] = [];
  #queued?: T;

  constructor() {}

  subscribe(handler: Handler<T>) {
    this.#handlers.push(handler);
  }

  unsubscribe(handler: Handler<T>) {
    this.#handlers = this.#handlers.filter((h) => h !== handler);
  }

  dispatch(data: T) {
    if (this.#queued) return;

    queueMicrotask(() => {
      this.#handlers.forEach((handler) => handler(data));
    });
  }
}
