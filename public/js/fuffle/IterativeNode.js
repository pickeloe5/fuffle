export default class IterativeNode {

  bookmark = new Comment()

  #child = null
  #renderChild = null

  #renderedValue = []
  #value = []
  get value() {
    return this.#observe()
  }

  constructor($child, renderChild) {
    this.#child = $child
    this.#renderChild = renderChild
  }

  #insertChild(value) {
    const child = this.#child.cloneNode(true)
    this.#renderChild?.(child, value)
    this.#renderedValue.push(child)
    this.bookmark.parentNode?.insertBefore(
      child, this.bookmark)
  }

  #removeChild() {
    const child = this.bookmark.previousSibling
    if (!child)
      return;
    child.parentNode?.removeChild(child)
    this.#renderedValue.pop()
  }

  #onUpdatedLength(length) {
    const renderedLength = this.#renderedValue.length
    if (renderedLength < length) {
      for (let i = renderedLength; i < length; i++)
        this.#insertChild(this.#value[i])
    } else if (renderedLength > length) {
      for (let i = renderedLength; i > length; i--)
        this.#removeChild()
    }
  }

  #onUpdatedValue(index, value) {
    if (index < this.#renderedValue.length)
      this.#renderChild?.(this.#renderedValue[index], value)
  }

  #observe() {
    return new Proxy(this.#value, {
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        let index
        if (property === 'length') {
          this.#onUpdatedLength(value)
        } else if ((index = parseInt(property)) !== NaN) {
          this.#onUpdatedValue(index, value)
        }
        return result
      }
    })
  }

}
