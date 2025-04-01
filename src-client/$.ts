export default class DomUtil {
    static element(tagName: string) {
        return new DomUtil(document.createElement(tagName))
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
                return [document.createElement(String(child))]
            }
        }
        return []

    }
    node: Node
    constructor(node: Node) {
        this.node = node
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
}