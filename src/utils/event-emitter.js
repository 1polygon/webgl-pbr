export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        const e = this.events.get(event);
        if (e) {
            e.push(callback);
        } else {
            this.events.set(event, [callback]);
        }
    }

    off(event, callback) {
        const e = this.events.get(event);
        if (e) {
            const index = e.indexOf(callback);
            if (index != -1) {
                e.splice(index, 1);
            }
        }
    }

    emit(event, ...args) {
        const e = this.events.get(event);
        if (e) {
            for (const callback of e) {
                callback(...args);
            }
        }
    }
}