require('./Tile');
var mouse = require('./Mouse');

class Map {
  constructor(game) {
    this.game = game;
    this.tiles = [];
    this.path = [];

    this.player = new PIXI.Graphics;
    this.player.lineStyle(2, 0xFFFFFF, 1);
    this.player.drawCircle(25, 25, 25);
    this.player.z = 10;
    this.player.tint = 0x00FF00;
    this.player.tilePosition = {x: 5, y: 5};
    this.player.position.set(this.player.tilePosition.x * 50, this.player.tilePosition.y * 50);
    this.player.moveDuration = 0;
    this.game.stage.addChild(this.player);

    window.player = this.player;

    this.initialize();

    mouse.addEventListener('mouseup', (mouse) => {
      let mouseTile = {
        x: Math.floor(mouse.x / (50 * this.game.stage.scale.x)),
        y: Math.floor(mouse.y / (50 * this.game.stage.scale.y))
      };

      // Create path
      if (this.tiles[mouseTile.x] && this.tiles[mouseTile.x][mouseTile.y]) {
        // Remove previous path
        let len = this.tiles.length;
        for (let x = 0; x < 11; ++x) {
          for (let y = 0; y < 11; ++y) {
            if (this.tiles[x][y].solid === 0) {
              this.tiles[x][y].children = [];
              this.tiles[x][y].z = 0;
              this.tiles[x][y].path = false;
              this.game.stage.children.sort(depthCompare);
            }
          }
        }

        if (this.tiles[mouseTile.x][mouseTile.y].solid === 0) {
          let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
          var newPath = findPath(this.tiles, start, [mouseTile.x, mouseTile.y]);

          newPath.shift();

          this.path.splice(1);
          this.path = this.path.concat(newPath);

          let len = this.path.length;
          for (let i = 0; i < len; ++i) {
            let tile = new PIXI.Graphics();
            tile.lineStyle(2, 0xFFFFFF, 1);
            tile.drawRect(0, 0, 50, 50);
            tile.tint = 0xFF0000;

            this.tiles[this.path[i][0]][this.path[i][1]].z = 2;
            this.tiles[this.path[i][0]][this.path[i][1]].addChild(tile);
            this.tiles[this.path[i][0]][this.path[i][1]].path = true;

            this.game.stage.children.sort(depthCompare);
          }
        }
      }
    });
  }

  initialize() {
    for (let x = 0; x < 11; ++x) {
      let tilesY = [];
      for (let y = 0; y < 11; ++y) {
        let tile = undefined;
        if (Math.random() > 0.2) {
          tile = PIXI.Sprite.fromImage('resources/floor.png');
          tile.solid = 0;
          tile.z = 0;

        } else {
          tile = PIXI.Sprite.fromImage('resources/wall.png');
          tile.solid = 1;
          tile.z = 1;
        }

        tile.position.x = x * 50;
        tile.position.y = y * 50;

        tile.tilePosition = {
          x: x,
          y: y
        };

        tilesY.push(tile);
      }
      this.tiles.push(tilesY);
    }

    window.tiles = this.tiles;
  }

  highlight() {
    // Highlight mouse over
    let mouseTile = {
      x: Math.floor(mouse.position().x / (50 * this.game.stage.scale.x)),
      y: Math.floor(mouse.position().y / (50 * this.game.stage.scale.y))
    };

    if (!this.tiles[mouseTile.x] || !this.tiles[mouseTile.x][mouseTile.y]) {
      return;
    }

    // Clearing previous highlight
    let len = this.tiles.length;
    for (let x = 0; x < 11; ++x) {
      for (let y = 0; y < 11; ++y) {
        if (this.tiles[x][y].highlighted === true) {
          for (let childIndex in this.tiles[x][y].children) {
            let child = this.tiles[x][y].children[childIndex];
            if (child.highlight) {
              this.tiles[x][y].removeChild(child);
              break;
            }
          }
          if (this.tiles[x][y].path) {
            this.tiles[x][y].z = 2;
          } else {
            this.tiles[x][y].z = 0;
          }
          this.tiles[x][y].highlighted = false;
        }
      }
    }

    // Setting new highlight
    if (this.tiles[mouseTile.x][mouseTile.y].solid === 0 &&
        this.tiles[mouseTile.x][mouseTile.y].highlighted !== true &&
        (mouse.touch() === false || mouse.touch() && mouse.isDown())) {
      let tile = new PIXI.Graphics();
      tile.lineStyle(2, 0xFFFFFF, 1);
      tile.beginFill(0xFFFFFF, 0.5);
      tile.drawRect(0, 0, 50, 50);
      tile.highlight = true;

      this.tiles[mouseTile.x][mouseTile.y].z = 3;
      this.tiles[mouseTile.x][mouseTile.y].addChild(tile);
      this.tiles[mouseTile.x][mouseTile.y].highlighted = true;
    }
    this.game.stage.children.sort(depthCompare);
  }

  update() {
    this.highlight();

    var interpolate = (to, duration) => {
      this.player.moveDuration += this.game.delta * 1000;

      if (this.player.moveDuration >= duration) {
        this.player.moveDuration = duration;

        this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].children = [];
        this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].z = 0;
        this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].path = false;
        this.game.stage.children.sort(depthCompare);

        this.player.tilePosition.x = to.x;
        this.player.tilePosition.y = to.y;

        this.path.shift();
        this.player.moveDuration = 0;

        if (this.path.length === 0) {
          this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].children = [];
          this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].z = 0;
          this.tiles[this.player.tilePosition.x][this.player.tilePosition.y].path = false;
          this.game.stage.children.sort(depthCompare);
        }
      }

      this.player.position.x = (this.player.tilePosition.x * 50) + (to.x * 50 - this.player.tilePosition.x * 50) * (this.player.moveDuration / duration);
      this.player.position.y = (this.player.tilePosition.y * 50) + (to.y * 50 - this.player.tilePosition.y * 50) * (this.player.moveDuration / duration);
    }

    //Move the player if I can.
    if (this.path.length > 0) {
      interpolate({x: this.path[0][0], y: this.path[0][1]}, 200);
    }
  }
}

module.exports = Map;
