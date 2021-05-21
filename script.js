const width = 16
const height = 9
const grid = generateLevel(width, height, 0.2)

function generateLevel(width, height, minefactor) {
  // Initialize Variables
  const grid = []
  const game = document.querySelector('#game')

  // Style Grid
  game.style.aspectRatio = `${width} / ${height}`
  game.style.gridTemplateColumns = `repeat(${width}, 1fr)`
  game.style.gridTemplateRows = `repeat(${height}, 1fr)`

  // Distribute Mines
  const mines = width * height * minefactor
  for (let placed = 0; placed <= mines; placed++) {
    grid[chooseEmptyTile(grid, width * height)] = 9
  }

  // Calculate Numbers
  for (let v = 0; v < height; v++) {
    // Rows
    for (let h = 0; h < width; h++) {
      // Tiles
      let tile = v * width + h
      if (grid[tile] === 9) continue // I'm a mine
      // I'm not a mine, check surrouding 8 tiles for mines
      let mines = 0
      let leftValid = h > 0
      let rightValid = h + 1 < width
      if (leftValid && grid[tile - width - 1] === 9) mines++ // Top Left
      if (grid[tile - width] === 9) mines++ // Top
      if (rightValid && grid[tile - width + 1] === 9) mines++ // Top Right
      if (rightValid && grid[tile + 1] === 9) mines++ // Right
      if (rightValid && grid[tile + width + 1] === 9) mines++ // Bottom Right
      if (grid[tile + width] === 9) mines++ // Bottom
      if (leftValid && grid[tile + width - 1] === 9) mines++ // Bottom Left
      if (leftValid && grid[tile - 1] === 9) mines++ // Left
      // Set in Array
      grid[tile] = mines
    }
  }

  // Render HTML
  grid.forEach(renderTile)

  // Return array of tiles
  return grid
}

function renderTile(item, index) {
  const template = document.querySelector('#tile-template')
  const tile = template.content.cloneNode(true)
  tile.querySelector('.value').innerText = item
  if (item === 9) tile.querySelector('.value').innerText = '#'
  tile.querySelector('.value').setAttribute('data-value', item)
  tile.querySelector('.value').setAttribute('data-index', index)
  game.appendChild(tile)
}

function chooseEmptyTile(grid, tiles) {
  const tile = Math.floor(Math.random() * tiles)
  if (grid[tile] === 9) return chooseEmptyTile(grid, tiles)
  return tile
}
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
