import type GameSettings from "./GameSettings"

export enum Direction { 'up', 'down', 'left', 'right' }
export namespace Direction {
    export function reverse(direction: Direction) {
        if (direction === Direction.up) return Direction.down
        else if (direction === Direction.down) return Direction.up
        else if (direction === Direction.left) return Direction.right
        else return Direction.left
    }

    export function directionStep(x: number, y: number, direction: Direction) {
        if (direction === Direction.left) return [x - 1, y];
        else if (direction === Direction.right) return [x + 1, y];
        else if (direction === Direction.up) return [x, y - 1];
        else return [x, y + 1];
    }
}

export interface Point {
    x: number,
    y: number,
}

export interface Fruit {
    type: number,
    x: number,
    y: number,
}

export default class Gameplay {
    settings: GameSettings;
    speed = 0;
    direction = Direction.down;
    headPos = {} as Point;
    fruit = {} as Fruit;
    mongoose: Array<Point> = []
    snakeTail: Array<Direction> = []
    eatenFruits: Array<number> = []

    constructor(settings: GameSettings) {
        this.settings = settings
        this.resetGame()
    }

    resetGame() {
        this.headPos = { x: 0, y: 0 }
        this.direction = Direction.down
        this.speed = 3
        this.snakeTail = [Direction.up, Direction.up,]
        this.eatenFruits = []
        this.mongoose = []
        this.setFruit()
        this.setMongoose()
    }

    setFruit() {
        const fruitType = Math.floor(Math.random() * 7)
        while (true) {
            const x = Math.floor(Math.random() * this.settings.fieldSize)
            const y = Math.floor(Math.random() * this.settings.fieldSize)

            if (this.checkConditions(x, y) && !(x === this.headPos.x && y === this.headPos.y)) {
                this.fruit.type = fruitType;
                this.fruit.x = x;
                this.fruit.y = y;
                break;
            }
        }
    }

    setMongoose() {
        while (true) {
            const x = Math.floor(Math.random() * this.settings.fieldSize)
            const y = Math.floor(Math.random() * this.settings.fieldSize)

            if (this.checkConditions(x, y) && !(x === this.fruit.x && y === this.fruit.y) && !(x === this.headPos.x && y === this.headPos.y)) {
                this.mongoose.push({ x: x, y: y })
                break;
            }
        }
    }

    checkConditions(x: number, y: number) {
        // столкновение с границами
        if (x < 0 || y < 0 || x >= this.settings.fieldSize || y >= this.settings.fieldSize)
            return false;
        // столкновение с мангустом
        if (this.mongoose.find(point => point.x === x && point.y === y))
            return false;
        // столкновение с хвостом
        let [a, b] = [this.headPos.x, this.headPos.y];
        for (let i = 0; i < this.snakeTail.length; i++) {
            [a, b] = Direction.directionStep(a, b, this.snakeTail[i]);
            if (a === x && b === y)
                return false;
        }
        return true
    }

    setDirection(direction: string) {
        if (direction === "ArrowDown" && this.snakeTail[0] !== Direction.down)
            this.direction = Direction.down;
        else if (direction === "ArrowUp" && this.snakeTail[0] !== Direction.up)
            this.direction = Direction.up;
        else if (direction === "ArrowRight" && this.snakeTail[0] !== Direction.right)
            this.direction = Direction.right;
        else if (direction === "ArrowLeft" && this.snakeTail[0] !== Direction.left)
            this.direction = Direction.left;
    }

    step() {
        const prevHeadPos = {...this.headPos}
        const prevSnakeTail = [...this.snakeTail]

        this.snakeStepForward();

        if (!this.checkConditions(this.headPos.x, this.headPos.y)) {
            this.headPos = prevHeadPos;
            this.snakeTail = prevSnakeTail;
            return false;
        }

        if (this.headPos.x === this.fruit.x && this.headPos.y === this.fruit.y) {
            this.eatenFruits.push(-1);
            this.setFruit();
        }

        if (this.snakeTail.length / this.mongoose.length > 5) this.setMongoose();

        return true;
    }
    
    snakeStepForward(){
        [this.headPos.x, this.headPos.y] = Direction.directionStep(this.headPos.x, this.headPos.y, this.direction);
        this.eatenFruits = this.eatenFruits.map((val) => val + 1);
        const growPos = this.eatenFruits.indexOf(this.snakeTail.length)

        if (growPos >= 0) {
            this.snakeTail.push(this.snakeTail[this.snakeTail.length - 1])
            this.eatenFruits.splice(growPos, 1);
        }

        this.snakeTail.pop();
        this.snakeTail.unshift(Direction.reverse(this.direction));
    }
}