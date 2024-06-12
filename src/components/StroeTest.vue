<template>
  <!-- store pinia test page~ -->
  <div>
    baseUrl：{{ baseUrl }}
    <button @click="onChangeBaseUrl">change baseUrl</button>
    <div v-show="isShow">
      订阅state isShow:{{ isShow }}
    </div>
    <p>Double count is {{ store.doubleCount }}</p>
    <p>Double count plus is {{ store.doublePlusCount }}</p>
    <div>--------------------分割线useUserListStore----------------</div>
    <p>User 1:{{ getUserById(1) }}</p>
    <p>User 3:{{ getUserById(3) }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore,useUserListStore } from '../stores/counter'

// useCounterStore
const store = useCounterStore()//使用pinia

const { baseUrl } = storeToRefs(store)
const afterChangeBaseUrl = "https://pinia.vuejs.org/"
let isShow = ref<boolean>(false)

// 订阅state(其实就是监听)
store.$subscribe((mutation, state) => {
  console.log('订阅state=', mutation, state)
  if (state.baseUrl === afterChangeBaseUrl) {
    isShow.value = true
    console.log('isShow.value=', isShow.value)
  } else {
    isShow.value = false
  }
}, { detached: false })

// change baseUrl  
const onChangeBaseUrl = () => {
  store.$patch({
    baseUrl: afterChangeBaseUrl
  })
}

// userListStore
const userListStore = useUserListStore()
const { getUserById } = storeToRefs(userListStore)
</script>