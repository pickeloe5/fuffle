import type StateWrapper from './StateWrapper'

export default class SimpleStateWrapper<T> implements StateWrapper<T> {
    state: T
    #listeners: Array<(state: T) => void> = []
    constructor(state: T) {
        this.state = state
    }
    read(callback: (state: T) => void) {
        this.#listeners.push(callback)
        callback(this.state)
    }
    write(state: T) {
        this.state = state
        for (const listener of this.#listeners)
            listener(state)
    }
    update(callback: (state: T) => void) {
        callback(this.state)
        for (const listener of this.#listeners)
            listener(this.state)
    }
}