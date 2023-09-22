<script setup lang="ts">
import GameSettings, {
  CELL_LENGTH,
  EXTRA_SMALL_FIELD,
  LARGE_FIELD,
  MEDIUM_FIELD,
  SMALL_FIELD,
} from "./components/GameSettings";
import Copyright from "./components/Copyright.vue";
import Gameplay, { Direction } from "./components/Gameplay";
import {
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  watch,
  nextTick,
} from "vue";

enum GameState { 'ready', 'run', 'lose' }

// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const renderContext: Ref<CanvasRenderingContext2D | undefined> = ref();
const gameSettings = ref(new GameSettings());
const game = ref(new Gameplay(gameSettings.value));
let timer: number;
const scale = ref(1);
const gameState = ref(GameState.ready);

onMounted(() => {
  // Get canvas context. If 'getContext' returns 'null', set to 'undefined', so that it conforms to the Ref typing
  renderContext.value = canvas.value?.getContext("2d") || undefined;
  renderField();
  addEventListener("keydown", keyDown);
});

watch(gameState, () => {
  if (gameState.value === GameState.run) timer = setInterval(nextStep, 1000 / game.value.speed);
  else if (timer) clearInterval(timer);
});

function keyDown(event: KeyboardEvent) {
  if (
    gameState.value === GameState.ready &&
    event.code.startsWith("Arrow")
  )
    gameState.value = GameState.run;
  else if (gameState.value === GameState.run && event.code === "Space") {
    gameState.value = GameState.ready;
  }
  game.value.setDirection(event.code);
}

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  removeEventListener("keydown", keyDown);
});

function drawBg(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "RGBA(100,100,100,0.1)";
  for (
    var x = 0;
    x <= ctx.canvas.width;
    x += 2 * gameSettings.value.cellLength
  ) {
    for (
      var y = 0;
      y <= ctx.canvas.height;
      y += 2 * gameSettings.value.cellLength
    ) {
      ctx.fillRect(
        x,
        y,
        gameSettings.value.cellLength,
        gameSettings.value.cellLength
      );
    }
  }
  for (
    var x = gameSettings.value.cellLength;
    x <= ctx.canvas.width;
    x += 2 * gameSettings.value.cellLength
  ) {
    for (
      var y = gameSettings.value.cellLength;
      y <= ctx.canvas.height;
      y += 2 * gameSettings.value.cellLength
    ) {
      ctx.fillRect(
        x,
        y,
        gameSettings.value.cellLength,
        gameSettings.value.cellLength
      );
    }
  }
}

function drawSnake(ctx: CanvasRenderingContext2D) {
  let x = game.value.headPos.x;
  let y = game.value.headPos.y;
  ctx.fillStyle =
    gameState.value === GameState.lose
      ? "RGB(255,51,51)"
      : "RGB(100,150,100)";
  ctx.fillRect(
    x * gameSettings.value.cellLength,
    y * gameSettings.value.cellLength,
    gameSettings.value.cellLength,
    gameSettings.value.cellLength
  );

  for (let i = 0; i < game.value.snakeTail.length; i++) {
    [x, y] = Direction.directionStep(x, y, game.value.snakeTail[i]);

    if (game.value.eatenFruits.indexOf(i) >= 0) {
      ctx.fillStyle = "RGB(0,102,204)";
      ctx.fillRect(
        x * gameSettings.value.cellLength,
        y * gameSettings.value.cellLength,
        gameSettings.value.cellLength,
        gameSettings.value.cellLength
      );
    } else {
      ctx.fillStyle = "RGB(100,100,150)";
      ctx.fillRect(
        x * gameSettings.value.cellLength,
        y * gameSettings.value.cellLength,
        gameSettings.value.cellLength,
        gameSettings.value.cellLength
      );
    }
  }
}

function drawFruit(ctx: CanvasRenderingContext2D) {
  const img = new Image();
  img.src = ["/images/fruit_", game.value.fruit.type, ".svg"].join("");
  ctx.drawImage(
    img,
    game.value.fruit.x * gameSettings.value.cellLength,
    game.value.fruit.y * gameSettings.value.cellLength,
    gameSettings.value.cellLength,
    gameSettings.value.cellLength
  );
}

function drawMongoose(ctx: CanvasRenderingContext2D) {
  const img = new Image();
  img.src = "/images/mongoose.svg";
  game.value.mongoose.forEach((mongoose) =>
    ctx.drawImage(
      img,
      mongoose.x * gameSettings.value.cellLength,
      mongoose.y * gameSettings.value.cellLength,
      gameSettings.value.cellLength,
      gameSettings.value.cellLength
    )
  );
}

function nextStep() {
  if(!game.value.step())
    gameState.value = GameState.lose;
  renderField();
}

function renderField() {
  if (!renderContext.value) {
    return;
  }
  drawBg(renderContext.value);
  drawSnake(renderContext.value);
  drawFruit(renderContext.value);
  drawMongoose(renderContext.value);
}

function resetGame(e: MouseEvent) {
  const target = e.target as HTMLDivElement;
  if (target.id === "field_xs")
    gameSettings.value.fieldSize = EXTRA_SMALL_FIELD;
  else if (target.id === "field_sm") gameSettings.value.fieldSize = SMALL_FIELD;
  else if (target.id === "field_md")
    gameSettings.value.fieldSize = MEDIUM_FIELD;
  else gameSettings.value.fieldSize = LARGE_FIELD;
  game.value.resetGame();
  nextTick(() => {
    renderField();
  });
}

function toggleScale() {
  scale.value = scale.value === 1 ? 2 : 1;
  gameSettings.value.cellLength = CELL_LENGTH * scale.value;
  nextTick(() => {
    renderField();
  });
}
</script>

<template>
  <div class="my-3 mx-auto menu-container">
    <div class="mx-2 menu-item my-auto" id="field_xs" @click="resetGame">
      Extra small
    </div>
    <div class="mx-2 menu-item my-auto" id="field_sm" @click="resetGame">
      Small
    </div>
    <div class="mx-2 menu-item my-auto" id="field_md" @click="resetGame">
      Medium
    </div>
    <div class="mx-2 menu-item my-auto" id="field_lg" @click="resetGame">
      Large
    </div>
    <div
      class="mx-2 menu-item my-auto scale"
      :class="scale === 1 ? 'plus' : 'minus'"
      @click="toggleScale"
    ></div>
  </div>

  <div class="menu-container" style="height: 75vh">
    <canvas
      ref="canvas"
      :width="gameSettings.fieldSize * gameSettings.cellLength"
      :height="gameSettings.fieldSize * gameSettings.cellLength"
      style="border: 2px solid #8f8f8f"
      class="my-auto"
    >
    </canvas>
  </div>

  <Copyright />
</template>

<style scoped>
.scale {
  height: 1.25rem;
  width: 1.25rem;
}
.plus {
  background-image: url(/images/plus.svg);
  background-size: 100% 100%;
}
.minus {
  background-image: url(/images/minus.svg);
  background-size: 100% 100%;
}
.menu-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.menu-item {
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  text-decoration: underline;
}
.my-3 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.mx-2 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
