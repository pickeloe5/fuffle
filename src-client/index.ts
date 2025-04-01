import $ from './$'

class StateWrapper<T extends object> {
    state: T
    #bindings: Binding<T>[] = []
    constructor(state: T) {
        this.state = state
    }
    text(getValue: (state: T) => string): Text {
        const binding = new TextBinding(this, getValue)
        this.#bindings.push(binding)
        return binding.node
    }
    onUpdated(keys: string[]) {
        for (const binding of this.#bindings)
            binding.onUpdated(keys)
    }
    update(update: (state: T) => void) {
        const transaction = new StateTransaction(this)
        update(transaction.proxy)
        this.state = {...transaction.state}
        this.onUpdated([...transaction.sets])
    }
}

class Binding<T extends object> {
    stateWrapper: StateWrapper<T>
    dependencies: string[] = []
    constructor(
        stateWrapper: StateWrapper<T>,
    ) {
        this.stateWrapper = stateWrapper
    }
    onUpdated(keys: string[]) {
        if (this.check(keys))
            this.apply()
    }
    check(keys: string[]) {
        for (const key of keys)
            for (const dependency of this.dependencies)
                if (key === dependency)
                    return true
        return false
    }
    apply() {}
}

class TextBinding<T extends object> extends Binding<T> {
    node: Text | null = null
    getValue: (state: T) => string
    constructor(stateWrapper: StateWrapper<T>, getValue: (state: T) => string) {
        super(stateWrapper)
        this.getValue = getValue
        const transaction = new StateTransaction(stateWrapper)
        const value = getValue(transaction.proxy)
        this.dependencies = [...transaction.gets]
        this.node = document.createTextNode(value)
    }
    apply() {
        const transaction = new StateTransaction(this.stateWrapper)
        const value = this.getValue(transaction.proxy)
        this.dependencies = [...transaction.gets]
        this.node.nodeValue = value
    }
}

class StateTransaction<T extends object> {
    state: T
    proxy: T
    gets: string[] = []
    sets: string[] = []
    constructor(stateWrapper: StateWrapper<T>) {
        this.state = {...stateWrapper.state}
        this.proxy = new Proxy<T>(this.state, {
            set: (target, name, value, receiver) => {
                if (
                    typeof name === 'string' &&
                    value !== target[name] &&
                    !this.sets.includes(name)
                ) this.sets.push(name)
                return Reflect.set(target, name, value, receiver)
            },
            get: (target, name, receiver) => {
                if (
                    typeof name === 'string' &&
                    !this.gets.includes(name)
                ) this.gets.push(name)
                return Reflect.get(target, name, receiver)
            }
        })
    }
}

export default {$, StateWrapper}