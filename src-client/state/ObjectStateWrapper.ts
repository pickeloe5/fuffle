import type {TBaseStateWrapper} from './BaseStateWrapper'
const BaseStateWrapper: typeof TBaseStateWrapper = require('./BaseStateWrapper')
import type {TBinding} from './Binding'
const Binding: typeof TBinding = require('./Binding')
import type {TStateCursor} from './Cursor'
const StateCursor: typeof TStateCursor = require('./Cursor')

class ObjectStateWrapper<StateGeneric extends object, RootGeneric>
    extends BaseStateWrapper<StateGeneric, RootGeneric>
{
    read(
        key: Exclude<keyof StateGeneric, symbol>,
        listener: (value: StateGeneric[keyof StateGeneric]) => void
    ): void {
        this.root.bindings.push(new Binding(() => {
            listener(this.state[key])
        }, [[...this.path, key]]))
        listener(this.state[key])
    }
    read2(listener: (
        state: StateGeneric,
        cursor: TStateCursor<StateGeneric>
    ) => void) {
        const cursor = new StateCursor(this.state, [])
        listener(cursor.proxy, cursor)
        const binding = new Binding(() => {
            cursor.resetDependencies()
            listener(cursor.proxy, cursor)
            binding.dependencies = cursor.getDependencies()
        }, cursor.getDependencies())
        this.root.bindings.push(binding)
    }
    text(key: Exclude<keyof StateGeneric, symbol>): Text {
        const node = document.createTextNode('')
        this.read(key, (value) => {
            if (typeof value === 'string')
                node.nodeValue = value
            else if (typeof value === 'number')
                node.nodeValue = String(value)
            else
                node.nodeValue = ''
        })
        return node
    }
    text2(
        getText: (
            state: StateGeneric,
            cursor: TStateCursor<StateGeneric>
        ) => string
    ): Text {
        const node = document.createTextNode('')
        this.read2((state, cursor) => {
            node.nodeValue = getText(state, cursor)
        })
        return node
    }
}

module.exports = ObjectStateWrapper

export type {ObjectStateWrapper as TObjectStateWrapper}