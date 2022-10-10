import {Observer, util} from '/js/fuffle/index.js'

const provider = document.getElementById('provider')
util.provideObserver(provider, Observer.dummy)
const consumer = document.createElement('fuffle-text')
consumer.textContent = '${this.array[0]}'
provider.appendChild(consumer)

document.getElementById('push').addEventListener('click', () => {
  Observer.dummy.proxy.array.push('string')
})

document.getElementById('pop').addEventListener('click', () => {
  Observer.dummy.proxy.array.pop()
})
