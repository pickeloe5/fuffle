export default class StateWrapper<T> {
    state: T
    read(_callback: (state: T) => void) {}
    write(_state: T) {}
    update(_callback: (state: T) => void) {}
    text(callback: (state: T) => string = defaultTextCallback): Text {
        const node = document.createTextNode('')
        this.read((state: T) => {
            const value = callback(state)
            node.nodeValue = value
        })
        return node
    }
}

const defaultTextCallback = <T>(state: T): string => {
    if (typeof state === 'string')
        return state
    if (typeof state === 'number')
        return String(state)
    return ''
}