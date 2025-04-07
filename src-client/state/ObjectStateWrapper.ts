import type {TBaseStateWrapper} from './BaseStateWrapper'
const BaseStateWrapper: typeof TBaseStateWrapper = require('./BaseStateWrapper')
import type {TBinding} from './Binding'
const Binding: typeof TBinding = require('./Binding')

class ObjectStateWrapper<StateGeneric extends object>
    extends BaseStateWrapper<StateGeneric>
{
    read(
        key: Exclude<keyof StateGeneric, symbol>,
        listener: (value: StateGeneric[keyof StateGeneric]) => void
    ) {
        this.parent.bindings.push(new Binding(() => {
            listener(this.state[key])
        }, [[...this.path, key]]))
        listener(this.state[key])
    }
}

module.exports = ObjectStateWrapper

export type {ObjectStateWrapper as TObjectStateWrapper}