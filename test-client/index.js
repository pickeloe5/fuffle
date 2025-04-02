import Fuffle from '/script/Fuffle.js'
// const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = Fuffle.state('hi!')
    const node = document.createTextNode('')
    stateWrapper.read(state => {node.textContent = state})
    document.body.appendChild(node)
    setTimeout(() => {stateWrapper.write('bye!')}, 1000)

    const objectStateWrapper = Fuffle.state({a: 'a1', b: 'b1'})
    const node2 = document.createTextNode('')
    objectStateWrapper.read(state => {node2.textContent = state.a})
    document.body.appendChild(node2)
    setTimeout(() => {objectStateWrapper.write({a: 'a2', b: 'b1'})}, 1000)
})