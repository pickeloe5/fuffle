export class StateWrapper<T> {
    state: T
    bindings: StateBinding[] = []
    cursor: StateCursor<T>
    constructor(state: T) {
        this.state = state
        this.cursor = new StateCursor(this)
    }
}

export class StateCursor<T> {
    stateWrapper: StateWrapper<T>
    path: Array<string | number>
    proxy: unknown = new Proxy(() => this, {
        get: (target, name, receiver) => {
            if (typeof name !== 'string')
                return Reflect.get(target, name, receiver)
            return this.getChild(name)
        }
    })
    constructor(stateWrapper: StateWrapper<T>, path: Array<string | number> = []) {
        this.stateWrapper = stateWrapper
        this.path = path
    }
    read() {
        let value = this.stateWrapper.state
        for (const key of this.path)
            value = value[key]
        return value
    }
    bind(onUpdated: () => void) {
        this.stateWrapper.bindings.push(
            new StateBinding([this.path], onUpdated)
        )
    }
    getChild(key: string | number): StateCursor<T> {
        return new StateCursor(this.stateWrapper, [...this.path, key])
    }
}

export class StateBinding {
    dependencies: Array<Array<string | number>>
    onUpdated: () => void
    constructor(
        dependencies: Array<Array<string | number>>,
        onUpdated: () => void
    ) {
        this.dependencies = dependencies
        this.onUpdated = onUpdated
    }
}

export default function state<T>(state: T) {
    return new StateWrapper(state).cursor.proxy
}