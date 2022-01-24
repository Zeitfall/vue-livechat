<template>
  <component :is="layout">
    <router-view/>
  </component>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import empty_layout from '@/layouts/empty';
import main_layout from '@/layouts/main';

export default {
  components: {
    empty_layout,
    main_layout
  },
  setup() {
    const _route = useRoute();
    const _router = useRouter();

    const layout = computed(() => _route.meta._layout + '_layout');

    // load session
    onMounted(() => {
      if(localStorage.getItem('CURRENT_USER')) {
        _router.push({ name: 'chat' });
      }
    })

    return {
      layout
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;700;900&display=swap');
@import '@/assets/scss/_null.scss';
@import '@/assets/scss/_global.scss';

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  background-color: $bcg-color;
  user-select: none;
}

#app {
  min-height: 100vh;
  overflow: hidden;
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: $padding;
}
</style>
