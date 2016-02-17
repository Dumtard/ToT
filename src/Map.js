var Tile = require('./Tile');
var Player = require('./Player');
var mouse = require('./Mouse');

var astar = require('./astar');

class Map {
  constructor(game) {
    this.game = game;
    this.tiles = [];
    this.path = [];

    this.initialize();

    mouse.addEventListener('mousedown', (mouse) => {
      this.createHighlight();
    });

    mouse.addEventListener('mouseup', (mouse) => {
      this.clearHighlight();
      this.createPath();
    });
  }

  initialize() {
    this.player = new Player();
    this.player.sprite = 'resources/fuzzball.png';
    this.player.tilePosition = {x: 5, y: 5};
    this.player.position.set(this.player.tilePosition.x * 50, this.player.tilePosition.y * 50);
    this.player.moveDuration = 0;
    this.game.stage.addChild(this.player);

    window.player = this.player;

    for (let x = 0; x < 11; ++x) {
      let tilesY = [];
      for (let y = 0; y < 11; ++y) {
        let tile = new Tile();
        if (Math.random() > 0.2) {
          tile.sprite = 'resources/floor.png';
          tile.solid = 0;
          tile.z = 0;

        } else {
          tile.sprite = 'resources/wall.png';
          tile.solid = 1;
          tile.z = 1;
        }

        tile.tilePosition = {x, y};

        tilesY.push(tile);
      }
      this.tiles.push(tilesY);
    }

    window.tiles = this.tiles;
  }

  createPath() {
    let mouseTile = {
      x: Math.floor(mouse.position().x / (50 * this.game.stage.scale.x)),
      y: Math.floor(mouse.position().y / (50 * this.game.stage.scale.y))
    };

    // Create path
    if (this.tiles[mouseTile.x] && this.tiles[mouseTile.x][mouseTile.y] &&
        this.tiles[mouseTile.x][mouseTile.y].solid === 0
    ) {
      let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
      var newPath = this.findPath(start, [mouseTile.x, mouseTile.y]);

      newPath.shift();

      this.path.splice(1);
      this.path = this.path.concat(newPath);
    }
  }

  findPath(start, end) {
      return astar(this.tiles, start, end);
  }

  clearHighlight() {
    // Clearing previous highlight
    let len = this.tiles.length;
    for (let x = 0; x < 11; ++x) {
      for (let y = 0; y < 11; ++y) {
        this.tiles[x][y].highlight = false;
      }
    }
  }

  createHighlight() {
    let mouseTile = {
      x: Math.floor(mouse.position().x / (50 * this.game.stage.scale.x)),
      y: Math.floor(mouse.position().y / (50 * this.game.stage.scale.y))
    };

    if (!this.tiles[mouseTile.x] || !this.tiles[mouseTile.x][mouseTile.y]) {
      return;
    }

    let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
    var newPath = this.findPath(start, [mouseTile.x, mouseTile.y]);

    // Setting new highlight
    if (this.tiles[mouseTile.x][mouseTile.y].solid === 0 &&
        this.tiles[mouseTile.x][mouseTile.y].highlighted !== true &&
        mouse.isDown()
    ) {
      for (let i = 0; i < newPath.length; ++i) {
        this.tiles[newPath[i][0]][newPath[i][1]].highlight = true;
      }
    }
    this.game.stage.children.sort(depthCompare);
  }

  highlight() {
    this.clearHighlight();
    this.createHighlight();
  }

  interpolate(to, duration) {
    this.player.moveDuration += this.game.delta * 1000;

    if (this.player.moveDuration >= duration) {
      this.player.moveDuration = duration;

      this.player.tilePosition.x = to.x;
      this.player.tilePosition.y = to.y;

      this.path.shift();
      if (this.path.length < 1) {
        this.player.moveDuration = 0;
      } else {
        this.player.moveDuration -= duration;
      }
    }

    var tileX = this.player.tilePosition.x;
    var tileY = this.player.tilePosition.y;

    this.player.position.x = (tileX * 50) + (to.x * 50 - tileX * 50) *
        (this.player.moveDuration / duration);

    this.player.position.y = (tileY * 50) + (to.y * 50 - tileY * 50) *
        (this.player.moveDuration / duration);
  }

  update() {
    this.highlight();

    //Move the player if I can.
    if (this.path.length > 0) {
      this.interpolate({x: this.path[0][0], y: this.path[0][1]}, 500);
    }
  }
}

module.exports = Map;
