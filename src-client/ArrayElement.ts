import type {TArrayStateWrapper} from './state/ArrayStateWrapper'

class FuffleArrayElement<
    ItemGeneric,
    ItemWrapperGeneric = ItemGeneric
> extends HTMLElement {
    #state: TArrayStateWrapper<ItemGeneric>
    #renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    constructor(
        state: TArrayStateWrapper<ItemGeneric>,
        renderItem: (itemWrapper: ItemWrapperGeneric) => Node[]
    ) {
        super()
        this.#state = state
        this.#renderItem = renderItem
    }
    connectedCallback() {
        const nodes: Node[] = []
        const state = this.#state
        for (let i = 0; i < state.length; i++) {
            nodes.push(...this.#renderItem(
                this.#state.getChild<ItemWrapperGeneric>(i)
            ))
        }
        this.append(...nodes)
    }
}
customElements.define('fuffle-array', FuffleArrayElement)

module.exports = FuffleArrayElement

export type {FuffleArrayElement as TArrayElement}