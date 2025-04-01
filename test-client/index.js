import Fuffle from '/script/Fuffle.js'
const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = new Fuffle.StateWrapper({
        counter: 0
    })
    
    const text = stateWrapper.text(state => String(state.counter + 1))

    const $button = $.element('button')
        .text('Click me')
        .on('click', () => {
            stateWrapper.update(state => {state.counter++})
        })

    document.body.append(text, $button.node)
})