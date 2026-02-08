<script setup lang="ts">
import LSelectItem from "@/components/SelectItem.vue";
import { useRouter, useRoute } from "vue-router";
import { lastUser, lastSession, users, sessions } from "@/ts/greeter";

const router = useRouter();
const route = useRoute();
const mode = route.name === "/base/select_[mode]" ? route.params.mode : "";
</script>

<template>
  <div id="select">
    <div id="content">
      <template v-if="mode === 'user'">
        <LSelectItem
          v-for="user of users"
          :key="user.username"
          :mode="mode"
          :item="user"
          :selected="user.username === lastUser?.username"
          @select="
            lastUser = user;
            router.back();
          "
        />
      </template>
      <template v-if="mode === 'desktop'">
        <LSelectItem
          v-for="session of sessions"
          :key="session.key"
          :mode="mode"
          :item="session"
          :selected="session.key === lastSession?.key"
          @select="
            lastSession = session;
            router.back();
          "
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
#select {
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Lato", "Noto Sans", sans-serif;
  font-weight: normal;
  font-size: 44px;

  text-align: left;
}
</style>
