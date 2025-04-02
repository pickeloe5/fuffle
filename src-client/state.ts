export class StateWrapper<T> {
    state: T
    listeners: Array<(state: T) => void> = []
    constructor(state: T) {
        this.state = state
    }
    read(callback: (state: T) => void) {
        this.listeners.push(callback)
        callback(this.state)
    }
    write(state: T) {
        this.state = state
        for (const listener of this.listeners)
            listener(state)
    }
}

export default function state<T>(value: T): StateWrapper<T> {
    return new StateWrapper(value)
}