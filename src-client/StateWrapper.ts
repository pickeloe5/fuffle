import type {TStateReference} from './StateReference'
let StateReference: typeof TStateReference

class StateWrapper<S> {
    state: S
    listeners: Array<(state: S) => void> = []
    proxy: Record<keyof S, TStateReference<unknown, S>>
    constructor(state: S) {
        this.state = state
        this.proxy = new Proxy(() => {}, {
            get: (target, key, receiver) => {
                if (typeof key === 'symbol')
                    return Reflect.get(target, key, receiver)
                return this.getKey(key as keyof S)
            },
            set: (target, key, value, receiver) => {
                if (typeof key === 'symbol')
                    return Reflect.set(target, key, value, receiver)
                this.set({...this.state, [key]: value})
                return true
            },
            apply: (_target, _thisArg, _args) => {
                return this
            }
        }) as unknown as Record<keyof S, TStateReference<unknown, S>>
    }
    getKey(name: keyof S) {
        return new StateReference(
            this as StateWrapper<unknown>,
            state => state[name]
        )
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