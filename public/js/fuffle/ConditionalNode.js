export default class ConditionalNode {

  bookmark = new Comment()
  #child = null

  #active = false
  get active() {
    return this.#active
  }
  set active(it) {
    if (it)
      this.#insert()
    else
      this.#remove()
  }

  constructor(child, active) {
    this.#child = child
    this.#active = !!active
  }

  #insert() {
    if (this.#active)
      return;
    this.#active = true

    if (!this.#child.parentNode)
      this.bookmark.parentNode?.insertBefore(this.#child, this.bookmark)
  }

  #remove() {
    if (!this.#active)
      return;
    this.#active = false

    this.#child.parentNode?.removeChild(this.#child)
  }
}
