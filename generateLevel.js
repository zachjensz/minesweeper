export default function generateLevel(width, height, minefactor) {
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
