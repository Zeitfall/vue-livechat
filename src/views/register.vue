<template>
  <form class="auth" @submit.prevent="register">
    <div class="auth__body">
      <div class="auth__header">
        <div class="auth__title">Live Chat</div>
        <div class="auth__subtitle">registration</div>
      </div>

      <div class="auth__input">
        <input
          type="text"
          class="inpt"
          placeholder="email@domain.com"
          v-model.trim="state.user.email"
        >
        <span class="auth__input-error"
          v-if="v$.user.email.$invalid && v$.user.email.$dirty"
        >
        {{ v$.user.email.$errors[0].$message }}
        </span>
      </div>

      <div class="auth__input">
        <input
          type="text"
          class="inpt"
          placeholder="nickname"
          v-model.trim="state.user.name"
        >
        <span class="auth__input-error"
          v-if="v$.user.name.$invalid && v$.user.name.$dirty"
        >
        {{ v$.user.name.$errors[0].$message }}
        </span>
      </div>

      <div class="auth__input">
        <input
          type="password"
          class="inpt"
          placeholder="password"
          v-model.trim="state.user.password"
        >
        <span class="auth__input-error"
          v-if="v$.user.password.$invalid && v$.user.password.$dirty"
        >
        {{ v$.user.password.$errors[0].$message }}
        </span>
      </div>

      <button type="submit" class="auth__button btn">
        <span class="material-icons">login</span>
        <span>Register!</span>
      </button>

      <div class="auth__redirect">
        <router-link :to="{ name: 'login' }">already have an account?</router-link>
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
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

export default {
  setup() {
    // validation
    const state = reactive({
      user: {
        email: '',
        name: '',
        password: ''
      }
    });

    const rules = {
      user: {
        email: { required, email },
        name: { required },
        password: { required, minLength: minLength(6) }
      }
    };

    const v$ = useVuelidate(rules, state);


    // router
    const _route = useRoute();
    const _router = useRouter();


    // register
    const register = async() => {
      try {
        const _auth = getAuth(firebase_app);
        const response = await createUserWithEmailAndPassword(_auth, state.user.email, state.user.password);

        await updateProfile(_auth.currentUser, { displayName: state.user.name });

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
      register
    }
  }
}
</script>
