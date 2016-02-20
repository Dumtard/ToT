class Renderer {
  constructor() {
    this.renderer = PIXI.autoDetectRenderer(
      this.size, this.size, { antialias: false }
    );
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Container();
  }

  registerWorld(world) {
    this.stage.addChild(world);
  }

  resize(width, height) {
    this.size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    this.renderer.resize(width, height);
  }

  get width() {
    return this.renderer.width;
  }

  get height() {
    return this.renderer.height;
  }

  render() {
    this.renderer.render(this.stage);
  }
}

module.exports = new Renderer();
