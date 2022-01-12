window.Misha = class {
  constructor(ctx, info) {
    this.donationList = [];
    this.donation = null;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.info = info;
    this.text = {
      donated: " Donated ",
      item: { p: "", s: "", val: "" }
    };
  }
  sendRandomDonation() {
    let names = [
      "Misha",
      "MrBeast",
      "joash22",
      "moogamer7",
      "MrSamuels",
      "bennylef1245",
      "Chrissychris2Zyri",
      "Eschewfer200",
      "Aukkaj2",
      "weryer81",
      "Zyrianhi101x",
      "Storgegan020",
      "classof2020",
      "Ditherlex123"
    ];
    let donations = [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      5,
      5,
      5,
      5,
      9.99,
      9.99,
      9.99,
      9.99,
      10,
      10,
      10,
      10,
      10,
      14.99,
      14.99,
      15,
      15,
      20,
      20,
      30,
      50,
      500,
      10000
    ];

    this.sendDonation(
      names[Math.floor(names.length * Math.random())],
      (Math.random() > 0.5 ? "€" : "$") +
        donations[Math.floor(donations.length * Math.random())]
    );
  }
  sendDonation(name, amount) {
    if (this.donationList.length < 2) this.donationList.push({ name, amount });
  }

  drawText(alpha, x, y) {
    // this.ctx.textAlign = "center";
    this.ctx.globalAlpha = alpha;
    // x =

    //   this.ctx.measureText(
    //     this.donation.name +
    //       this.text.donated +
    //       this.donation.amount +
    //       this.text.item.val +
    //       (this.donation.amount > 1 ? this.text.item.p : this.text.item.s) +
    //       "!"
    //   ).width /
    //     2
    this.ctx.fillText(this.donation.name, x, y);
    this.ctx.strokeText(this.donation.name, x, y);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(
      this.text.donated,
      x + this.ctx.measureText(this.donation.name).width,
      y
    );
    this.ctx.strokeText(
      this.text.donated,
      x + this.ctx.measureText(this.donation.name).width,
      y
    );
    this.ctx.fillStyle = "#00FDC9";
    this.ctx.fillText(
      this.donation.amount +
        this.text.item.val +
        (this.donation.amount > 1 ? this.text.item.p : this.text.item.s) +
        "!",
      x + this.ctx.measureText(this.donation.name + this.text.donated).width,
      y
    );
    this.ctx.strokeText(
      this.donation.amount +
        this.text.item.val +
        (this.donation.amount > 1 ? this.text.p : this.text.item.s) +
        "!",
      x + this.ctx.measureText(this.donation.name + this.text.donated).width,
      y
    );
    this.ctx.globalAlpha = 1;
  }

  loop(index = 1) {
    this.update(index);
    requestAnimationFrame(() => this.loop(index));
  }
  update(index) {
    if (!this.donation && this.donationList.length)
      this.donation = this.donationList.shift();
    if (this.donation) {
      //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = "bold " + this.info.width + "px Open Sans";
      this.ctx.fillStyle = "#00FDC9";
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = this.info.width / 25;
      let loopTick = Math.abs(Math.sin(index / 20));
      let { x, y } = this.info;
      y -= loopTick * 10;
      this.drawText(
        1 - loopTick > 0.7 ? 1 - loopTick + loopTick * 0.2 : 1 - loopTick,
        x,
        y
      );
      index += loopTick / this.info.clock;
      if (loopTick > 0.99) {
        this.donation = null;
      }
      return index;
    }
  }
};
