import type {StatePath} from './types'

class Binding {
    listener: () => void
    dependencies: StatePath[]
    constructor(listener: () => void, dependencies: StatePath[]) {
        this.listener = listener
        this.dependencies = dependencies
    }
}

module.exports = Binding
export type {Binding as TBinding}