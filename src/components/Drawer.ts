import { Direction, GameState, type Fruit, type Point } from "./Gameplay";

export default class Drawer {
    mongooseImg: HTMLImageElement;
    fruitImg: HTMLImageElement;

    constructor(){
        this.fruitImg = new Image();
        this.mongooseImg = new Image();
        this.mongooseImg.src = "/images/mongoose.svg";
    }

    drawBg(ctx: CanvasRenderingContext2D, cellLength: number) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "RGBA(100,100,100,0.1)";
        for (var x = 0; x <= ctx.canvas.width; x += 2 * cellLength) {
          for (
            var y = 0;
            y <= ctx.canvas.height;
            y += 2 * cellLength
          ) {
            ctx.fillRect(x, y, cellLength, cellLength);
          }
        }
        for (
          var x = cellLength;
          x <= ctx.canvas.width;
          x += 2 * cellLength
        ) {
          for (
            var y = cellLength;
            y <= ctx.canvas.height;
            y += 2 * cellLength
          ) {
            ctx.fillRect(x, y, cellLength, cellLength);
          }
        }
      }
      
      drawSnake(ctx: CanvasRenderingContext2D, head: Point, tail: Array<Direction>, eatenFruits: Array<number>, gameState: GameState, cellLength: number) {
        let x = head.x;
        let y = head.y;
        ctx.fillStyle =
          gameState === GameState.lose
            ? "RGB(255,51,51)"
            : "RGB(100,150,100)";
        ctx.fillRect(
          x * cellLength,
          y * cellLength,
          cellLength,
          cellLength
        );
      
        for (let i = 0; i < tail.length; i++) {
          [x, y] = Direction.directionStep(x, y, tail[i]);
      
          if (eatenFruits.indexOf(i) >= 0) {
            ctx.fillStyle = "RGB(0,102,204)";
            ctx.fillRect(
              x * cellLength,
              y * cellLength,
              cellLength,
              cellLength
            );
          } else {
            ctx.fillStyle = "RGB(100,100,150)";
            ctx.fillRect(
              x * cellLength,
              y * cellLength,
              cellLength,
              cellLength
            );
          }
        }
      }
      
      drawFruit(ctx: CanvasRenderingContext2D, fruit: Fruit, cellLength: number) {
        this.fruitImg.src = ["/images/fruit_", fruit.type, ".svg"].join("");
        ctx.drawImage(
          this.fruitImg,
          fruit.x * cellLength,
          fruit.y * cellLength,
          cellLength,
          cellLength
        );
      }
      
      drawMongoose(ctx: CanvasRenderingContext2D, mongooseArray: Array<Point>, cellLength: number) {
        mongooseArray.forEach((mongoose) =>
          ctx.drawImage(
            this.mongooseImg,
            mongoose.x * cellLength,
            mongoose.y * cellLength,
            cellLength,
            cellLength
          )
        );
      }      
}