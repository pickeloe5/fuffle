import type {TArrayStateWrapper} from './state/ArrayStateWrapper'
import type {TBinding} from './state/Binding'
const Binding: typeof TBinding = require('./state/Binding')

class FuffleArrayElement<
    ItemGeneric,
    ItemWrapperGeneric = ItemGeneric
> extends HTMLElement {
    #state: TArrayStateWrapper<ItemGeneric>
    #renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    #length = 0
    #children: Node[][] = []
    constructor(
        state: TArrayStateWrapper<ItemGeneric>,
        renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
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
                    const childNodes = this.#renderItem(
                        this.#state.getChild<ItemWrapperGeneric>(this.#length)
                    )
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
        this.#state.parent.bindings.push(new Binding(
            listener,
            [[...this.#state.path, 'length']]
        ))
        listener()
    }
}
customElements.define('fuffle-array', FuffleArrayElement)

module.exports = FuffleArrayElement

export type {FuffleArrayElement as TArrayElement}