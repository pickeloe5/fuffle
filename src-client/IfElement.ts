import type {TStateWrapper} from './StateWrapper'
import type {KindaNode} from './types'
import type {TDomUtil} from './$'
const $: typeof TDomUtil = require('./$')

class FuffleIfElement extends HTMLElement {
    static $(stateWrapper: TStateWrapper<unknown>, render: () => KindaNode) {
        return new FuffleIfUtil(new FuffleIfElement(stateWrapper, render))
    }
    static else(instance: FuffleIfElement, render: () => KindaNode) {
        instance.#renderElse = render
        return instance
    }
    #stateWrapper: TStateWrapper<unknown>
    #render: () => KindaNode
    #renderElse: (() => KindaNode) | null = null
    #$ = new $(this)
    #showing = false
    constructor(stateWrapper: TStateWrapper<unknown>, render: () => KindaNode) {
        super()
        this.#stateWrapper = stateWrapper
        this.#render = render
    }
    connectedCallback() {
        this.#stateWrapper.bind(state => {
            if (state) {
                if (!this.#showing) {
                    if (this.#renderElse)
                        this.#$.removeAll()
                    this.#$.add(this.#render())
                    this.#showing = true
                }
            } else if (this.#showing) {
                this.#$.removeAll()
                if (this.#renderElse)
                    this.#$.add(this.#renderElse())
                this.#showing = false
            }
        })
    }
}

class FuffleIfUtil extends $<FuffleIfElement> {
    else(render: () => KindaNode) {
        FuffleIfElement.else(this.node, render)
        return this
    }
}

customElements.define('fuffle-if', FuffleIfElement)


module.exports = FuffleIfElement
export type {FuffleIfElement as TFuffleIfElement}