import type {StatePath} from './types'

module.exports = {
    compareStatePaths(path1: StatePath, path2: StatePath) {
        const commonLength = Math.min(path1.length, path2.length)
        for (let i = 0; i < commonLength; i++)
            if (path1[i] !== path2[i])
                return false
        return true
    }
}