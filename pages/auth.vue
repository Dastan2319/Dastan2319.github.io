<template>
  <div class="bg">
    <v-card class="mx-auto pa-6" width="300" title="This Test App">
      <v-form @submit.prevent="onSubmit">
        <v-text-field v-model="email" class="mb-2" clearable label="Email"></v-text-field>

        <v-text-field
          v-model="password"
          clearable
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>

        <br />

        <v-btn block color="success" size="large" type="submit" variant="elevated">
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/stores/UserStore";

const store = useAuthStore();
const email = ref("mail@example.com");
const password = ref("qwe123");

const onSubmit = () => {
  store.auth(email.value, password.value);
};
</script>

<style lang="scss" scoped>
.bg {
  background: rgb(233, 233, 253);
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
