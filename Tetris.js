const BLOCK_SIZE = 30;	// 縦横幅（ピクセル）
const BLOCK_COL = 4;	// 列
const BLOCK_ROW = 4;	// 行
const BLOCK_TYPES = [
	[					// 1.I型
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0]
	],
	[					// 2.L型
		[0, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 1, 0]
	],
	[					// 3.J型
		[0, 0, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 1, 1, 0]
	],
	[					// 4.T型
		[0, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 0, 0]
	],
	[					// 5.O型
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0]
	],
	[					// 6.Z型
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 0, 0],
		[0, 1, 1, 0]
	],
	[					// 7.S型
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 1, 0, 0]
	]
];
//各ブロック用に色を定義
const BLOCK_COLORS = [
	"#6CF",			// 1.水色
	"#F92",			// 2.オレンジ
	"#66F",			// 3.青
	"#C5C",			// 4.紫
	"#FD2",			// 5.黄色
	"#F44",			// 6.赤
	"#5B5"			// 7.緑
];
const BLOCK_SPEED = 1000;

function reload() {
    window.location.reload();
}

function drawField() {
	for (let row = 0; row < FIELD_ROW; row++) {
		for (let col = 0; col < FIELD_COL; col++) {
			if (field[row][col] > 0) {
				// マスにブロックが存在する場合
				let fixedBlockNo = field[row][col];
				let x = col * BLOCK_SIZE;
				let y = row * BLOCK_SIZE;

				// マスを塗る
				canvasContext.fillStyle = BLOCK_COLORS[fixedBlockNo - 1];
				canvasContext.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

				// マスの枠を描く
				canvasContext.strokeStyle = "black";
				canvasContext.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
			}
		}
	}
}

function drawBlock() {
	for (let row = 0; row < BLOCK_ROW; row++) {
		for (let col = 0; col < BLOCK_COL; col++) {
			if (blockType[row][col] == 1) {
				// マスにブロックが存在する場合
				let x = (blockCol + col) * BLOCK_SIZE;
				let y = (blockRow + row) * BLOCK_SIZE;

				if (y >= 0) {
					// マスを塗る
					canvasContext.fillStyle = blockColor;
					canvasContext.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

					// マスの枠を描く
					canvasContext.strokeStyle = "black";
					canvasContext.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
				}
			}
		}
	}
}

let blockNo;					// ※ブロックNo
let blockType;					// ブロックの型（I型、L型・・・）
let blockColor;					// ※ブロックの色
let blockCol;					// ブロックの現在位置（列）
let blockRow;					// ブロックの現在位置（行）
let field = [];					// フィールド
let gameOverFlag = false;		// ゲームオーバー判定フラグ

function selectBlock() {
	// ランダムでブロックNoを決定する
	blockNo = Math.floor(Math.random() * BLOCK_TYPES.length) + 1;
	blockType = BLOCK_TYPES[blockNo - 1];
	blockColor = BLOCK_COLORS[blockNo - 1];
	blockCol = FIELD_OUTPUT_COL;
	blockRow = FIELD_OUTPUT_ROW - BLOCK_ROW;
}

function fixBlock() {
	let isFixedAll = true;

	for (let row = 0; row < BLOCK_ROW; row++) {
		for (let col = 0; col < BLOCK_COL; col++) {
			if (blockType[row][col] == 1) {
				if (blockRow + row < 0) {
					// フィールドのブロックを固定する位置がフィールド外の場合
					isFixedAll = false;
					continue;
				}

				// フィールドのブロックを固定する位置にブロックNoを設定する
				field[blockRow + row][blockCol + col] = blockNo;
			}
		}
	}
	return isFixedAll;
}

const FIELD_COL = 10;										// 列
const FIELD_ROW = 20;										// 行
const FIELD_WIDTH = BLOCK_SIZE * FIELD_COL;					// 横幅（ピクセル）
const FIELD_HEIGHT = BLOCK_SIZE * FIELD_ROW;				// 縦幅（ピクセル）
const FIELD_OUTPUT_COL = FIELD_COL / 2 - BLOCK_COL / 2;		// ブロック出現列
const FIELD_OUTPUT_ROW = 0;									// ブロック出現行

let canvas = document.getElementById("canvas");
canvas.width = FIELD_WIDTH;						// 横幅
canvas.height = FIELD_HEIGHT;					// 縦幅
canvas.style.border = "4px solid #555";			// 枠

let canvasContext = canvas.getContext("2d");

// 初期化
reset();

