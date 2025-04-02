import Fuffle from '/script/Fuffle.js'
// const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = Fuffle.state('hi!')
    const node = document.createTextNode('')
    stateWrapper.read(state => {node.textContent = state})
    document.body.appendChild(node)
    setTimeout(() => {stateWrapper.write('bye!')}, 1000)
})