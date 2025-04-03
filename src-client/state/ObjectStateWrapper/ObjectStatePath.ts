type ObjectStateKey = string | number

export default class ObjectStatePath {
    keys: ObjectStateKey[]
    length: number
    constructor(keys: ObjectStateKey[]) {
        this.keys = keys
        this.length = keys.length
    }
    compare(path: ObjectStatePath): boolean {
        const commonLength = Math.min(this.length, path.length)
        for (let i = 0; i < commonLength; i++)
            if (path[i] !== this[i])
                return false
        return true
    }
    join(paths: ObjectStatePath[]): ObjectStatePath[] {
        const result: ObjectStatePath[] = []
        for (const path of paths) {
            if (this.compare(path)) {
                if (path.length <= this.length)
                    return paths // This existing path covers the new path
                continue // This existing path is covered by the new path
            }
            result.push(path)
        }
        result.push(this)
        return result
    }
    getChild(key: ObjectStateKey): ObjectStatePath {
        return new ObjectStatePath([...this.keys, key])
    }
}