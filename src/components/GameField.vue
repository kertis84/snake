<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
computed,
} from "vue";
import Gameplay, { GameState } from "./Gameplay";
import GameSettings from "./GameSettings";
import Drawer from "./Drawer";

interface Props {
  settings: GameSettings;
  game: Gameplay;
}

const props = defineProps<Props>();

const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const renderContext: Ref<CanvasRenderingContext2D | undefined> = ref();
const drawer = new Drawer();
let timer: number;

onMounted(() => {
  // Get canvas context. If 'getContext' returns 'null', set to 'undefined', so that it conforms to the Ref typing
  renderContext.value = canvas.value?.getContext("2d") || undefined;
  renderField();
  addEventListener("keydown", keyDown);
});

function keyDown(event: KeyboardEvent) {
  if (
    props.game.gameState === GameState.ready &&
    event.code.startsWith("Arrow")
  )
    props.game.gameState = GameState.run;
  else if (props.game.gameState === GameState.run && event.code === "Space")
    props.game.gameState = GameState.ready;
  else if (props.game.gameState === GameState.lose && event.code === "Space") {
    props.game.resetGame();
  }
  props.game.setDirection(event.code);
}

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  removeEventListener("keydown", keyDown);
});

function renderField() {
  nextTick(() => {
    if (!renderContext.value) {
      return;
    }
    drawer.drawBg(renderContext.value, props.settings.cellLength);
    drawer.drawFruit(renderContext.value, props.game.fruit, props.settings.cellLength);
    drawer.drawMongoose(renderContext.value, props.game.mongoose, props.settings.cellLength);
    drawer.drawSnake(renderContext.value, props.game.headPos, props.game.snakeTail, props.game.eatenFruits, props.game.gameState, props.settings.cellLength);
  });
}

const isRunning = computed(() => {
  return props.game.gameState === GameState.run;
})

watch(isRunning, () => {
  if (isRunning.value)
    timer = setInterval(()=>props.game.step(), 1000 / props.game.speed);
  else if (timer) clearInterval(timer);
});

watch(props.settings, () => {
  renderField();
});

watch(props.game, () => {
  renderField();
});
</script>

<template>
  <div class="menu-container">
    <canvas
      ref="canvas"
      :width="props.settings.fieldSize * props.settings.cellLength"
      :height="props.settings.fieldSize * props.settings.cellLength"
      style="border: 2px solid #8f8f8f"
      class="my-auto"
    >
    </canvas>
  </div>
</template>

<style scoped>
.menu-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
