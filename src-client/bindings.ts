import {StateCursor} from './state'

export function text<T>(stateCursor: StateCursor<T>): Text {
    const node = document.createTextNode(readTextValue(stateCursor))
    stateCursor.bind(() => {
        node.nodeValue = readTextValue(stateCursor)
    })
    return node
}

function readTextValue<T>(stateCursor: StateCursor<T>): string {
    const value = stateCursor.read()
    if (typeof value === 'string')
        return value
    if (typeof value === 'number')
        return String(value)
    return ''
}