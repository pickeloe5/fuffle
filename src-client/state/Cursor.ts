import type {StatePath} from './types'

class StateCursor<StateGeneric> {
    state: StateGeneric
    path: StatePath
    proxy: StateGeneric
    #dependencies: StatePath[] = []
    constructor(
        state: StateGeneric,
        path: StatePath
    ) {
        this.state = state
        this.path = path
        if (typeof state === 'object' && state !== null && state !== undefined) {
            this.proxy = new Proxy(state, {
                get: (target, key, receiver) => {
                    if (typeof key === 'symbol')
                        return Reflect.get(target, key, receiver)
                    return this.getChild(
                        key as Exclude<keyof StateGeneric, symbol>
                    ).proxy
                }
            })
        } else {
            this.proxy = null
        }
    }
    getChild(key: Exclude<keyof StateGeneric, symbol>):
        StateCursor<StateGeneric[typeof key]>
    {
        return new StateCursor(
            this.state[key],
            [...this.path, key],
        )
    }
    resolve<ValueGeneric>(proxyValue: ValueGeneric): ValueGeneric {
        const cursor = proxyValue as unknown as StateCursor<ValueGeneric>
        this.#dependencies.push(cursor.path)
        return cursor.state
    }
    getDependencies() {
        return [...this.#dependencies]
    }
    resetDependencies() {
        this.#dependencies = []
    }
}

module.exports = StateCursor
export type {StateCursor as TStateCursor}