class Player extends PIXI.Container {
  constructor() {
    super();

    this.z = 1;
    this._tilePosition = {};
    this.moveDuration = 0;
  }

  set sprite(filename) {
    if (this._sprite) {
      this.removeChild(this._sprite);
    }
    this._sprite = PIXI.Sprite.fromImage(filename);
    this.addChild(this._sprite);
  }

  get tilePosition() {
    return this._tilePosition;
  }

  set tilePosition({x, y}) {
    this._tilePosition.x = x;
    this._tilePosition.y = y;
  }
}

module.exports = Player;
