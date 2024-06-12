<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

const foo = ref(1);
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2 class="foo">{{foo}}</h2>
</template>

<style scoped>
a {
  color: #42b983;
}
.foo{
  color: red;
}
</style>
