import type {TBaseStateWrapper} from './BaseStateWrapper'
const BaseStateWrapper: typeof TBaseStateWrapper = require('./BaseStateWrapper')
import type {TBinding} from './Binding'
const Binding: typeof TBinding = require('./Binding')

class ObjectStateWrapper<StateGeneric extends object, RootGeneric>
    extends BaseStateWrapper<StateGeneric, RootGeneric>
{
    read(
        key: Exclude<keyof StateGeneric, symbol>,
        listener: (value: StateGeneric[keyof StateGeneric]) => void
    ) {
        this.root.bindings.push(new Binding(() => {
            listener(this.state[key])
        }, [[...this.path, key]]))
        listener(this.state[key])
    }
}

module.exports = ObjectStateWrapper

export type {ObjectStateWrapper as TObjectStateWrapper}