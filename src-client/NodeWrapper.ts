import type {TStateReference} from './StateReference'

class NodeWrapper<T extends Node = Node> {
    static text(stateReference: TStateReference<string, unknown>) {
        return new TextNodeWrapper().bind(stateReference)
    }
    static element(tagName = 'div') {
        return new ElementNodeWrapper(document.createElement(tagName))
    }
    static body() {
        return new ElementNodeWrapper(document.body)
    }
    node: T
    constructor(node: T) {
        this.node = node
    }
    on(eventName: string, onFired: (event: Event) => void, options?: AddEventListenerOptions) {
        this.node.addEventListener(eventName, onFired, options)
        return this
    }
}

module.exports = NodeWrapper
export type {NodeWrapper as TNodeWrapper}

class TextNodeWrapper extends NodeWrapper<Text> {
    constructor(text: string = '') {
        super(document.createTextNode(text))
    }
    bind(stateReference: TStateReference<string, unknown>) {
        stateReference.bind((value: string) => {
            this.node.nodeValue = value
        })
        return this
    }
}

class ElementNodeWrapper<T extends Element = Element> extends NodeWrapper<T> {
    add(...children: NodeWrapper[]) {
        this.node.append(...children.map(child => child.node))
        return this
    }
    text(text: string) {
        this.node.textContent = text
        return this
    }
}