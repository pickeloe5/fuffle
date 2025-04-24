import type {StateProxy, StateChildren, KindaNode, ArrayStateProxy2, StateProxy2} from './types'
import type {TFuffleArrayElement} from './ArrayElement'
let FuffleArrayElement: typeof TFuffleArrayElement

class StateWrapper<T> {
    state: T
    proxy: StateProxy<T>
    children: StateChildren<T> = {}
    listeners: Array<(state: T) => void> = []
    parent: StateWrapper<unknown> | null
    key: string | number | null
    constructor(
        state: T,
        parent: StateWrapper<unknown> | null,
        key: string | number | null
    ) {
        this.state = state
        this.parent = parent
        this.key = key
        this.proxy = new Proxy(() => this, {
            get: (target, property, receiver) => {
                if (typeof property === 'symbol')
                    return Reflect.get(target, property, receiver)
                return this.proxyGet(property as keyof T)
            },
            set: (target, property, value, receiver) => {
                if (typeof property === 'symbol')
                    return Reflect.set(target, property, value, receiver)
                this.state[property] = value
                this.getChild(property as keyof T).set(value)
                return true
            }
        }) as unknown as StateProxy<T>
    }
    proxyGetImpl(key: keyof T): StateProxy<T[typeof key]> {
        return this.getChild(key).proxy
    }
    proxyGet(key: keyof T) {
        return this.proxyGetImpl(key)
    }
    bind(callback: (state: T) => void) {
        this.listeners.push(callback)
        callback(this.state)
    }
    set(state: T) {
        this.state = state
        this.#onSet()
    }
    #onSet() {
        for (const listener of this.listeners)
            listener(this.state)
    }
    getChild(key: keyof T): StateWrapper<T[typeof key]> {
        if (key in this.children)
            return this.children[key]
        const value = this.state[key]
        if (Array.isArray(value)) return this.children[key] = new ArrayStateWrapper<>(
            value,
            this as StateWrapper<unknown>,
            key as keyof unknown
        )
        return (this.children[key] = new StateWrapper(
            value,
            this as StateWrapper<unknown>,
            key as keyof unknown
        ))
    }
}

class ArrayStateWrapper<T extends unknown[]> extends StateWrapper<T> {
    proxyGet(key: keyof T[]): ArrayStateProxy2<T>[typeof key] {
        if (key === 'push')
            return ((it: T) => {this.push(it)}) as ArrayStateProxy2<T>['push']
        if (key === 'pop')
            return ((): T => this.pop()) as ArrayStateProxy2<T>['pop']
        if (key === 'map')
            return ((render: (it: StateProxy2<T>) => KindaNode) => {
                return new FuffleArrayElement(this, render)
            }) as ArrayStateProxy2<T>['map']
    }
    push(it: T) {
        this.state.push(it)
        this.getChild('length').set(this.state.length)
    }
    pop(): T {
        const it = this.state.pop()
        this.getChild('length').set(this.state.length)
        return it
    }
}

module.exports = StateWrapper
export type {StateWrapper as TStateWrapper}

FuffleArrayElement = require('./ArrayElement')