import type {TNodeWrapper} from './NodeWrapper'
import type {TStateReference} from './StateReference'
import type {TStateWrapper} from './StateWrapper'
const NodeWrapper: typeof TNodeWrapper = require('./NodeWrapper')
const StateReference: typeof TStateReference = require('./StateReference')
const StateWrapper: typeof TStateWrapper = require('./StateWrapper')

const Fuffle = {NodeWrapper, StateReference, StateWrapper}

module.exports = Fuffle
export type {TNodeWrapper, TStateReference, TStateWrapper}