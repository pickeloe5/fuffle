import type {TStateWrapper} from './StateWrapper'
import type {StateProxy, KindaNode} from './types'
import type {TDomUtil} from './$'
let $: typeof TDomUtil

class FuffleArrayElement<T> extends HTMLElement {
    #stateWrapper: TStateWrapper<T[]>
    #render: (it: StateProxy<T>) => KindaNode
    #$ = new $(this)
    #nodes: Node[][] = []
    constructor(stateWrapper: TStateWrapper<T[]>, render: (it: StateProxy<T>) => KindaNode) {
        super()
        this.#stateWrapper = stateWrapper
        this.#render = render
    }
    connectedCallback() {
        this.#stateWrapper.getChild('length').bind(length => {
            while (this.#nodes.length < length) {
                const nodes = $.resolve(this.#render(this.#stateWrapper.getChild(this.#nodes.length).proxy))
                this.#nodes.push(nodes)
                this.#$.add(nodes)
            }
            while (this.#nodes.length > length) {
                const nodes = this.#nodes.pop()
                for (const node of nodes)
                    node.parentNode.removeChild(node)
            }
        })
    }
}
customElements.define('fuffle-array', FuffleArrayElement)

module.exports = FuffleArrayElement
export type {FuffleArrayElement as TFuffleArrayElement}

$ = require('./$')