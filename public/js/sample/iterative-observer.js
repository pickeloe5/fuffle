import {Component, Observer, IterativeNode} from '/js/fuffle/index.js'

; (class extends Component {

  output = null

  constructor(element) {
    super(element)

    const $output = document.createElement('span')
    this.output = new IterativeNode($output, ($child, value) => {
      value.read(({text}) => {$child.textContent = text})
    })

    const $inputPush = document.createElement('button')
    $inputPush.textContent = 'Push'
    $inputPush.addEventListener('click', this.#onClickPush)

    const $inputPop = document.createElement('button')
    $inputPop.textContent = 'Pop'
    $inputPop.addEventListener('click', this.#onClickPop)

    const $inputUpdate = document.createElement('button')
    $inputUpdate.textContent = 'Update'
    $inputUpdate.addEventListener('click', this.#onClickUpdate)

    element.appendChild(this.output.bookmark)
    element.appendChild($inputPush)
    element.appendChild($inputPop)
    element.appendChild($inputUpdate)
  }

  #onClickPush = () => {
    this.output.value.push(
      new Observer(
        {text: 'Goodbye, world.'}))
  }

  #onClickPop = () => {
    this.output.value.pop()
  }

  #onClickUpdate = () => {
    if (!this.output.value.length)
      return;
    const index = Math.trunc(Math.random() * this.output.value.length)
    this.output.value[index].write(it => {it.text += '.'})
  }

}).defineElement('sample-iterative-observer')
