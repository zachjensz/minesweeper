import generateLevel from './generateLevel.js'
generateLevel(16, 9, 0.2)

// Reveal tiles when clicked
document.querySelector('#game').onclick = function (e) {
    if (e.target.classList.contains('cover'))
        e.target.parentNode.setAttribute('data-revealed', 'true')
}

// Create flag on tile when right clicked
document.querySelector('#game').oncontextmenu = function (e) {
    e.preventDefault()
    if (e.target.classList.contains('cover')) {
        e.target.innerText == '!'
            ? (e.target.innerText = '')
            : (e.target.innerText = '!')
    }
}
