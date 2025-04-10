import type {TRootStateWrapper} from './RootStateWrapper'
import type {StatePath, StateKey} from './types'
import type {TArrayStateWrapper} from './ArrayStateWrapper'
import type {TObjectStateWrapper} from './ObjectStateWrapper'
let ArrayStateWrapper: typeof TArrayStateWrapper
let ObjectStateWrapper: typeof TObjectStateWrapper

class BaseStateWrapper<StateGeneric, RootGeneric> {
    state: StateGeneric
    root: TRootStateWrapper<RootGeneric> | null
    path: StatePath
    constructor(
        state: StateGeneric,
        root: TRootStateWrapper<RootGeneric> | null = null,
        path: StatePath = []
    ) {
        this.state = state
        this.root = root
        this.path = path
    }
    getChild<ChildWrapperGeneric>(
        key: StateKey
    ): ChildWrapperGeneric {
        const child = this.state[key]
        if (Array.isArray(child))
            return new ArrayStateWrapper(
                child,
                this.root,
                [...this.path, key]
            ) as ChildWrapperGeneric
        if (typeof child === 'object' && child !== null && child !== undefined)
            return new ObjectStateWrapper(
                child,
                this.root,
                [...this.path, key]
            ) as ChildWrapperGeneric
        return child as ChildWrapperGeneric
    }
    update(key: StateKey, value: unknown) {
        this.state[key] = value
        this.root.onSet([[...this.path, key]])
    }
}

module.exports = BaseStateWrapper

export type {BaseStateWrapper as TBaseStateWrapper}

ArrayStateWrapper = require('./ArrayStateWrapper')
ObjectStateWrapper = require('./ObjectStateWrapper')