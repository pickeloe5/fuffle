import {Observer} from '/js/fuffle/index.js'

document.getElementById('push').addEventListener('click', () => {
  Observer.dummy.proxy.array.push('string')
})

document.getElementById('pop').addEventListener('click', () => {
  Observer.dummy.proxy.array.pop()
})
