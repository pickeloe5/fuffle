import type {TRootStateWrapper} from './RootStateWrapper'
import type {StatePath, StateKey} from './types'
import type {TArrayStateWrapper} from './ArrayStateWrapper'
import type {TObjectStateWrapper} from './ObjectStateWrapper'
let ArrayStateWrapper: typeof TArrayStateWrapper
let ObjectStateWrapper: typeof TObjectStateWrapper

class BaseStateWrapper<StateGeneric> {
    parent: TRootStateWrapper<unknown>
    path: StatePath
    state: StateGeneric
    constructor(
        parent: TRootStateWrapper<unknown>,
        path: StatePath,
        state: StateGeneric
    ) {
        this.parent = parent
        this.path = path
        this.state = state
    }
    getChild<ChildWrapperGeneric>(
        key: StateKey
    ): ChildWrapperGeneric {
        const child = this.state[key]
        if (Array.isArray(child))
            return new ArrayStateWrapper(
                this.parent,
                [...this.path, key],
                child
            ) as ChildWrapperGeneric
        if (typeof child === 'object' && child !== null && child !== undefined)
            return new ObjectStateWrapper(
                this.parent,
                [...this.path, key],
                child
            ) as ChildWrapperGeneric
        return child as ChildWrapperGeneric
    }
    update(key: StateKey, value: unknown) {
        this.state[key] = value
        this.parent.onSet([[...this.path, key]])
    }
}

module.exports = BaseStateWrapper

export type {BaseStateWrapper as TBaseStateWrapper}

ArrayStateWrapper = require('./ArrayStateWrapper')
ObjectStateWrapper = require('./ObjectStateWrapper')