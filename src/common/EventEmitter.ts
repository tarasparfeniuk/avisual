export class EventEmitter {

    private readonly _events: Map<string, Set<() => void>>;
    private readonly _wrappers: Map<() => void, () => void>;

    constructor() {

        this._events = new Map<string, Set<() => void>>();
        this._wrappers = new Map<() => void, () => void>();
    }

    on(name: string, handler: () => void) {

        const event = this._events.get(name);

        if (event)
            event.add(handler);
        else
            this._events.set(name, new Set([handler]));
    }

    once(name: string, handler: () => void) {

        const wrapper = () => {

            this.remove(name, wrapper);
            handler();
        };

        this._wrappers.set(handler, wrapper);
        this.on(name, wrapper);
    }

    remove(name: string, handler: () => void) {

        const event = this._events.get(name);

        if (!event)
            return;

        if (event.has(handler))
            event.delete(handler);
        else {

            const wrapper = this._wrappers.get(handler);

            if (wrapper) {

                event.delete(wrapper);
                this._wrappers.delete(wrapper);
            }
        }

        if (event.size === 0)
            this._events.delete(name);
    }

    clear() {

        this._events.clear();
        this._wrappers.clear();
    }

    emit(name: string) {

        const event = this._events.get(name);

        if (!event)
            return;

        for (const handler of event.values()) {

            handler();
        }
    }
}
