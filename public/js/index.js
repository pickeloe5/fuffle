import {Component, Template} from '/js/fuffle/index.js'

class FuffleDemo extends Component {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  array = ['string']

  push() {
    this.array.push('string')
  }

  pop() {
    this.array.pop()
  }

  update() {
    const index = Math.trunc(Math.random() * this.array.length)
    this.array[index] += '.'
  }
}

const FuffleDemoElement = FuffleDemo.defineElement('fuffle-demo')
