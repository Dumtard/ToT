class Mouse {
  constructor() {
    this.mouse = {
      left: false,
      right: false,
      x: 0,
      y: 0,
      touch: false
    };

    this.callbacks = {
      mousedown: [],
      mouseup: [],
      mousemove: []
    };

    window.addEventListener('touchstart', (e) => {
      this.mouse.x = e.changedTouches[0].clientX;
      this.mouse.y = e.changedTouches[0].clientY;
      this.mouse.left = true;
      this.mouse.touch = true;

      let len = this.callbacks.mousedown.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mousedown[i](this.mouse);
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.left = true;
      this.mouse.touch = false;

      let len = this.callbacks.mousedown.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mousedown[i](this.mouse);
      }
    });

    window.addEventListener('touchend', (e) => {
      this.mouse.x = e.changedTouches[0].clientX;
      this.mouse.y = e.changedTouches[0].clientY;
      this.mouse.left = false;
      this.mouse.touch = true;

      let len = this.callbacks.mouseup.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mouseup[i](this.mouse);
      }
    });

    window.addEventListener('mouseup', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.left = false;
      this.mouse.touch = false;

      let len = this.callbacks.mouseup.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mouseup[i](this.mouse);
      }
    });

    window.addEventListener('touchmove', (e) => {
      this.mouse.x = e.changedTouches[0].clientX;
      this.mouse.y = e.changedTouches[0].clientY;

      let len = this.callbacks.mousemove.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mousemove[i](this.mouse);
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      let len = this.callbacks.mousemove.length;
      for (let i = 0; i < len; ++i) {
        this.callbacks.mousemove[i](this.mouse);
      }
    });
  }

  isDown(right) {
    if (right) {
      return this.mouse.right;
    } else {
      return this.mouse.left;
    }
  }

  position() {
    return {
      x: this.mouse.x,
      y: this.mouse.y
    };
  }

  addEventListener(e, callback) {
    this.callbacks[e].push(callback);
  }

  touch() {
    return this.mouse.touch;
  }
}

module.exports = new Mouse();
