<template>
  <div>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <v-app>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </v-app>
    </ClientOnly>
  </div>
</template>
