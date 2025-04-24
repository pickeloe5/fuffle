import type {TStateReference} from './StateReference'

class NodeWrapper<T extends Node> {
    static text(text?: string) {
        return new TextNodeWrapper(text)
    }
    node: T
    constructor(node: T) {
        this.node = node
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
    }
}