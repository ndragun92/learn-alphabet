<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div>
      <h1 class="text-center mb-4 font-bold text-xl">
        Leonardo School
      </h1>
      <div class="flex items-center gap-4">
        <button
          class="h-12 w-[40vw] bg-green-500 text-white"
          type="button"
          @click="$router.push('/game')"
        >
          Play
        </button>
        <button
          class="h-12 w-[40vw] bg-black text-white"
          type="button"
          @click="$router.push('/settings')"
        >
          Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHomepage'
}
</script>