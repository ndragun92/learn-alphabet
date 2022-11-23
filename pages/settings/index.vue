<template>
  <div
    v-if="!loading"
    class="flex justify-center p-4 pb-16"
  >
    <ul class="flex flex-row flex-wrap gap-4 justify-center">
      <li
        v-for="letter in alphabet"
        :key="letter"
        class="bg-neutral-100 w-32 h-32 flex items-center justify-center text-5xl uppercase border border-2"
        :class="selectedLetters.data.includes(letter) ? 'border-green-500' : 'border-red-500'"
        @click="onSelectLetter(letter)"
      >
        {{ letter }}
      </li>
    </ul>
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
        class="flex-1"
        type="button"
        :class="{'bg-green-500': randomize}"
        @click="onRandomize"
      >
        Randomize
      </button>
      <div class="h-full w-0.5 bg-white" />
      <button
        type="button"
        class="w-12 flex items-center justify-center"
        :class="{'bg-green-500': uppercase}"
        @click="onUppercase"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
          />
        </svg>
      </button>
      <div class="h-full w-0.5 bg-white" />
      <button
        class="flex-1"
        type="button"
        @click="onReset"
      >
        Reset
      </button>
      <div class="h-full w-0.5 bg-white" />
      <button
        class="flex-1"
        type="button"
        @click="onSave"
      >
        Save
      </button>
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
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const randomize = ref(false)
const uppercase = ref(false)

const selectedLetters = reactive<{data: string[]}>({
  data: []
})

onMounted(() => {
  const getSelectedLetters = localStorage.getItem('selected_letters')
  if(getSelectedLetters) {
    selectedLetters.data = JSON.parse(getSelectedLetters)
  }
  const getRandomized = localStorage.getItem('randomize')
  if(getRandomized === 'true') {
    randomize.value = true
  }
  const getUppercase = localStorage.getItem('uppercase')
  if(getUppercase === 'true') {
    uppercase.value = true
  }
  nextTick(() => {
    loading.value = false
  })
})

function onSelectLetter(letter: string) {
  if(selectedLetters.data.includes(letter)) {
    selectedLetters.data = selectedLetters.data.filter(selectedLetter => selectedLetter !== letter)
  } else {
    selectedLetters.data.push(letter)
  }
}

function onRandomize() {
  randomize.value = !randomize.value
  localStorage.setItem('randomize', `${randomize.value}`)
}

function onUppercase() {
  uppercase.value = !uppercase.value
  localStorage.setItem('uppercase', `${uppercase.value}`)
}

function onReset() {
  localStorage.setItem('selected_letters', JSON.stringify(alphabet.sort()))
  localStorage.removeItem('randomize')
  localStorage.removeItem('uppercase')
}

function onSave() {
  localStorage.setItem('selected_letters', JSON.stringify(selectedLetters.data.sort()))
}
</script>
