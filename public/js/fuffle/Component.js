import Observer from './Observer.js'
import {consumeObserver} from './util.js'

export default class Component {

  static template = null
  static provider = true
  static consumer = false

}

export class ComponentElement extends HTMLElement {

  static Component = null

  #template
  #observer = null

  constructor() {
    super()
    const {Component} = this.constructor
    if (Component.template)
      this.#template = Component.template.bake().withParent(this)
    if (Component.provider) {
      this.fuffle = {...this.fuffle, provider: true}
      if (!Component.consumer)
        this.#observer = this.fuffle.observer = new Observer(this)
    }
  }

  connectedCallback() {
    if (this.#template && this.#observer)
      this.#template.start(this.#observer)
  }

  disconnectedCallback() {
    this.#template?.stop()
  }

}
