
$(window).resize(resize)
	window.onorientationchange = resize;

	document.addEventListener('DOMContentLoaded', start, false);

	//	Globals, globals everywhere and not a drop to drink
	var w = 1024;
	var h = 768;
	var starCount = 0;
	var sx = 1.016; // 1.0 + (Math.random() / 20);
	var sy = 1.01 // + (Math.random() / 20);
	var slideX = w / 2;
	var slideY = h;
	var stars = [];
	var renderer;
	var stage;
	var bkgSprite;
	var tic = Math.random() * 3;
	var toc = Math.random() * 3;
	
	var starshoTexture = new PIXI.Texture.fromImage("assets/starsho.png");
	var streaksTexture = new PIXI.Texture.fromImage("assets/streaks.png");
	var bluefTexture = new PIXI.Texture.fromImage("assets/bluefadey.png");
	var ghostsTexture = new PIXI.Texture.fromImage("assets/ghosts.png");
	var textureList = [starshoTexture, streaksTexture, bluefTexture, ghostsTexture];

	function start() {
		
		
		renderer = PIXI.autoDetectRenderer(w, h, null, true, true);
		stage = new PIXI.Stage(0x66FF99);
		
		var gradTexture = new PIXI.Texture.fromImage("assets/grad.png");
		bkgSprite = new PIXI.Sprite(gradTexture);
		stage.addChild(bkgSprite);

		document.body.appendChild(renderer.view);
		renderer.view.style.position = "absolute";
		renderer.view.style.top = "30px";
		renderer.view.style.left = "0px";

		addOrgans (200);

		var addStuff = document.getElementById('more');
		addStuff.addEventListener("click", function(){addOrgans(50)}, false);
		document.getElementById('count').innerHTML = 'Count: ' + starCount;

		resize();

		requestAnimFrame(update);
	}
	
	function addOrgans (num) {
		for (var i = 0; i < num; i++) {
			var tempStar = new PIXI.Sprite(textureList[Math.floor(Math.random()*textureList.length)]);
			
			tempStar.position.x = (Math.random() * w) - slideX;
			tempStar.position.y = Math.random() * h;
			tempStar.anchor.x = 0.5;
			tempStar.anchor.y = 0.5;
			
			var yv = 1+Math.random() * .025;
			var rv = 0;
			var tscale = 80*yv - 79;
			if (tempStar.texture == bluefTexture){
				var rv = Math.random() * .1 - .05;
			}
			
			tempStar.scale = {x: tscale, y:tscale};
			
			stars.push({ sprite: tempStar, x: tempStar.position.x, y: tempStar.position.y, yvel: yv, rvel: rv, scale: tscale, reset: false});

			stage.addChild(tempStar);
			tempStar.blendMode = PIXI.blendModes.SCREEN;
			
		}
		starCount += num;
		document.getElementById('count').innerHTML = 'Count: ' + starCount;
	}


	function resize() {
		w = $(window).width();
		h = $(window).height() - 30;

		slideX = w / 2;
		slideY = h;
		bkgSprite.width = w;
		bkgSprite.height = h;

		renderer.resize(w, h);
	}

	function update() {
		tic += .00043;
		toc += .00263;
		sx = (Math.sin(tic) - Math.cos(toc)) *.051 + 1;
		for (var i = 0; i < starCount; i++) {
			if (stars[i].reset){
				stars[i].x = Math.random() * w - slideX;
				if (stars[i].x > 0 ){
					stars[i].x = -tanH(Math.random() *2.6) * slideX + slideX;
					stars[i].y = (stars[i].x - slideX) * Math.random() * .2;
				} else {
					stars[i].x = tanH(Math.random() *2.6) * slideX - slideX;
					stars[i].y =  (-stars[i].x - slideX) * Math.random() * .2;
				}
				stars[i].sprite.alpha = 1;
				stars[i].sprite.scale = {x: stars[i].scale, y: stars[i].scale};
				stars[i].sprite.tint =Math.random() * 0xFFFFFF;
				stars[i].reset = false;
			}
			
			stars[i].sprite.position.x = stars[i].x + slideX;
			stars[i].sprite.position.y = stars[i].y + slideY;
			stars[i].x = stars[i].x * sx;
			stars[i].y = stars[i].y * stars[i].yvel - 1;
			
			var scaler = (stars[i].yvel - 1) * .3 + .0015;
			stars[i].sprite.scale.x -= scaler * 2.5;
			stars[i].sprite.scale.y -= scaler * 2.5;
			stars[i].sprite.alpha -= scaler;
			stars[i].sprite.rotation += stars[i].rvel;

			if (stars[i].x > w) {
				stars[i].reset = true;
			} else if (stars[i].x < -w) {
				stars[i].reset = true;
			}

			if (stars[i].y > h) {
				stars[i].reset = true;
			} else if (stars[i].y < -h) {
				stars[i].reset = true;
			}
		}
		
		function tanH(arg) {
			var pos = Math.exp(arg);
			var neg = Math.exp(-arg);
			return (pos - neg) / (pos + neg);

		}
		
		renderer.render(stage);

		requestAnimFrame(update);
	}