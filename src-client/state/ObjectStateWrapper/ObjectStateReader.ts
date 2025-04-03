import type ObjectStateWrapper from './index'
import ObjectStateObserver from './ObjectStateObserver'
import ObjectStatePath from './ObjectStatePath'

export default class ObjectStateReader<T extends object> {
    #stateWrapper: ObjectStateWrapper<T>
    #callback: (state: T) => void
    #dependencies: ObjectStatePath[] = []
    constructor(
        stateWrapper: ObjectStateWrapper<T>,
        callback: (state: T) => void
    ) {
        this.#stateWrapper = stateWrapper
        this.#callback = callback
    }
    read() {
        const observer = new ObjectStateObserver({...this.#stateWrapper.state})
        this.#callback(observer.proxy)
        observer.stop()
        this.#dependencies = [...observer.gets]
    }
    checkDependencies(paths: ObjectStatePath[]) {
        return paths.some(path1 =>
            this.#dependencies.some(path2 =>
                path1.compare(path2)
            )
        )
    }
}