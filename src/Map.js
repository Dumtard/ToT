require('./Tile');
var mouse = require('./Mouse');

class Map {
  constructor(game) {
    this.game = game;
    this.tiles = [];
    this.path = [];

    this.player = PIXI.Sprite.fromImage('resources/fuzzball.png');
    this.player.z = 10;
    this.player.tilePosition = {x: 5, y: 5};
    this.player.position.set(this.player.tilePosition.x * 50, this.player.tilePosition.y * 50);
    this.player.moveDuration = 0;
    this.game.stage.addChild(this.player);

    window.player = this.player;

    this.initialize();

    mouse.addEventListener('mousedown', (mouse) => {
      // Highlight mouse over
      let mouseTile = {
        x: Math.floor(mouse.x / (50 * this.game.stage.scale.x)),
        y: Math.floor(mouse.y / (50 * this.game.stage.scale.y))
      };

      if (!this.tiles[mouseTile.x] || !this.tiles[mouseTile.x][mouseTile.y]) {
        return;
      }

      let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
      var newPath = findPath(this.tiles, start, [mouseTile.x, mouseTile.y]);

      if (this.path.length > 0) {
        newPath.unshift(this.path[0]);
      }

      // Setting new highlight
      if (this.tiles[mouseTile.x][mouseTile.y].solid === 0) {
        for (let i = 0; i < newPath.length; ++i) {
          if (this.tiles[newPath[i][0]][newPath[i][1]].highlighted) {
            continue;
          }
          let tile = new PIXI.Graphics();
          tile.beginFill(0xFFFFFF, 0.5);
          tile.drawRect(0, 0, 50, 50);
          tile.highlighted = true;

          this.tiles[newPath[i][0]][newPath[i][1]].z = 3;
          this.tiles[newPath[i][0]][newPath[i][1]].addChild(tile);
          this.tiles[newPath[i][0]][newPath[i][1]].highlighted = true;
        }
      }
      this.game.stage.children.sort(depthCompare);
    });

    mouse.addEventListener('mouseup', (mouse) => {
      // Clearing previous highlight
      let len = this.tiles.length;
      for (let x = 0; x < 11; ++x) {
        for (let y = 0; y < 11; ++y) {
          if (this.tiles[x][y].highlighted === true) {
            for (let childIndex in this.tiles[x][y].children) {
              let child = this.tiles[x][y].children[childIndex];
              if (child.highlighted) {
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

      let mouseTile = {
        x: Math.floor(mouse.x / (50 * this.game.stage.scale.x)),
        y: Math.floor(mouse.y / (50 * this.game.stage.scale.y))
      };

      // Create path
      if (this.tiles[mouseTile.x] && this.tiles[mouseTile.x][mouseTile.y] &&
          this.tiles[mouseTile.x][mouseTile.y].solid === 0
      ) {
        let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
        var newPath = findPath(this.tiles, start, [mouseTile.x, mouseTile.y]);

        newPath.shift();

        this.path.splice(1);
        this.path = this.path.concat(newPath);
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
            if (child.highlighted) {
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

    let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
    var newPath = findPath(this.tiles, start, [mouseTile.x, mouseTile.y]);

    if (this.path.length > 0) {
      newPath.unshift(this.path[0]);
    }

    // Setting new highlight
    if (this.tiles[mouseTile.x][mouseTile.y].solid === 0 &&
        this.tiles[mouseTile.x][mouseTile.y].highlighted !== true &&
        mouse.isDown()) {
      for (let i = 0; i < newPath.length; ++i) {
        if (this.tiles[newPath[i][0]][newPath[i][1]].highlighted) {
          continue;
        }
        let tile = new PIXI.Graphics();
        tile.beginFill(0xFFFFFF, 0.5);
        tile.drawRect(0, 0, 50, 50);
        tile.highlighted = true;

        this.tiles[newPath[i][0]][newPath[i][1]].z = 3;
        this.tiles[newPath[i][0]][newPath[i][1]].addChild(tile);
        this.tiles[newPath[i][0]][newPath[i][1]].highlighted = true;
      }
    }
    this.game.stage.children.sort(depthCompare);
  }

  update() {
    this.highlight();

    var interpolate = (to, duration) => {
      this.player.moveDuration += this.game.delta * 1000;

      if (this.player.moveDuration >= duration) {
        this.player.moveDuration = duration;

        this.player.tilePosition.x = to.x;
        this.player.tilePosition.y = to.y;

        this.path.shift();
        this.player.moveDuration = 0;
      }

      this.player.position.x = (this.player.tilePosition.x * 50) + (to.x * 50 - this.player.tilePosition.x * 50) * (this.player.moveDuration / duration);
      this.player.position.y = (this.player.tilePosition.y * 50) + (to.y * 50 - this.player.tilePosition.y * 50) * (this.player.moveDuration / duration);
    }

    //Move the player if I can.
    if (this.path.length > 0) {
      interpolate({x: this.path[0][0], y: this.path[0][1]}, 500);
    }
  }
}

module.exports = Map;
