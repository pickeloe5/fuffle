export default interface StateWrapper<T> {
    state: T
    read(callback: (state: T) => void): void
    write(state: T): void
    update(callback: (state: T) => void): void
}