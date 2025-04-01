import $ from './$'

class Part {
    static tagName = ''
    static define() {
        const PartImpl = this
        customElements.define(PartImpl.tagName, class extends PartElement {
            constructor() {
                super()
                this.fufflePart = new PartImpl(this)
            }
        })
    }
    element: PartElement
    state: Record<string, unknown> = {}
    bindings: Binding[] = []
    constructor(element: PartElement) {
        this.element = element
    }
    bindText(key: string) {
        const node = document.createTextNode('')
        const binding = new TextBinding(this, key, node)
        binding.apply()
        this.bindings.push(binding)
        return node
    }
    bindFunction(fun: () => void) {
        return () => {
            const initialState = {...this.state}
            fun()
            const sideEffects = []
            for (const key in initialState)
                if (this.state[key] !== initialState[key])
                    sideEffects.push(key)
            for (const binding of this.bindings)
                if (binding.check(sideEffects))
                    binding.apply()
        }
    }
    render(): Node[] {
        return []
    }
}

class Binding {
    dependencies: string[] = []
    check(keys: string[]) {
        for (const key of keys)
            for (const dependency of this.dependencies)
                if (dependency === key)
                    return true
        return false
    }
    apply() {}
}

class TextBinding extends Binding {
    #part: Part
    #key: string
    #node: Text
    constructor(part: Part, key: string, node: Text) {
        super()
        this.dependencies = [key]
        this.#part = part
        this.#key = key
        this.#node = node
    }
    apply() {
        this.#node.nodeValue = this.#getValue()
    }
    #getValue(): string {
        const value = this.#part.state[this.#key]
        if (typeof value === 'string')
            return value
        if (typeof value === 'number')
            return String(value)
        return ''
    }
}

class PartElement extends HTMLElement {
    fufflePart: Part = null
    $: $ = new $(this)
    connectedCallback() {
        this.$.add(...this.fufflePart.render())
    }
}

export default Part