import { Event } from "./Event";

export class EventBus<T, E extends Event<T>> {
    private listeners: Array<(event: E) => void> = [];

    public addListener(listener: (event: E) => void) {
        this.listeners.push(listener);
    }

    public removeListener(listener: (event: E) => void) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    public dispatch(event: E) {
        this.listeners.forEach((listener) => listener(event));
    }
}
