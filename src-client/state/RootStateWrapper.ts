import type {TBinding} from './Binding'
import type {StatePath, StateKey} from './types'
import type {TArrayStateWrapper} from './ArrayStateWrapper'
const ArrayStateWrapper: typeof TArrayStateWrapper = require('./ArrayStateWrapper')
const {compareStatePaths} = require('./util')
import type {TArrayElement} from '../ArrayElement'
import type {TObjectStateWrapper} from './ObjectStateWrapper'
const ObjectStateWrapper: typeof TObjectStateWrapper = require('./ObjectStateWrapper')

class RootStateWrapper<StateGeneric> {
    state: StateGeneric
    bindings: TBinding[] = []
    constructor(state: StateGeneric) {
        this.state = state
    }
    get length() {
        return this.#asArray().length
    }
    onSet(paths: StatePath[]) {
        for (const binding of this.bindings) {
            if (paths.some(path =>
                binding.dependencies.some(dependency =>
                    compareStatePaths(path, dependency)
                )
            )) binding.listener()
        }
    }
    map<ItemWrapperGeneric>(
        renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    ): TArrayElement<StateGeneric[keyof StateGeneric], ItemWrapperGeneric> {
        return this.#asArray().map(renderItem)
    }
    push(item: StateGeneric[keyof StateGeneric]) {
        this.#asArray().push(item)
    }
    getChild<ChildWrapperGeneric>(key: StateKey): ChildWrapperGeneric {
        return this.#asObject().getChild(key)
    }
    #asObject(): TObjectStateWrapper<StateGeneric & object> {
        const {state} = this
        if (
            typeof state !== 'object' ||
            state === null ||
            state === undefined
        ) throw new Error('Expected state to be an object')
        return new ObjectStateWrapper<StateGeneric & object>(
            this as RootStateWrapper<unknown>,
            [],
            state
        )
    }
    #asArray(): TArrayStateWrapper<StateGeneric[keyof StateGeneric]> {
        const {state} = this
        if (!Array.isArray(state))
            throw new Error('Expected state to be an array')
        return new ArrayStateWrapper(
            this as RootStateWrapper<unknown>,
            [],
            state
        )
    }
}

new RootStateWrapper<string[]>([]).push('')

module.exports = RootStateWrapper
export type {RootStateWrapper as TRootStateWrapper}