import Fuffle from '/script/Fuffle.js'
// const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = Fuffle.state('hi!')
    const node = document.createTextNode('')
    stateWrapper.read(state => {node.nodeValue = state})
    document.body.appendChild(node)
    setTimeout(() => {stateWrapper.write('bye!')}, 1000)

    const objectStateWrapper = Fuffle.objectState({a: 'a1', b: 'b1'})
    const node2 = document.createTextNode('')
    objectStateWrapper.read(state => {node2.nodeValue = state.a})
    document.body.appendChild(node2)
    setTimeout(() => {objectStateWrapper.write({a: 'a2', b: 'b1'})}, 2000)
    const node3 = document.createTextNode('')
    objectStateWrapper.read(state => {node3.nodeValue = state.b})
    document.body.appendChild(node3)
    setTimeout(() => {objectStateWrapper.update(state => {state.b = 'b2'})}, 3000)
})