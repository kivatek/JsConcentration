enchant();

const MAX_COLOR = 4;
const MAX_NUMBER = 13;
const PHASE_SELECT = 0;
const PHASE_WAIT = 1;

var Card = Class.create(Sprite, {
	initialize: function(c, n){
		Sprite.call(this, 62, 80);
		this.cardid = c * MAX_NUMBER + n;
		this.image = game.assets['img/cards.png'];
		this.hide();
		this.addEventListener('touchstart', function(){
			if(phase == PHASE_WAIT){
				return;
			}
			if(this.opened == false){
				this.showFace();
				if(prevCard != null){
					phase = PHASE_WAIT;
					var card = this;
					setTimeout( function(){
						if(Math.floor(card.cardid % MAX_NUMBER) == Math.floor(prevCard.cardid % MAX_NUMBER)){
							card.hide();
							prevCard.hide();
							removed += 2;
							checkFinish();
						}else{
							card.showBack();
							prevCard.showBack();
						}
						prevCard = null;
						phase = PHASE_SELECT;
					}, 800);
				}else{
					prevCard = this;
				}
			}
		});
	},
	hide: function(){
		this.frame = 104;
		this.visible = false;
		this.opened = false;
	},
	showFace: function(){
		this.frame = this.cardid;
		this.visible = true;
		this.opened = true;
	},
	showBack: function(){
		this.frame = 104;
		this.visible = true;
		this.opened = false;
	}
});

function checkFinish(){
	if(removed == board.length){
		//console.log("STAGE CLEAR");
		var caption = new Sprite(152, 90);
		caption.image = game.assets['img/stageclear.png'];
		caption.x = (360 - 152) / 2;
		caption.y = (360 - 90) / 2;
		game.currentScene.addChild(caption);

		setTimeout( function(){
			game.currentScene.removeChild(caption);
			shuffle();
			putCards();
		}, 3000);
	}
}

function prepare(){
	var table = [0,10,11,12];
	var n;
	for(n = 0; n < table.length; n++){
		var c = 0;
		for(c = 0; c < MAX_COLOR; c++){
			var card = new Card(c, table[n]);
			game.currentScene.addChild(card);
			board.push(card)
		}
	}
}

function shuffle(){
	// 100回シャッフル
	var i;
	for(i = 0; i < 100; i++){
		var s = Math.floor(Math.random() * board.length);
		var t = Math.floor(Math.random() * board.length);
		var tmp = board[t];
		board[t] = board[s];
		board[s] = tmp;
	}
	// この段階で強制的に裏向きにしておく
	for(i = 0; i < board.length; i++){
		board[i].frame = 104;
	}
}

function putCards(){
	// 並べる
	var i;
	for(i = 0; i < board.length; i++){
		var card = board[i];
		card.x = Math.floor(i % 4) * 66 + 40;
		card.y = Math.floor(i / 4) * 84 + 12;
		card.showBack();
	}
	removed = 0;
}

window.onload = function() {
	
	game = new Game(360, 360);
	
	game.fps = 24;
	game.touched = false;
	game.preload('img/cards.png', 'img/stageclear.png');
	
	board = [];
	phase = PHASE_SELECT;
	removed = 0;
	prevCard = null;

	game.onload = function() {
		game.currentScene.backgroundColor = 'rgb(208, 255, 255)';
		prepare();
		shuffle();
		putCards();
	};
	game.start();
};
