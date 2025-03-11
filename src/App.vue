<template>
  <div>
    <h1>Users</h1>
    <ul>
      <li v-for="(user, index) in users" :key="index">名字：{{ user.name }}  邮件地址：{{ user.email }}</li>
    </ul>
    <button @click="addUserClick">追加用户</button>
    <p style="margin-top: 50px;">点击按钮将追加用户到userStore全局状态，在main.js中：<br /><br />
      import { useUserStore } from '@/stores/userStore'<br />
      import PiniaToDB from '@/PiniaToDB'<br />
      new PiniaToDB(useUserStore(), 'SavePiniaDataToIndexedDB', 'User').subscribe();<br /><br />
      PiniaToDB实例化之后通过subscribe()方法订阅，当状态变化时，将数据保存到IndexedDB中<br />
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore();
// 对于store的状态，需要计算属性实现响应式
const users = computed(() => userStore.users)

function addUserClick() {
  userStore.addUser('张三', 'zhangsan@163.com');
}
</script>

<style scoped></style>