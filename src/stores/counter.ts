import { defineStore } from 'pinia';

// Options Store写法，现在是counter.ts
interface ICounterState {
  count: number,
  baseUrl: string,
  name: string
}
export const useCounterStore = defineStore('counter', {
  state: (): ICounterState => ({
    count: 0,
    baseUrl: 'https://cn.vuejs.org/',
    name:'hello leaf~'
  }),
  persist: true,//将useCounterStore使用默认持久化配置保存
  getters: {
    doubleCount: (state) => state.count * 2,
    doublePlusCount(): number {
      return this.doubleCount + 1
    }
  },
  actions: {
    increment() {
      this.count++;
    },
    changeState(params: string) {
      this.baseUrl = params
    },
    randommizeCounter() {
      this.count = Math.round(100 * Math.random())
    }
  },
});
// Setup Store写法
// export const useCounterStore2 = defineStore('counter',()=>{
//   const count = ref(0)
//   const doubleCount = computed(()=>count.value * 2)
//   function increment() {
//     count.value ++
//   }
//   return {count,doubleCount,increment}
// })
// mande has better defaults to communicate with APIs using fetch
import { mande } from 'mande'
const api = mande('/api/users')
interface IUserState {
  userData: any,
  userList: UserInfo[],
  user: string | null
}
interface UserInfo {
  id: number,
  active: boolean,
  name: string,
  age: number
}
export const useUserListStore = defineStore('userList', {
  state: (): IUserState => ({
    userData: null,
    userList: [{
      id: 1,
      active: true,
      name: '张三',
      age: 18
    }, {
      id: 2,
      active: true,
      name: '李四',
      age: 20
    }, {
      id: 3,
      active: true,
      name: '王五',
      age: 22
    }],
    user: '张三',
  }),
  getters: {
    getUserById: (state: IUserState) => {
      return (userId: number): UserInfo | undefined => state.userList.find((user) => user.id === userId)
    },
    getActiveUserById: (state: IUserState) => {
      const activeUserList = state.userList.filter((user: UserInfo) => user.active)
      return (userId: number) => activeUserList.filter((user) => user.id === userId)
    }
  },
  actions: {
    async registerUser(login: string, password: string) {
      try {
        this.userData = await api.post({ login, password })
        console.log(`Welcome back ${this.userData.name}`)
      } catch (error) {
        console.log('error', error)
        return error
      }
    }
  }
})