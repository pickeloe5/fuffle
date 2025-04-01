import Fuffle from '/script/Fuffle.js'
const {$} = Fuffle

class FuffleDemo extends Fuffle.Part {
    static tagName = 'fuffle-demo'
    state = {counter: 25}
    constructor() {
        super()
    }
    #onClickCounter = this.bindFunction(() => {
        this.state.counter++
    })
    render() {
        const $button = $.element('button').text('Click here')
        this.bindEvent($button, this.#onClickCounter)
        return [
            this.bindText('counter'),
            $.element('br'),
            $.element('button').text('Click here').on('click', () => {
                this.#onClickCounter()
            })
        ]
    }
}
FuffleDemo.define()