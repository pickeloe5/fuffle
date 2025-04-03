import StateWrapper from '../StateWrapper'
import ObjectStateReader from './ObjectStateReader'
import ObjectStateObserver from './ObjectStateObserver'
import ObjectStatePath from './ObjectStatePath'

export default class ObjectStateWrapper<T extends object> extends StateWrapper<T> {
    readers: ObjectStateReader<T>[] = []
    constructor(state: T) {
        super()
        this.state = state
    }
    read(callback: (state: T) => void) {
        const reader = new ObjectStateReader(this, callback)
        this.readers.push(reader)
        reader.read()
    }
    write(state: T) {
        const paths = this.#compareState(this.state, state, new ObjectStatePath([]))
        this.state = {...state}
        this.#onSet(paths)
    }
    update(callback: (state: T) => void) {
        const state = {...this.state}
        const observer = new ObjectStateObserver(state)
        callback(observer.proxy)
        observer.stop()
        this.state = {...state}
        this.#onSet([...observer.sets])
    }
    #onSet(paths: ObjectStatePath[]) {
        for (const reader of this.readers)
            if (reader.checkDependencies(paths))
                reader.read()
    }
    #compareState(
        before: object,
        after: object,
        path: ObjectStatePath
    ) {
        const paths: ObjectStatePath[] = []
        for (const key in before) {
            const beforeValue = before[key]
            const afterValue = after[key]
            if (
                typeof beforeValue === 'object' &&
                beforeValue !== null &&
                beforeValue !== undefined &&
                typeof afterValue === 'object' &&
                afterValue !== null &&
                afterValue !== undefined
            ) {
                paths.push(...this.#compareState(
                    beforeValue,
                    afterValue,
                    path.getChild(key)
                ))
                continue
            }
            if (after[key] !== before[key])
                paths.push(path.getChild(key))
        }
        for (const key in after)
            if (!(key in before))
                paths.push(path.getChild(key))
        return paths
    }
}