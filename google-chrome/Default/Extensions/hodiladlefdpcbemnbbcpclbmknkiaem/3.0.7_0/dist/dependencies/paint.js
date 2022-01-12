CanvasRenderingContext2D.prototype.fillCircle = function (
  x,
  y,
  radius,
  color = "black"
) {
  this.fillStyle = color;
  this.beginPath();
  this.arc(x, y, radius, 0, 2 * Math.PI);
  this.fill();
};

function applyInsane(ctx) {
  let c = ctx.canvas;
  let circleSpots = [];
  let imgData = ctx.getImageData(0, 0, c.width, c.height),
    data = imgData.data,
    len = data.length;
  for (var i = 0; i < len; i += Math.floor(40)) {
    if (((i + 4) / 4) % c.width !== 0) {
      let darkness = Math.floor(data[i] + data[i + 1] + data[i + 2]) / 3;
      circleSpots.push({
        x: (i / 4) % c.width,
        y: Math.floor(i / 4 / c.width),
        radi: (255 - darkness) / 20,
        color:
          "#" +
          data[i].toString(16) +
          data[i + 1].toString(16) +
          data[i + 2].toString(16)
      });
    }
  }
  imgData.data = data;
  ctx.putImageData(imgData, 0, 0);
  circleSpots.forEach(({ x, y, radi, color }) => {
    ctx.fillCircle(x, y, radi, color);
  });
}

function apply3DMovie(ctx) {
  let c = ctx.canvas;
  let imgData = ctx.getImageData(0, 0, c.width, c.height),
    data = imgData.data,
    len = data.length;
  for (var i = 0; i < len; i += Math.floor(4)) {
    data[i] = data[i];
    data[i + 1] = data[i + 33];
    data[i + 2] = data[i + 58];
  }
  imgData.data = data;
  ctx.putImageData(imgData, 0, 0);
}
