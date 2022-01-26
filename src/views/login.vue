<template>
  <form class="auth" @submit.prevent="login">
    <div class="auth__body">
      <div class="auth__header">
        <div class="auth__title">Live Chat</div>
        <div class="auth__subtitle">login</div>
      </div>

      <div class="auth__input">
        <input
          type="text"
          class="inpt"
          placeholder="email"
          v-model="state.user.email"
        >
        <span class="auth__input-error"
          v-if="v$.user.email.$invalid && v$.user.email.$dirty"
        >
        {{ v$.user.email.$errors[0].$message }}
        </span>
      </div>

      <div class="auth__input">
        <input
          type="password"
          class="inpt"
          placeholder="password"
          v-model="state.user.password"
        >
        <span class="auth__input-error"
          v-if="v$.user.password.$invalid && v$.user.password.$dirty"
        >
        {{ v$.user.password.$errors[0].$message }}
        </span>
      </div>

      <button type="submit" class="auth__button btn">
        <span class="material-icons">login</span>
        <span>Join!</span>
      </button>

      <div class="auth__redirect">
        <router-link :to="{ name: 'register' }">haven't an account?</router-link>
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed, reactive } from 'vue';

import useVuelidate from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import { useRouter, useRoute } from 'vue-router';

import firebase_app from '@/assets/js/module.firebase_app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

export default {
  setup() {
    // validation
    const state = reactive({
      user: {
        email: '',
        password: ''
      }
    });

    const rules = {
      user: {
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    };

    const v$ = useVuelidate(rules, state);


    // router
    const _route = useRoute();
    const _router = useRouter();


    // login
    const login = async() => {
      try {
        const _auth = getAuth(firebase_app);
        const response = await signInWithEmailAndPassword(_auth, state.user.email, state.user.password);

        localStorage.setItem('CURRENT_USER', JSON.stringify({
          name: response.user.displayName,
          email: response.user.email
        }));

        _router.push({ name: 'chat' });
      } catch(error) { alert(error); }
    };

 
    return {
      v$,
      state,
      login
    }
  }
}
</script>
