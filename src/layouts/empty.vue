<template>
  <div class="empty">
    <div class="empty__body">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  min-height: 100vh;
  display: flex;

  &__body {
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
