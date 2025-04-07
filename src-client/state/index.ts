import type {TRootStateWrapper} from './RootStateWrapper'
const RootStateWrapper: typeof TRootStateWrapper = require('./RootStateWrapper')

module.exports = function state<StateGeneric>(value: StateGeneric) {
    return new RootStateWrapper<StateGeneric>(value)
}