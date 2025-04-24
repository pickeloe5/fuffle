import type {TStateWrapper} from './StateWrapper'
import type {TDomUtil} from './$'
import type {TFuffleArrayElement} from './ArrayElement'

type StateProxy2Children<T> = T extends object
    ? Record<keyof T, StateProxy2<T[keyof T]>>
    : {}

export type StateProxy2<T> = StateProxy2Children<T> & {
    (): TStateWrapper<T>
}

export type ArrayStateProxy2<T> = StateProxy2<T[]> & {
    map(render: (it: StateProxy2<T>) => KindaNode): TFuffleArrayElement<T>
    push(it: T): void
    pop(): T
}

export type StateProxy<T> = (() => TStateWrapper<T>) & (
    T extends object
        ? Record<keyof T, StateProxy<T[keyof T]>>
        : {}
)

export type StateChildren<T> = Partial<Record<
    keyof T,
    TStateWrapper<T[keyof T]>
>>

export type KindaNode = Node | TDomUtil | string | number | Array<KindaNode>