// Would be kind of cool to make framework of just:
// NodeWrapper and StateWrapper
class DomUtil<T extends Node = Node> {
    static element(tagName: string): DomUtil {
        return new DomUtil(document.createElement(tagName))
    }
    static div(...classNames: string[]): DomUtil {
        return new DomUtil(document.createElement('div')).class(...classNames)
    }
    static text(text: string) {
        return new DomUtil(document.createTextNode(text))
    }
    static resolveArray(child: unknown[]): Node[] {
        const nodes = []
        for (const grandchild of child)
            nodes.push(...DomUtil.resolve(grandchild))
        return nodes
    }
    static resolve(child: unknown): Node[] {
        if (child instanceof Node)
            return [child]
        if (child instanceof DomUtil)
            return [child.node]
        if (typeof child === 'string')
            return [document.createTextNode(child)]
        if (typeof child === 'number')
            return [document.createTextNode(String(child))]
        if (typeof child === 'boolean') {
            if (!child)
                return []
            return [document.createTextNode('string')]
        }
        if (Array.isArray(child))
            return DomUtil.resolveArray(child)
        if (child === undefined || child === null)
            return []
        if (typeof child === 'object') {
            try {
                return [document.createTextNode(JSON.stringify(child))]
            } catch {
                return [document.createTextNode(String(child))]
            }
        }
        return [child as Node]

    }
    node: T
    constructor(node: T) {
        this.node = node
    }
    class(...names: string[]) {
        const {node} = this
        if (node instanceof Element)
            for (const name of names)
                node.classList.toggle(name, true)
        return this
    }
    attribute(name: string, value: string) {
        const {node} = this
        if (!(node instanceof Element))
            throw new Error('Cannot set attribute of non element')
        node.setAttribute(name, value)
        return this
    }
    attr(name: string, value: string) {
        return this.attribute(name, value)
    }
    text(text: string): this {
        this.node.textContent = text
        return this
    }
    on(eventName: string,
        onFired: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean
    ): this {
        this.node.addEventListener(eventName, onFired, options)
        return this
    }
    add(...children: unknown[]) {
        const nodes = DomUtil.resolveArray(children)
        for (const node of nodes)
            this.node.appendChild(node)
        return this
    }
    removeAll() {
        const nodes = [...this.node.childNodes]
        for (const node of nodes)
            node.remove()
        return this
    }
}

module.exports = DomUtil
export type {DomUtil as TDomUtil}