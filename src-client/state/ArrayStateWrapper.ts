import type {TBaseStateWrapper} from './BaseStateWrapper'
const BaseStateWrapper: typeof TBaseStateWrapper = require('./BaseStateWrapper')
import type {TArrayElement} from '../ArrayElement'
const ArrayElement: typeof TArrayElement = require('../ArrayElement')

class ArrayStateWrapper<ItemGeneric>
    extends BaseStateWrapper<ItemGeneric[]>
{
    get length() {
        return this.state.length
    }
    map<ItemWrapperGeneric>
        (renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    ): TArrayElement<ItemGeneric, ItemWrapperGeneric> {
        return new ArrayElement(this, renderItem)
    }
    push(item: ItemGeneric) {
        this.state.push(item)
        this.parent.onSet([[...this.path, 'length']])
    }
    pop() {
        this.state.pop()
        this.parent.onSet([[...this.path, 'length']])
    }
}

module.exports = ArrayStateWrapper

export type {ArrayStateWrapper as TArrayStateWrapper}