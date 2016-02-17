class Tile extends PIXI.Container {
  constructor(filename) {
    super();

    this.solid = 0;
    this.z = 0;
  }

  set sprite(filename) {
    if (this._sprite) {
      this.removeChild(this._sprite);
    }
    this._sprite = PIXI.Sprite.fromImage(filename);
    this.addChild(this._sprite);
  }

  get tilePosition() {
    return {
      x: Math.floor(this.x / 50),
      y: Math.floor(this.y / 50)
    }
  }

  set tilePosition({x, y}) {
    this.x = x * 50;
    this.y = y * 50;
  }

  set highlight(isHighlight) {
    if (typeof isHighlight !== 'boolean') {
      return;
    }

    if (isHighlight && !this._highlight) {
      this._highlight = new PIXI.Graphics();
      this._highlight.beginFill(0xFFFFFF, 0.5);
      this._highlight.drawRect(0, 0, 50, 50);
      this._highlight.z = 1;
      this.addChild(this._highlight);

    } else if (!isHighlight && this._highlight) {
      this.removeChild(this._highlight);
      this._highlight = undefined;
    }
  }
}

module.exports = Tile;
