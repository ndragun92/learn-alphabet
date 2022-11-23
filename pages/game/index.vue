<template>
  <div
    v-if="!loading"
    class="flex justify-center p-4 pb-16"
  >
    <ul
      v-if="playing"
      class="flex flex-row flex-wrap gap-4 justify-center"
    >
      <li
        v-for="letter in alphabet.data"
        :key="letter"
        class="bg-neutral-100 w-32 h-32 flex items-center justify-center text-5xl border border-2"
        :class="
          { uppercase ,
            'border-red-500' : wrongAnswers.data.includes(letter),

          }"
        @click="onSelectLetter(letter)"
      >
        {{ letter }}
      </li>
    </ul>
    <div v-else>
      <ul
        v-if="wrongAnswersHistory.data.length"
        class="flex flex-row flex-wrap gap-4 justify-center"
      >
        <li
          v-for="letter in wrongAnswersHistory.data"
          :key="letter"
          class="bg-neutral-100 w-32 h-32 flex items-center justify-center text-5xl border border-2 border-red-500"
          :class="
            { uppercase }"
        >
          {{ letter }}
        </li>
      </ul>
      <template v-if="correctAnswersHistory.data.length">
        <hr
          v-if="wrongAnswersHistory.data.length"
          class="my-4"
        >
        <ul
          class="flex flex-row flex-wrap gap-4 justify-center"
        >
          <li
            v-for="letter in correctAnswersHistory.data"
            :key="letter"
            class="bg-neutral-100 w-32 h-32 flex items-center justify-center text-5xl border border-2 border-green-500"
            :class="
              { uppercase }"
          >
            {{ letter }}
          </li>
        </ul>
      </template>
    </div>
    <div class="fixed left-0 right-0 bottom-0 bg-black text-white flex text-center h-12">
      <button
        class="flex-1"
        type="button"
        @click="$router.push('/')"
      >
        Back
      </button>
      <div class="h-full w-0.5 bg-white" />
      <button
        v-if="!playing"
        class="flex-1 bg-green-500"
        type="button"
        @click="onPlay(true)"
      >
        Start
      </button>
      <button
        v-else
        type="button"
        class="flex-1 bg-blue-500 items-center justify-center flex"
        @click="onListenLetter"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      </button>
    </div>
  </div>
  <div
    v-if="preLoadingStage"
    class="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black bg-opacity-90 flex items-center justify-center"
  >
    <div class="text-4xl text-black uppercase font-bold">
      <svg
        class="animate-spin h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </div>
  <div
    v-if="loadingStage"
    class="fixed top-0 right-0 bottom-0 left-0 z-20 bg-green-500 bg-opacity-90 flex items-center justify-center"
  >
    <div class="text-4xl text-black uppercase font-bold">
      Bravo!!!
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageGame'
}
</script>

<script lang="ts" setup>
const loading = ref(true)
const preLoadingStage = ref(false)
const loadingStage = ref(false)
const uppercase = ref(true)
const playing = ref(false)
const audio = ref<null | HTMLAudioElement>(null)
const currentLetter = ref('')

const alphabet = reactive<{data: string[]}>({
  data: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
})

const usedLetters = reactive<{data: string[]}>({
  data: []
})

const correctAnswersHistory = reactive<{data: string[]}>({
  data: []
})


const wrongAnswers = reactive<{data: string[]}>({
  data: []
})

const wrongAnswersHistory = reactive<{data: string[]}>({
  data: []
})

onMounted(() => {
  const getSelectedLetters = localStorage.getItem('selected_letters')
  if(getSelectedLetters) {
    alphabet.data = JSON.parse(getSelectedLetters)
  }
  const getRandomized = localStorage.getItem('randomize')
  if(getRandomized === 'true') {
    onRandomize()
  }
  const getUppercase = localStorage.getItem('uppercase')
  if(getUppercase === 'true') {
    uppercase.value = true
  }
  nextTick(() => {
    loading.value = false
  })
})

function onPlay(reset = false) {
  if(usedLetters.data.length === alphabet.data.length) {
    const audioPath = new URL(`/assets/audio/effects/end.wav`, import.meta.url).href;
    const endAudio = new Audio(audioPath);
    endAudio?.play();
    currentLetter.value = ''
    usedLetters.data = []
    wrongAnswers.data = []
    if(reset) {
      wrongAnswersHistory.data = []
      correctAnswersHistory.data = []
    }
    playing.value = false
  } else {
    playing.value = true
    const filteredLetters = alphabet.data.filter(letter => !usedLetters.data.includes(letter))
    const letter = filteredLetters[Math.floor(Math.random() * filteredLetters.length)]
    usedLetters.data.push(letter)
    console.log('letter', letter);
    currentLetter.value = letter
    const audioPath = new URL(`/assets/audio/letters/${letter}.wav`, import.meta.url).href;
    audio.value = new Audio(audioPath);
    audio.value?.play();
  }
}

function onListenLetter() {
  audio.value?.play()
}

function onRandomize() {
  alphabet.data = shuffle(alphabet.data)
}

function onSelectLetter(letter: string) {
  preLoadingStage.value = true
  // const audioPathSelected = new URL(`/assets/audio/effects/selected.mp3`, import.meta.url).href;
  // const selectedLetterAudioEffect = new Audio(audioPathSelected);
  // selectedLetterAudioEffect?.play();

  setTimeout(() => {
    const audioPathLetter = new URL(`/assets/audio/letters/${letter}.wav`, import.meta.url).href;
    const selectedLetterAudio = new Audio(audioPathLetter);
    selectedLetterAudio?.play();
    setTimeout(() => {
      if(letter !== currentLetter.value) {
        console.log('WRONG');
        wrongAnswers.data.push(letter)
        wrongAnswersHistory.data.push(letter)
        const audioPath = new URL(`/assets/audio/effects/lost.wav`, import.meta.url).href;
        const lostAudio = new Audio(audioPath);
        lostAudio?.play();
        preLoadingStage.value = false
      } else {
        loadingStage.value = true
        preLoadingStage.value = false
        console.log('CORRECT');
        correctAnswersHistory.data.push(letter)
        wrongAnswers.data = []
        const audioPath = new URL(`/assets/audio/effects/won.wav`, import.meta.url).href;
        const wonAudio = new Audio(audioPath);
        wonAudio?.play();
        setTimeout(() => {
          wonAudio?.pause()
          loadingStage.value = false
          nextTick(() => {
            onPlay()
          })
        }, 3500)
      }
    }, 2000)
  }, 0)


  // if(letter !== currentLetter.value) {
  //   console.log('WRONG');
  //   wrongAnswers.data.push(letter)
  //   wrongAnswersHistory.data.push(letter)
  //   const audioPath = new URL(`/assets/audio/effects/lost.wav`, import.meta.url).href;
  //   const lostAudio = new Audio(audioPath);
  //   lostAudio?.play();
  // } else {
  //   loadingStage.value = true
  //   console.log('CORRECT');
  //   correctAnswersHistory.data.push(letter)
  //   wrongAnswers.data = []
  //   const audioPath = new URL(`/assets/audio/effects/won.wav`, import.meta.url).href;
  //   const wonAudio = new Audio(audioPath);
  //   wonAudio?.play();
  //   setTimeout(() => {
  //     loadingStage.value = false
  //     onPlay()
  //   }, 3500)
  // }
}

function shuffle(array: string[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

</script>
