<template>
  <form class="auth" @submit.prevent="login">
    <div class="auth__body">
      <div class="auth__title">Live Chat</div>

      <div class="auth__input">
        <input
          type="text"
          class="inpt"
          placeholder="your nickname..."
          v-model="state.user.name"
        >
        <span class="auth__input-error"
          v-if="v$.user.name.$invalid && v$.user.name.$dirty"
        >
        {{ v$.user.name.$errors[0].$message }}
        </span>
      </div>

      <button type="submit" class="auth__button btn">
        <span class="material-icons">login</span>
        <span>Join!</span>
      </button>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { ref, computed, reactive } from 'vue';

export default {
  setup() {
    const state = reactive({
      user: {
        name: '',
        // password: ''
      }
    });

    const rules = {
      user: {
        name: { required },
        // password: password: { required, minLength: minLength(6) }
      }
    };

    const v$ = useVuelidate(rules, state);
 
    return {
      v$,
      state
    }
  },
  methods: {
    login() {
      this.v$.$validate();
      if(this.v$.$error) return;

      localStorage.setItem('CURRENT_USER', JSON.stringify(this.state.user));

      this.$router.push({ name: 'chat' });
      this.v$.$touch();
    }
  }
}
</script>

<style lang="scss" scoped>
.auth {
  &__body {
    display: grid;
    gap: 10px;
  }

  &__title {
    font-size: 24px;
  }

  &__input {
    position: relative;
    margin: 0 0 15px 0;
  }

  &__input-error {
    position: absolute;
    inset: 0;
    transform: translateY(calc(100% + 5px));
    font-size: 11px;
    color: red;
  }

  &__button {
    width: 100%;
  }
}
</style>
