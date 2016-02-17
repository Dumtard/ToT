class Player extends PIXI.Container {
  constructor() {
    super();

    this.z = 1;
  }

  set sprite(filename) {
    if (this._sprite) {
      this.removeChild(this._sprite);
    }
    this._sprite = PIXI.Sprite.fromImage(filename);
    this.addChild(this._sprite);
  }

  //get tilePosition() {
  //  return {
  //    x: Math.floor(this.x / 50),
  //    y: Math.floor(this.y / 50)
  //  }
  //}

  //set tilePosition({x, y}) {
  //  this.x = x * 50;
  //  this.y = y * 50;
  //}
}

module.exports = Player;
