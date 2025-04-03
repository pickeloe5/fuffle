import ObjectStatePath from './ObjectStatePath'

export default class ObjectStateObserver<T extends object> {
    proxy: T
    gets: ObjectStatePath[] = []
    sets: ObjectStatePath[] = []
    revokes: Array<() => void> = []
    constructor(state: T) {
        this.proxy = this.#makeProxy(state, new ObjectStatePath([]))
    }
    #onGet(path: ObjectStatePath) {
        this.gets = path.join(this.gets)
    }
    #onSet(path: ObjectStatePath) {
        this.sets = path.join(this.sets)
    }
    #makeProxy<T2 extends object>(
        value: T2,
        path: ObjectStatePath
    ) {
        const {proxy, revoke} = Proxy.revocable(value, {
            get: (target, key, receiver) => {
                const child = Reflect.get(target, key, receiver)
                if (typeof key !== 'string')
                    return child
                this.#onGet(path.getChild(key))
                if (typeof child === 'object')
                    return this.#makeProxy(child, path.getChild(key))
                return child
            },
            set: (target, key, child, receiver) => {
                if (typeof key === 'string' && child !== value[key])
                    this.#onSet(path.getChild(key))
                return Reflect.set(target, key, child, receiver)
            }
        })
        this.revokes.push(revoke)
        return proxy
    }
    stop() {
        for (const revoke of this.revokes)
            revoke()
    }
}