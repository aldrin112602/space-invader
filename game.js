function gameStart(t) {
	t.style.display = "none";
	let e = document.querySelector("canvas"),
		i = e.getContext("2d"),
		{
			gameWidth: s,
			gameHeight: o
		} = {
			gameWidth: innerWidth,
			gameHeight: innerHeight
		};
	e.width = s, e.height = o;
	let h = 5;
	class a {
		constructor(t, e, i, s, o) {
			this.width = i, this.height = s, this.x = t, this.y = e, this.color = o
		}
		draw() {
			i.fillStyle = this.color, i.fillRect(this.x, this.y, this.width, this.height)
		}
		update() {
			this.y -= 10
		}
	}
	class r {
		constructor(t, e, i, s, o) {
			this.x = t, this.y = e, this.width = i, this.height = s, this.color = o
		}
		draw() {
			i.fillStyle = this.color, i.fillRect(this.x, this.y, this.width, this.height)
		}
		update() {}
	}
	class $ {
		constructor(t, e, i, s) {
			this.x = t, this.y = e, this.width = i, this.height = s, this.frameWidth = 80, this.frameHeight = 80, this.currentFrame = 0, this.frameCount = 7, this.rowCount = 4, this.readyToPop = !1, this.toExplode = !1, this.staggerFrames = 6, this.gameFrame = 0, this.life = 3, this.Yvelocity = Math.floor(7 * Math.random()) + 1, this.explodeAudio = new Audio("assets/sounds/explosion1.wav")
		}
		draw() {
			let t = new Image;
			t.src = "./assets/asteroid.png", i.drawImage(t, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
		}
		update() {
			this.y += this.Yvelocity, this.life <= 0 && (this.toExplode = !0, this.explodeAudio.play(), setTimeout(() => {
				this.readyToPop = !0
			}, 500)), this.toExplode && this.gameFrame % this.staggerFrames == 0 && this.currentFrame < this.frameCount && this.currentFrame++, this.gameFrame++
		}
	}
	class l {
		constructor(t, e, i, s, o, h, a) {
			this.src = a, this.spriteWidth = o, this.spriteHeight = h, this.width = i, this.height = s, this.x = t, this.y = e, this.frameX = 0, this.frameY = Math.floor(4 * Math.random()), this.gameFrame = 0, this.staggerFrames = 4, this.toExplode = !1, this.readyToPop = !1, this.life = 2, this.explodeAudio = new Audio("assets/sounds/explosion1.wav")
		}
		draw() {
			let t = new Image;
			t.src = this.src, i.drawImage(t, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
		}
		update() {
			this.y += 5, this.y >= o && (this.readyToPop = !0), this.gameFrame % this.staggerFrames == 0 && (this.frameX < (this.toExplode ? 14 : 7) ? this.frameX++ : this.toExplode || (this.frameX = 0)), this.gameFrame++
		}
	}
	class d extends l {
		update() {
			this.y += 5, this.y >= o && (this.readyToPop = !0), this.gameFrame % this.staggerFrames == 0 && (this.frameX < (this.toExplode ? 6 : 4) ? this.frameX++ : this.toExplode || (this.frameX = 0)), this.gameFrame++
		}
	}
	class n extends l {
		update() {
			this.y += 5, this.y >= o && (this.readyToPop = !0), this.gameFrame % this.staggerFrames == 0 && (this.frameX < (this.toExplode ? 2 : 1) ? this.frameX++ : this.toExplode || (this.frameX = 0)), this.gameFrame++
		}
	}
	let p = new class t {
			constructor(t, e, i, s) {
				this.x = t, this.y = e, this.width = i, this.height = s, this.angle = 0
			}
			draw() {
				let t = new Image;
				t.src = "./assets/player.png", i.save(), i.translate(this.x + this.width / 2, this.y + this.height / 2), i.rotate(Math.PI / 180 * this.angle), i.drawImage(t, -this.width / 2, -this.height / 2, this.width, this.height), i.restore()
			}
			update() {}
		}(s / 2 - 50, o - 200, 100, 100),
		f = [],
		g = [],
		y = [],
		u = [],
		m = 30;
	setInterval(() => {
		g.push(new l(Math.floor(Math.random() * (s - 100)), -50, 100, 100, 80, 80, "assets/lobstermorph.png"))
	}, 7e3), setInterval(() => {
		u.push(new n(Math.floor(Math.random() * (s - 100)), -50, 100, 100, 80, 80, "assets/beetlemorph.png"))
	}, 15e3), setInterval(() => {
		y.push(new d(Math.floor(Math.random() * (s - 100)), -50, 100, 100, 80, 80, "assets/rhinomorphs.png"))
	}, 1e4);
	let c = [];

	function w(t, e) {
		return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y
	}
	setInterval(function() {
		!(m >= 30) && m++
	}, 600), setInterval(function() {
		f.push(new $(Math.floor(Math.random() * (s - 60)), -50, 60, 60))
	}, 7e3), e.addEventListener("click", function() {
		if (m > 0) {
			m--, c.push(new a(p.x + p.width / 2, p.y + 50, 3, 10, "orange"));
			new Audio("./assets/sounds/shot.wav").play()
		}
	});
	let x = new Audio("./assets/sounds/outer-sound-2.mp3");
	x.loop = !0;
	let _ = new Audio("./assets/sounds/outer-sound-1.mp3");
	_.loop = !0;
	let E = !1;
	document.addEventListener("click", function() {
		E || (_.play(), x.play(), E = !0)
	}), document.addEventListener("keyup", function() {
		p.angle = 0
	}), document.addEventListener("keydown", function({
		key: t
	}) {
		if (t = t.toLowerCase(), (keys = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "w", "s", "d", ]).includes(t)) {
			if (t == keys[0] || "a" == t) {
				if (p.x <= 0) {
					p.x = 0;
					return
				}
				p.angle = -20, p.x -= 10
			} else if (t == keys[1] || "d" == t) {
				if (p.x >= s - p.width) {
					p.x = s - p.width;
					return
				}
				p.angle = 20, p.x += 10
			} else if (t == keys[2] || "w" == t) {
				if (p.y <= 0) {
					p.y = 0;
					return
				}
				p.y -= 10
			} else {
				if (p.y >= o - p.height) {
					p.y = o - p.height;
					return
				}
				p.y += 10
			}
		}
	});
	let v = 0,
		P = 0,
		T = -(o - 30);
	s < o && (alert("Use swipe left to move the player to the left ⬅️ and swipe right to move the player to right ➡️"), e.addEventListener("touchend", function(t) {
		p.angle = 0
	}), e.addEventListener("touchmove", function(t) {
		t.preventDefault();
		let {
			clientX: e,
			clientY: i
		} = t.touches[0];
		if (Math.floor(e) < s / 2) {
			if (p.x <= 0) {
				p.x = 0;
				return
			}
			p.angle = -20, p.x -= 10
		} else {
			if (p.x >= s - p.width) {
				p.x = s - p.width;
				return
			}
			p.angle = 20, p.x += 10
		}
	})), ! function t() {
		i.clearRect(0, 0, s, o),
			function t() {
				let e = new Image;
				e.src = "./assets/bg.png", i.drawImage(e, 0, v, s, o);
				let h = new Image;
				h.src = "./assets/bg.png", i.drawImage(h, 0, T, s, o), v >= o && (v = -(o - 60)), T >= o && (T = -(o - 60)), P % 2 == 0 && (v += 20, T += 20), P++
			}(), i.fillStyle = "orange", i.save(), i.translate(p.x + p.width / 2, p.y + p.height / 2), i.rotate(Math.PI / 180 * p.angle), i.beginPath(), i.moveTo(-10, 0), i.lineTo(0, 100), i.lineTo(10, 0), i.closePath(), i.fill(), i.restore(), p.draw(), c.forEach(t => {
				t.draw(), t.update()
			}), g.forEach(t => {
				t.draw(), t.update(), w(p, t) && !t.toExplode && (t.life = 0, window.navigator.vibrate && navigator.vibrate([10, 10, 10]), h > 0 && h--), t.life <= 0 && !t.toExplode && (t.toExplode = !0, t.explodeAudio.play(), setTimeout(() => {
					t.readyToPop = !0
				}, 600))
			}), y.forEach(t => {
				t.draw(), t.update(), w(p, t) && !t.toExplode && (t.life = 0, window.navigator.vibrate && navigator.vibrate([10, 10, 10]), h > 0 && h--), t.life <= 0 && !t.toExplode && (t.toExplode = !0, t.explodeAudio.play(), setTimeout(() => {
					t.readyToPop = !0
				}, 600))
			}), u.forEach(t => {
				t.draw(), t.update(), w(p, t) && !t.toExplode && (t.life = 0, window.navigator.vibrate && navigator.vibrate([10, 10, 10]), h > 0 && h--), t.life <= 0 && !t.toExplode && (t.toExplode = !0, t.explodeAudio.play(), setTimeout(() => {
					t.readyToPop = !0
				}, 600))
			}), f.forEach(t => {
				if (t.draw(), t.update(), w(t, p) && !t.toExplode) {
					let e = new Audio("assets/sounds/explosion2.wav");
					t.toExplode = !0, window.navigator.vibrate && navigator.vibrate([10, 10, 100]), e.play(), window.navigator.vibrate && navigator.vibrate([10, 10, 10]), setTimeout(() => {
						t.readyToPop = !0, h--
					}, 500)
				}
				c.forEach(e => {
					w(e, t) && !e.readyToPop && (e.readyToPop = !0, t.life--), g.forEach(t => {
						w(e, t) && !e.readyToPop && (e.readyToPop = !0, t.life > 0 && t.life--), g = g.filter(t => !t.readyToPop)
					}), y.forEach(t => {
						w(e, t) && !e.readyToPop && (e.readyToPop = !0, t.life > 0 && t.life--)
					}), y = y.filter(t => !t.readyToPop), u.forEach(t => {
						w(e, t) && !e.readyToPop && (e.readyToPop = !0, t.life > 0 && t.life--)
					}), u = u.filter(t => !t.readyToPop), e.y <= 0 && (e.readyToPop = !0)
				}), c = c.filter(t => !t.readyToPop)
			}), f = f.filter(t => !t.readyToPop),
			function t() {
				let e = o > s ? 150 : 400,
					h = s - e - 10,
					a = m / 30 * e;
				i.fillStyle = "gray", i.fillRect(h, 10, e, 20), i.fillStyle = "blue", i.fillRect(h, 10, a, 20)
			}(),
			function t() {
				let e = [];
				for (let i = 0; i < 5; i++) i < h ? e.push(new r(5 + 25 * i, 10, 15, 30, "limegreen")) : e.push(new r(5 + 25 * i, 10, 15, 30, "white"));
				e.forEach(t => {
					t.draw()
				})
			}(), window.requestAnimationFrame(t)
	}()
        }
