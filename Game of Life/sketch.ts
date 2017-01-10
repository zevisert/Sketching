/// <reference path="p5.global-mode.d.ts" />

const enum Dir {
	up = 1,
	down = 2,
	right = 4,
	left = 8
};

const enum State {
	dead = 0,
	dying = 1,
	alive = 2,
	newborn = 4
};

let cells : Cells;
let workarea = { width: 600, height: 600, cellSize: 10 };

function setup() : void {
	createCanvas(workarea.width, workarea.height);
	cells = new Cells(workarea.width / workarea.cellSize, workarea.height / workarea.cellSize);
}

function draw() : void {
	noStroke();
	clear();
	cells.draw(workarea.cellSize);
	cells.live();
}

class Cells {
	private states: State[][];

	constructor(private width: number, private height: number) {
		this.states = [];

		for (let i = 0; i < this.height - 1; i += 1) {
			this.states[i] = [];
			for (let j = 0; j < this.width - 1; j += 1) {
				this.states[i][j] = State.dead;
			}
		}
	}

	getState(i: number, j:number) {
		return this.states[i][j];
	}

	setState(i: number, j: number, value: State)
	{
		this.states[i][j] = value;
	}

	neighbour (i: number, j: number, direction: Dir) : State {
		let ni = i;
		let nj = j;

		if ((direction & Dir.left) === Dir.left) {
			ni -= 1;
		}
		
		if ((direction & Dir.right) === Dir.right) {
			ni += 1;
		}

		if ((direction & Dir.up) === Dir.up) {
			nj -= 1;
		}
		
		if ((direction & Dir.down) === Dir.down){
			nj += 1;
		}

		if (ni >= 0 && ni < this.width && nj >= 0 && nj < this.height)
		{
			return this.getState(ni, nj);
		}
	}

	draw(cellSize: number) : void {
		for (let i = 0; i < this.width - 1; i += 1) {
			for (let j = 0; j < this.height - 1; j += 1) {
				if (cells.getState(i,j) === State.alive) {
					fill(0, 200, 0);
				} else {
					fill(255, 255, 255);
				}
				ellipse((i + 1)* cellSize, (j + 1) * cellSize, cellSize * 0.8, cellSize * 0.8);
			}
		}
	}

	live() : void {

	}
}



