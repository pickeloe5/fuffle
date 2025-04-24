import type {TStateWrapper} from './StateWrapper'
import type {TFuffleIfElement} from './IfElement'
import type {TFuffleArrayElement} from './ArrayElement'
import type {TDomUtil} from './$'
import type {StateProxy, KindaNode} from './types'
let StateWrapper: typeof TStateWrapper
let FuffleIfElement: typeof TFuffleIfElement
let FuffleArrayElement: typeof TFuffleArrayElement
let $: typeof TDomUtil

$ = require('./$')

module.exports = {
    $,
    state<T>(value: T): StateProxy<T> {
        return new StateWrapper(value, null, null).proxy
    },
    if(stateProxy: StateProxy<unknown>, render: () => KindaNode) {
        return FuffleIfElement.$(stateProxy(), render)
    },
    set<T>(stateProxy: StateProxy<T>, value: T) {
        stateProxy().set(value)
    },
    setter<T>(stateProxy: StateProxy<T>, getValue: (state: T) => T) {
        const stateWrapper = stateProxy()
        stateWrapper.set(getValue(stateWrapper.state))
    },
    map<T>(stateProxy: StateProxy<T[]>, render: (state: StateProxy<T>) => KindaNode) {
        return new FuffleArrayElement(stateProxy(), render)
    },
    push<T>(stateProxy: StateProxy<T[]>, it: T) {
        stateProxy().push(it)
    },
    pop<T>(stateProxy: StateProxy<T[]>): T {
        return stateProxy().pop()
    },
    text(stateProxy: StateProxy<unknown>) {
        const node = document.createTextNode('')
        stateProxy().bind(state => {
            if (typeof state === 'string')
                node.nodeValue = state
            else if (typeof state === 'number')
                node.nodeValue = String(state)
            else node.nodeValue = ''
        })
        return node
    }
}

StateWrapper = require('./StateWrapper')
FuffleIfElement = require('./IfElement')
FuffleArrayElement = require('./ArrayElement')