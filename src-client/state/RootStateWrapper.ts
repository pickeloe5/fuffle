import type {TBinding} from './Binding'
import type {StatePath, StateKey} from './types'
import type {TArrayStateWrapper} from './ArrayStateWrapper'
const ArrayStateWrapper: typeof TArrayStateWrapper = require('./ArrayStateWrapper')
const {compareStatePaths} = require('./util')
import type {TArrayElement} from '../ArrayElement'
import type {TObjectStateWrapper} from './ObjectStateWrapper'
const ObjectStateWrapper: typeof TObjectStateWrapper = require('./ObjectStateWrapper')
import {TBaseStateWrapper} from './BaseStateWrapper'
const BaseStateWrapper: typeof TBaseStateWrapper = require('./BaseStateWrapper')

class RootStateWrapper<StateGeneric> extends BaseStateWrapper<StateGeneric, StateGeneric> {
    bindings: TBinding[] = []
    constructor(state: StateGeneric) {
        super(state)
    }
    get length() {
        return this.#asArray().length
    }
    onSet(paths: StatePath[]) {
        for (const binding of this.bindings) {
            if (binding.dependencies.some(dependency =>
                paths.some(path =>
                    compareStatePaths(path, dependency)
                )
            )) binding.listener()
        }
    }
    map<ItemWrapperGeneric>(
        renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    ): TArrayElement<
        StateGeneric[keyof StateGeneric],
        ItemWrapperGeneric,
        StateGeneric
    > {
        return this.#asArray().map(renderItem)
    }
    push(item: StateGeneric[keyof StateGeneric]) {
        this.#asArray().push(item)
    }
    pop() {
        this.#asArray().pop()
    }
    getChild<ChildWrapperGeneric>(key: StateKey): ChildWrapperGeneric {
        return this.#asObject().getChild(key)
    }
    #asObject(): TObjectStateWrapper<StateGeneric & object, StateGeneric> {
        const {state} = this
        if (
            typeof state !== 'object' ||
            state === null ||
            state === undefined
        ) throw new Error('Expected state to be an object')
        return new ObjectStateWrapper<StateGeneric & object, StateGeneric>(
            state,
            this,
            []
        )
    }
    #asArray(): TArrayStateWrapper<StateGeneric[keyof StateGeneric], StateGeneric> {
        const {state} = this
        if (!Array.isArray(state))
            throw new Error('Expected state to be an array')
        return new ArrayStateWrapper(
            state,
            this,
            []
        )
    }
}

module.exports = RootStateWrapper
export type {RootStateWrapper as TRootStateWrapper}