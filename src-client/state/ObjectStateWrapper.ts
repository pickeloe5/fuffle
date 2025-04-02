import StateWrapper from './StateWrapper'

export default class ObjectStateWrapper<T extends object> extends StateWrapper<T> {
    readers: ObjectStateReader<T>[] = []
    constructor(state: T) {
        super()
        this.state = state
    }
    read(callback: (state: T) => void) {
        const reader = new ObjectStateReader(this, callback)
        this.readers.push(reader)
        reader.read()
    }
    write(state: T) {
        const keys: ObjectStateKey[] = []
        for (const key in this.state)
            if (state[key] !== this.state[key])
                keys.push(key)
        for (const key in state)
            if (!(key in this.state))
                keys.push(key)
        this.state = {...state}
        this.#onSet(keys)
    }
    update(callback: (state: T) => void) {
        const state = {...this.state}
        const observer = new ObjectStateObserver(state)
        callback(observer.proxy)
        observer.stop()
        this.state = {...state}
        this.#onSet([...observer.sets])
    }
    #onSet(keys: ObjectStateKey[]) {
        for (const reader of this.readers)
            if (reader.checkDependencies(keys))
                reader.read()
    }
}

export class ObjectStateReader<T extends object> {
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
    read() {
        const observer = new ObjectStateObserver({...this.#stateWrapper.state})
        this.#callback(observer.proxy)
        observer.stop()
        this.#dependencies = [...observer.gets]
    }
    checkDependencies(keys: ObjectStateKey[]) {
        return keys.some(key => this.#dependencies.includes(key))
    }
}

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

type ObjectStatePath = ObjectStateKey[]
type ObjectStateKey = string | number