// 一定時間（BLOCK_SPEED）ごとにブロックの落下処理を行う
setInterval(dropBlock, BLOCK_SPEED);

// 画面描画
draw();

function reset() {
	// ブロックの選択
	selectBlock();

	// フィールドをクリア
	for (let row = 0; row < FIELD_ROW; row++) {
		field[row] = [];
		for (let col = 0; col < FIELD_COL; col++) {
			field[row][col] = 0;
		}
	}
	
	// ゲームオーバー判定
	gameOverFlag = false;
}

function draw() {
	// キャンバスをクリア
	canvasContext.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

	// フィールドを描画
	drawField();
	
	// ブロックを描画
	drawBlock();

	if (gameOverFlag) {
		// ゲームオーバー時の描画
		gameOver();
		
		return;
	}
}

function gameOver() {
	let text = "Game Over"
	canvasContext.font = "50px 'MSゴシック'"
	let width = canvasContext.measureText(text).width
	let x = FIELD_WIDTH / 2 - width / 2
	let y = FIELD_HEIGHT / 2 - 20
	canvasContext.lineWidth = 4;
	canvasContext.strokeText(text, x, y);
	canvasContext.fillStyle = "white";
	canvasContext.fillText = (text, x, y);
}

function dropBlock() {
	if (gameOverFlag) {
		// ゲームオーバー時は何もしない
		return;
	}
	
	if (checkMoveBlock(0, 1)) {
		// 下に移動できる場合
		blockRow++;
	} else {
		// ブロックの固定
		if (fixBlock()) {
			// ラインの消去判定
			checkLineField();
			
			// 新しいブロックの選択
			selectBlock();
		} else {
			// 下に移動できずブロックが上にはみ出る場合
			gameOverFlag = true;
		}
	}

	draw();
}

function checkMoveBlock(moveCol, moveRow, targetBlockType) {
	if (targetBlockType == undefined) {
		// ブロック型が指定されない場合は現在のブロック型を衝突判定する
		targetBlockType = blockType;
	}

	for (let row = 0; row < BLOCK_ROW; row++) {
		for (let col = 0; col < BLOCK_COL; col++) {
			if (targetBlockType[row][col] == 1) {
				// 移動後の位置で衝突判定を行う
				let newCol = blockCol + moveCol + col;
				let newRow = blockRow + moveRow + row;
				
				if (newRow >= FIELD_ROW								// 縦位置がフィールド外
					|| newCol < 0 || newCol >= FIELD_COL			// 横位置がフィールド外
					|| (newRow >= 0 && field[newRow][newCol] > 0)	// フィールドが埋まっている
				) {
					return false;
				}
			}
		}
	}
	return true;
}

function rotateBlock() {
	let rotatedBlockType = [];

	for (let row = 0; row < BLOCK_ROW; row++) {
		rotatedBlockType[row] = [];

		for (let col = 0; col < BLOCK_COL; col++) {
			rotatedBlockType[row][col] = blockType[BLOCK_ROW - col - 1][row];
		}
	}
	return rotatedBlockType;
}

document.onkeydown = function (e) {
	if (gameOverFlag) {
		return;
	}

	//キーコード設定
	var keyCode = e.code

		if(keyCode == "Space"){// スペース
			let rotatedBlockType = rotateBlock();
			if (checkMoveBlock(0, 0, rotatedBlockType)) {
				blockType = rotatedBlockType;
			}
		}
		if(keyCode == "ArrowLeft"){// 左
			if (checkMoveBlock(-1, 0)) {
				blockCol--;
			}
		}
		if(keyCode == "ArrowRight"){// 右 x方向に +1
			if (checkMoveBlock(1, 0)) {
				blockCol++;
			}
		}
		if(keyCode == "ArrowDown"){// 下 y方向に +1
			if (checkMoveBlock(0, 1)) {
				blockRow++;
			}
		}
	draw();
}

function checkLineField() {
	for (let row = 0; row < FIELD_ROW; row++) {
		let lineCompleteflag = true;

		for (let col = 0; col < FIELD_COL; col++) {
			if (field[row][col] == 0) {
				// マスが1つでも空の場合
				lineCompleteflag = false;
				break;
			}
		}
		if (lineCompleteflag) {
			// ラインが全て埋まっている場合
			for (let newRow = row; newRow > 0; newRow--) {
				for (let newCol = 0; newCol < FIELD_COL; newCol++) {
					field[newRow][newCol] = field[newRow - 1][newCol];	// 行を1つずつ下にずらす（1つ上の行を現在の行に設定する）
				}
			}
		}
	}
}
