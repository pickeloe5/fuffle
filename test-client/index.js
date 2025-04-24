const {$} = Fuffle

const state = Fuffle.state({
    loading: true,
    cards: [],
    input: 'Heyo'
})

function render() {
    return Fuffle.if(state.loading, () => 'Loading...').else(() => [
        $button('Add', () => {state.cards.push({name: randomName()})}),
        $button('Remove', () => {state.cards.pop()}),
        $.element('br'),
        state.cards.map(renderCard),
        $.element('br'),
        $.element('br'),
        $.element('input').attr('value', state.input)
    ])
}

function renderCard(card) {
    return [
        Fuffle.text(card.name),
        $button('Set', () => {card.name = randomName()}),
        $.element('br')
    ]
}

function loadCards() {
    state.cards = [
        {name: randomName()},
        {name: randomName()},
        {name: randomName()}
    ]
    state.loading = false
}

function randomName() {
    return String(Math.trunc(Math.random() * 10000))
}

function $button(text, onClick) {
    return $.element('button').text(text).on('click', onClick)
}

async function getCards() {
    await new Promise(resolve => {setTimeout(() => {resolve()}, 2000)})
    return [
        {id: 4041, name: 'Dark Magician', effect: false, level: 7,
            attribute: CardAttribute.DARK.id, type: CardType.SPELLCASTER,
            atk: 2500, def: 2100,
            image: '/img/card/4041.png',
            text: 'The ultimate wizard in terms of attack and defense.'
        },
        {id: 6393, name: 'Elemental HERO Bubbleman', effect: true, level: 4,
            attribute: CardAttribute.WATER.id, type: CardType.WARRIOR,
            atk: 800, def: 1200,
            image: '/img/card/6393.png',
            text: 'If this is the only card in your hand, you can Special Summon it (from your hand). When this card is Summoned: You can draw 2 cards. You must control no other cards and have no cards in your hand to activate and to resolve this effect.'
        }
    ]
}

const CardType = {
    SPELLCASTER: 'SPELLCASTER',
    WARRIOR: 'WARRIOR'
}

const CardAttribute = {
    DARK: {
        id: 'dark',
        name: 'DARK',
        image: '/img/attribute/dark.png'
    },
    WATER: {
        id: 'water',
        name: 'WATER',
        image: '/img/attribute/water.png'
    }
}

const CARD_ATTRIBUTES = [CardAttribute.WATER]

function getCardAttribute(attributeID) {
    for (const attribute of CARD_ATTRIBUTES)
        if (attribute.id === attributeID)
            return attribute
    return null
}

addEventListener('load', () => {
    new $(document.body).add(render())
    setTimeout(() => {
        loadCards()
    }, 2000)
    // const state = Fuffle.state({
    //     loading: true,
    //     cards: []
    // })
    // const {div} = Fuffle
    // Fuffle.body.add(
    //     Fuffle.if(state.loading, () => 'Loading...').else(() =>
    //         Fuffle.map(state.cards, card => {
    //             return div('card').add(
    //                 div('header').add(
    //                     div('name').text(card.name),
    //                     Fuffle.get(card.attribute, attributeID => {
    //                         const attribute = getCardAttribute(attributeID)
    //                         return div('attribute').add(
    //                             attribute.name,
    //                             Fuffle.element('img')
    //                                 .attr('src', attribute.image)
    //                         )
    //                     })
    //                 ),
    //                 div('level').add(
    //                     div('star').text('(*)').repeat(card.level),
    //                 ),
    //                 div('type').add(
    //                     '[',
    //                     card.type,
    //                     '/',
    //                     Fuffle.if(card.effect, () => 'EFFECT')
    //                         .else(() => 'NORMAL'),
    //                     ']'
    //                 ),
    //                 div('text').text(card.text),
    //                 div('footer').add(
    //                     'ATK/ ',
    //                     card.atk,
    //                     ' DEF/',
    //                     card.def
    //                 )
    //             )
    //         })
    //     )
    // )
    // const cards = await getCards()
    // Fuffle.set(state, value => {
    //     value.cards = cards
    //     value.loading = true
    // })
})