import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

import { mande } from 'mande'
const api = mande('/api/auth')

export const useSettingsStore  = defineStore('setting', {
  state: () => {
    return {
      preferences: null,
    };
  },
  actions: {
    async fetchUserPreferences() {
      // 想要使用另一个 store 的话，那你直接在 action 中调用就好了
      const auth = useAuthStore();
      if(auth.isAuthenticated){
        this.preferences = await api.post()
      }else{
        throw new Error('User must be authenticated')
      }
    },
  },
});