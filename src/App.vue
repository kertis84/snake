<script setup lang="ts">
import GameSettings, {
  LARGE_FIELD,
  MEDIUM_FIELD,
  SMALL_FIELD,
} from "./components/GameSettings";
import Copyright from "./components/Copyright.vue";
import GameField from "./components/GameField.vue";
import Gameplay from "./components/Gameplay";
import { reactive, ref } from "vue";

const gameSettings = reactive(new GameSettings());
const game = reactive(new Gameplay(gameSettings));

function resetGame(e: MouseEvent) {
  const target = e.target as HTMLDivElement;
  if (target.id === "field_sm") gameSettings.fieldSize = SMALL_FIELD;
  else if (target.id === "field_md") gameSettings.fieldSize = MEDIUM_FIELD;
  else gameSettings.fieldSize = LARGE_FIELD;
  game.resetGame();
}
</script>

<template>
  <div class="my-5 mx-auto menu-container">
    <div class="mx-2 menu-item my-auto" id="field_sm" @click="resetGame">
      Small
    </div>
    <div class="mx-2 menu-item my-auto" id="field_md" @click="resetGame">
      Medium
    </div>
    <div class="mx-2 menu-item my-auto" id="field_lg" @click="resetGame">
      Large
    </div>
    <div class="mx-2 menu-item my-auto">
      <div class="dropdown">
        <div class="question"></div>
        <div class="dropdown-content" >
          <div class="dropdown-item">Управление: &larr; &uarr; &rarr; &darr;</div>
          <div class="dropdown-item">Рестарт: space</div>
          <div class="dropdown-item">Пауза: space</div>
        </div>
      </div>
    </div>
  </div>
  <div class="my-5 center score">Score: {{ game.score }}</div>
  <GameField :settings="gameSettings" :game="game" />
  <Copyright />
</template>

<style scoped>
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
.my-5 {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}
.mx-2 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-5 {
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
.center {
  text-align: center;
}
.score {
  font-size: xx-large;
  font-weight: 600;
}
.question {
  width: 30px;
  height: 30px;
  background-image: url(/images/question.svg);
  background-size: 100% 100%;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  margin-top: 10px;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  transform: translateX(-100px);
}
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-item {
  padding: 8px 16px;
}
</style>
