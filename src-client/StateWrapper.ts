import type {TStateReference} from './StateReference'
let StateReference: typeof TStateReference

class StateWrapper<S> {
    state: S
    listeners: Array<(state: S) => void> = []
    constructor(state: S) {
        this.state = state
    }
    bind<T>(
        stateReference: TStateReference<T, unknown>,
        callback: (value: T) => void
    ) {
        function listener(state: S) {
            callback(stateReference.resolve(state))
        }
        this.listeners.push(listener)
        listener(this.state)

    }
    get<T>(listener: (state: S) => T) {
        return new StateReference(this, listener)
    }
    set(state: S) {
        this.state = state
        for (const listener of this.listeners)
            listener(state)
    }
}

module.exports = StateWrapper
export type {StateWrapper as TStateWrapper}

StateReference = require('./StateReference')