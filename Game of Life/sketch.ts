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

let runLife : boolean  = false;
let stepOnce : boolean = false;
let cells : Cells;
let workarea = { width: 600, height: 600, cellSize: 10 };

function setup() : void {
	createCanvas(workarea.width, workarea.height);
	cells = new Cells(workarea.width / workarea.cellSize, workarea.height / workarea.cellSize);
}

function draw() : void {
	frameRate(10);
	noStroke();
	clear();
	cells.draw(workarea.cellSize);

	if (runLife || stepOnce) {
		cells.live();
		stepOnce = false;
	}
}


function mouseClicked() : void {
	let cellX = clamp(Math.floor(mouseX / workarea.cellSize), 0, workarea.width / workarea.cellSize - 1);
	let cellY = clamp(Math.floor(mouseY / workarea.cellSize), 0, workarea.height / workarea.cellSize - 1);

	if (cells.getState(cellX, cellY) === State.alive) {
		cells.setState(cellX, cellY, State.dead);
	} else {
		cells.setState(cellX, cellY, State.alive);
	}
}

function mouseDragged() : void {
	let cellX = clamp(Math.floor(mouseX / workarea.cellSize), 0, workarea.width / workarea.cellSize -1);
	let cellY = clamp(Math.floor(mouseY / workarea.cellSize), 0, workarea.height / workarea.cellSize -1);

	if (cells.getState(cellX, cellY) === State.alive) {
		cells.setState(cellX, cellY, State.dead);
	} else {
		cells.setState(cellX, cellY, State.alive);
	}
}

function clamp(num, min, max) : number {
  return num <= min ? min : num >= max ? max : num;
}

function toggleLife() { 
	runLife = !runLife;
}

function doStep() {
	stepOnce = true;
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

		if (ni >= 0 && ni < this.width - 1 && nj >= 0 && nj < this.height - 1)
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
		for (let i = 0; i < this.width - 1; i += 1) { 
			for (let j = 0; j < this.height - 1; j += 1) {

				const livingNeighbours = this.countLivingNeighbours(i, j);

				// 	Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
				// 	Any live cell with two or three live neighbours lives on to the next generation.
				// 	Any live cell with more than three live neighbours dies, as if by overpopulation.
				if (this.isLiving(this.getState(i,j)) && (livingNeighbours < 2 || livingNeighbours > 3)){
					cells.setState(i, j, State.dying);
				}

				// 	Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				else if (!this.isLiving(this.getState(i, j)) && livingNeighbours === 3) {
					cells.setState(i, j, State.newborn);
				}
			}
		}

		// Anything dying is now dead, and anything born is now alive
		for (let i = 0; i < this.width - 1; i += 1) { 
			for (let j = 0; j < this.height - 1; j += 1) {
				if (cells.getState(i,j) === State.dying)
				{
					cells.setState(i, j, State.dead);
				}
				if (cells.getState(i,j) === State.newborn)
				{
					cells.setState(i, j, State.alive);
				}
			}
		}
	}

	isLiving(cell) : boolean {
		return typeof cell !== "undefined" && cell !== State.dead && cell != State.newborn;
	}

	countLivingNeighbours(i: number, j: number) : number {
		let count = 0;
		let neighbours = { 
			up: 		cells.neighbour(i, j, Dir.up),
			down: 		cells.neighbour(i, j, Dir.down),
			right: 		cells.neighbour(i, j, Dir.right),
			left: 		cells.neighbour(i, j, Dir.left),
			upright: 	cells.neighbour(i, j, Dir.up   | Dir.right),
			upleft: 	cells.neighbour(i, j, Dir.up   | Dir.left),
			downright: 	cells.neighbour(i, j, Dir.down | Dir.right),
			downleft: 	cells.neighbour(i, j, Dir.down | Dir.left)
		};

		if (this.isLiving(neighbours.up)) count += 1;
		if (this.isLiving(neighbours.down)) count += 1;
		if (this.isLiving(neighbours.right)) count += 1;
		if (this.isLiving(neighbours.left)) count += 1;
		if (this.isLiving(neighbours.upright)) count += 1;
		if (this.isLiving(neighbours.upleft)) count += 1;
		if (this.isLiving(neighbours.downright)) count += 1;
		if (this.isLiving(neighbours.downleft)) count += 1;

		return count;
	}
}



