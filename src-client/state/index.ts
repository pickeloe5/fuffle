import SimpleStateWrapper from './SimpleStateWrapper'
import ObjectStateWrapper from './ObjectStateWrapper'

export default function state<T>(value: T): SimpleStateWrapper<T> {
    return new SimpleStateWrapper(value)
}

export function objectState<T extends object>(value: T): ObjectStateWrapper<T> {
    return new ObjectStateWrapper(value)
}