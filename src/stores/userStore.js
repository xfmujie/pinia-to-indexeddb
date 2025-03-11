import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([]);
  const addUser = (name, email) => {
    users.value.push({ name, email })
  }
  return { users, addUser }
})
