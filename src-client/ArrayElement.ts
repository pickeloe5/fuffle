import type {TArrayStateWrapper} from './state/ArrayStateWrapper'
import type {TBinding} from './state/Binding'
const Binding: typeof TBinding = require('./state/Binding')
import type {TDomUtil} from './$'
const DomUtil: typeof TDomUtil = require('./$')
import type {KindaNode} from './state/types'

class FuffleArrayElement<
    ItemGeneric,
    ItemWrapperGeneric,
    RootGeneric
> extends HTMLElement {
    #state: TArrayStateWrapper<ItemGeneric, RootGeneric>
    #renderItem: (itemWrapper: ItemWrapperGeneric) => KindaNode[]
    #length = 0
    #children: Node[][] = []
    constructor(
        state: TArrayStateWrapper<ItemGeneric, RootGeneric>,
        renderItem: (itemWrapper: ItemWrapperGeneric) => KindaNode[]
    ) {
        super()
        this.#state = state
        this.#renderItem = renderItem
    }
    connectedCallback() {
        const listener =  () => {
            const state = this.#state
            if (this.#length < state.length) {
                const nodes: Node[] = []
                for (;this.#length < state.length; this.#length++) {
                    const childNodes = DomUtil.resolveArray(this.#renderItem(
                        this.#state.getChild<ItemWrapperGeneric>(this.#length)
                    ))
                    nodes.push(...childNodes)
                    this.#children.push(childNodes)
                }
                this.append(...nodes)
            }
            if (this.#length > state.length) {
                for (;this.#length > state.length; this.#length--) {
                    const nodes = this.#children.pop()
                    for (const node of nodes)
                        node.parentNode.removeChild(node)
                }
            }
        }
        this.#state.root.bindings.push(new Binding(
            listener,
            [[...this.#state.path, 'length']]
        ))
        listener()
    }
}
customElements.define('fuffle-array', FuffleArrayElement)

module.exports = FuffleArrayElement

export type {FuffleArrayElement as TArrayElement}