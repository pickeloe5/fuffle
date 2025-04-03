import Fuffle from '/script/Fuffle.js'
const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = Fuffle.state('hi!')
    const objectStateWrapper = Fuffle.objectState({a: 'a1', b: 'b1', c: {d: 'd1'}})
    new $(document.body).add(
        stateWrapper.text(),
        objectStateWrapper.text(state => state.a),
        objectStateWrapper.text(state => state.c.d),
        $.element('button').text('Click here').on('click', () => {
            stateWrapper.write('bye!')
            objectStateWrapper.write({a: 'a2', b: 'b1', c: {d: 'd1'}})
            objectStateWrapper.update(state => {state.c.d = 'd2'})
        })
    )
})