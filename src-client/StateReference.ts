import type {TStateWrapper} from './StateWrapper'

class StateReference<T, S> {
    stateWrapper: TStateWrapper<S>
    resolve: (state: S) => T
    constructor(stateWrapper: TStateWrapper<S>, resolve: (state: S) => T) {
        this.stateWrapper = stateWrapper
        this.resolve = resolve
    }
    bind(callback: (value: T) => void) {
        this.stateWrapper.bind(this, callback)
    }
}

module.exports = StateReference
export type {StateReference as TStateReference}