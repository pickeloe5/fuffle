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

export class ObjectStateWrapper<T extends object> {
    state: T
    listeners: ObjectStateListener<T>[]
    constructor(state: T) {
        this.state = state
    }
    read(callback: (state: T) => void) {
        const listener = new ObjectStateListener(this, callback)
        this.listeners.push(listener)
        listener.fire()
    }
    write(state: T) {
        const keys: ObjectStateKey[] = []
        for (const key in this.state)
            if (state[key] !== this.state[key])
                keys.push(key)
        for (const key in state)
            if (key !in this.state)
                keys.push(key)
        this.state = state
        for (const listener of this.listeners)
            if (listener.check(keys))
                listener.fire()
    }
}

export class ObjectStateListener<T extends object> {
    #stateWrapper: ObjectStateWrapper<T>
    #callback: (state: T) => void
    #dependencies: ObjectStateKey[] = []
    constructor(
        stateWrapper: ObjectStateWrapper<T>,
        callback: (state: T) => void
    ) {
        this.#stateWrapper = stateWrapper
        this.#callback = callback
    }
    fire() {
        const observer = new ObjectStateObserver<T>(this.#stateWrapper.state)
        this.#callback(observer.proxy)
        observer.stop()
        this.#dependencies = observer.getDependencies()
    }
    check(keys: ObjectStateKey[]) {
        return !keys.some(key => this.#dependencies.includes(key))
    }
}

type ObjectStatePath = ObjectStateKey[]
type ObjectStateKey = string | number

class ObjectStateObserver<T extends object> {
    proxy: T
    stop: () => void
    #gets: ObjectStateKey[] = []
    constructor(state: T) {
        const {proxy, revoke} = this.#makeProxy(state)
        this.proxy = proxy
        this.stop = revoke
    }
    getDependencies() {
        return [...this.#gets]
    }
    #onGet(key: ObjectStateKey) {
        if (!this.#gets.includes(key))
            this.#gets.push(key)
    }
    #makeProxy(state: T) {
        return Proxy.revocable(state, {
            get: (target, key, receiver) => {
                if (typeof key === 'string')
                    this.#onGet(key)
                return Reflect.get(target, key, receiver)
            }
        })
    }
}

export default function state<T>(value: T): StateWrapper<T> {
    return new StateWrapper(value)
}

export function objectState<T extends object>(value: T): ObjectStateWrapper<T> {
    return new ObjectStateWrapper(value)
}