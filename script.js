import generateLevel from './generateLevel.js'
const width = 16
const height = 9
const grid = generateLevel(width, height, 0.2)

// Reveal tiles when clicked
document.querySelector('#game').onclick = function (e) {
  if (e.target.classList.contains('cover'))
    reveal(
      grid,
      width,
      height,
      e.target.parentNode.querySelector('.value').getAttribute('data-index')
    )
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

// Reveal clicked tiles function
function reveal(grid, width, height, index) {
  if (index >= width * height) return
  const tile = document.querySelector(`[data-index="${index}"]`).parentNode

  // If I'm already revealed, return
  if (tile.classList.contains('revealed'))
    if (tile.classList.contains('revealed')) return

  // Reveal me
  tile.classList.add('revealed')

  // What number do I hold
  const value = grid[index]

  // If I'm a mine, game over!
  if (value === 9) gameOver()

  // I'm empty, reveal surrounding 8 tiles
  if (value === 0) revealSurroundings(grid, width, height, index)

  // Check for surrounding empty tiles
  recursiveReveal(grid, width, height, index)
}

// Recursive tiles function
function recursiveReveal(grid, width, height, index) {
  // Are there any empty tiles around me?
  const leftvalid = index % width > 0
  const rightvalid = (index % width) + 1 < width
  const abovevalid = index >= width
  const belowvalid = index <= width * (height - 1)
  if (leftvalid) {
    // Left Valid
    if (abovevalid && grid[index - width - 1] === 0)
      // Top Left
      reveal(grid, width, height, index - width - 1)
    if (belowvalid && grid[index + width - 1] === 0)
      // Bottom Left
      reveal(grid, width, height, index + width - 1)
    if (grid[index - 1] === 0)
      // Left
      reveal(grid, width, height, index - 1)
  }
  if (rightvalid) {
    // Right Valid
    if (abovevalid && grid[index - width + 1] === 0)
      // Top Right
      reveal(grid, width, height, index - width + 1)
    if (grid[index + 1] === 0)
      // Right
      reveal(grid, width, height, index + 1)
    if (belowvalid && grid[index + width + 1] === 0)
      // Bottom Right
      reveal(grid, width, height, index + width + 1)
  }
  if (abovevalid && grid[index - width] === 0)
    // Top
    reveal(grid, width, height, index - width)
  if (belowvalid && grid[index + width] === 0)
    // Bottom
    reveal(grid, width, height, index + width)
}

// Reveal surrounding tiles function
function revealSurroundings(grid, width, height, index) {
  // Reveal surrounding tiles
  const leftvalid = index % width > 0
  const rightvalid = (index % width) + 1 < width
  const abovevalid = index >= width
  const belowvalid = index <= width * (height - 1)
  if (leftvalid) {
    // Left Valid
    if (abovevalid)
      // Top Left
      reveal(grid, width, height, index - width - 1)
    if (belowvalid)
      // Bottom Left
      reveal(grid, width, height, index + width - 1)
    // Left
    reveal(grid, width, height, index - 1)
  }
  if (rightvalid) {
    // Right Valid
    if (abovevalid)
      // Top Right
      reveal(grid, width, height, index - width + 1)
    // Right
    reveal(grid, width, height, index + 1)
    if (belowvalid)
      // Bottom Right
      reveal(grid, width, height, index + width + 1)
  }
  if (abovevalid)
    // Top
    reveal(grid, width, height, index - width)
  if (belowvalid)
    // Bottom
    reveal(grid, width, height, index + width)
}

function gameOver() {
  alert('Game Over!')
  location.reload()
}
