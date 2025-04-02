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
    listeners: ObjectStateListener<T>[] = []
    constructor(state: T) {
        this.state = state
    }
    read(callback: (state: T) => void) {
        const listener = new ObjectStateListener(this, callback)
        this.listeners.push(listener)
        listener.fire()
    }
    write(objectOrFunction: T | ((state: T) => void)) {
        const keys: ObjectStateKey[] =
            typeof objectOrFunction === 'function'
                ? this.#writeFunction(objectOrFunction)
                : this.#writeObject(objectOrFunction)
        for (const listener of this.listeners)
            if (listener.check(keys))
                listener.fire()
    }
    #writeObject(state: T): ObjectStateKey[] {
        const keys: ObjectStateKey[] = []
        for (const key in this.state)
            if (state[key] !== this.state[key])
                keys.push(key)
        for (const key in state)
            if (!(key in this.state))
                keys.push(key)
        this.state = {...state}
        return keys
    }
    #writeFunction(callback: (state: T) => void): ObjectStateKey[] {
        const state = {...this.state}
        const observer = new ObjectStateObserver(state)
        callback(observer.proxy)
        observer.stop()
        this.state = {...state}
        return [...observer.sets]
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
        const observer = new ObjectStateObserver({...this.#stateWrapper.state})
        this.#callback(observer.proxy)
        observer.stop()
        this.#dependencies = [...observer.gets]
    }
    check(keys: ObjectStateKey[]) {
        return keys.some(key => this.#dependencies.includes(key))
    }
}

type ObjectStatePath = ObjectStateKey[]
type ObjectStateKey = string | number

class ObjectStateObserver<T extends object> {
    proxy: T
    stop: () => void
    gets: ObjectStateKey[] = []
    sets: ObjectStateKey[] = []
    constructor(state: T) {
        const {proxy, revoke} = this.#makeProxy(state)
        this.proxy = proxy
        this.stop = revoke
    }
    #onGet(key: ObjectStateKey) {
        if (!this.gets.includes(key))
            this.gets.push(key)
    }
    #onSet(key: ObjectStateKey) {
        if (!this.sets.includes(key))
            this.sets.push(key)
    }
    #makeProxy(state: T) {
        return Proxy.revocable(state, {
            get: (target, key, receiver) => {
                if (typeof key === 'string')
                    this.#onGet(key)
                return Reflect.get(target, key, receiver)
            },
            set: (target, key, value, receiver) => {
                if (typeof key === 'string' && value !== state[key])
                    this.#onSet(key)
                return Reflect.set(target, key, value, receiver)
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