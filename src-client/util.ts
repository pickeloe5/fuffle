const util = {
    proxyGet<T extends object>(
        listener: (state: T) => void,
        state: T
    ): Array<keyof T> {
        const dependencies: Array<keyof T> = []
        const {proxy, revoke} = Proxy.revocable(state, {
            get: (target, name, receiver) => {
                if (!dependencies.includes(name as keyof T))
                    dependencies.push(name as keyof T)
                return Reflect.get(target, name, receiver)
            }
        })
        listener(proxy)
        revoke()
        return [...dependencies]
    },
    proxySet<T extends object>(
        mutate: (state: T) => void,
        state: T
    ): Array<keyof T> {
        const properties: Array<keyof T> = []
        const {proxy, revoke} = Proxy.revocable(state, {
            set: (target, name, value, receiver) => {
                if (!properties.includes(name as keyof T))
                    properties.push(name as keyof T)
                return Reflect.set(target, name, value, receiver)
            }
        })
        mutate(proxy)
        revoke()
        return [...properties]
    }
}

module.exports = util
export type {util as TUtil}