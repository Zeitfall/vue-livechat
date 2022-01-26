<template>
  <div class="chat">
    <div class="chat__body container">

      <div class="chat__header">
        <div class="chat__title">Live Chat {{ current_user.value }}</div>
        <button class="chat__button chat__button_logout btn" @click="logout">
          <span class="material-icons">logout</span>
          <span>Logout</span>
        </button>
      </div>

      <ul class="chat__list">
        <li class="chat__message message"
          v-for="m of messages"
          :key="m.key"
        >
          <div class="message__body">
            <div class="message__date">[
              {{ m.date.h < 10 ? '0' + m.date.h : m.date.h }}:{{ m.date.m < 10 ? '0' + m.date.m : m.date.m }}:{{ m.date.s < 10 ? '0' + m.date.s : m.date.s }}
            ]</div>
            <div class="message__username"
              :class="{ message__username_current: m.user.name === current_user.name }"
            >{{ m.user.name }}:</div>
            <div class="message__content">{{ m.message }}</div>
          </div>
        </li>

        <div class="chat__empty"
          v-if="messages.length === 0"
        >
          <span>It's quiet here</span>
          <span class="material-icons">sentiment_dissatisfied</span>
        </div>
      </ul>

      <form class="chat__submit submit" @submit.prevent="on_submit">
        <div class="submit__body container">
          <input
            type="text"
            class="submit__input inpt"
            placeholder="message"
            v-model.trim="state.new_message"
          >
          <button 
            type="submit"
            class="submit__button" 
            :disabled="v$.new_message.$invalid && v$.new_message.$dirty">
              <span class="material-icons">send</span>
              <!-- <span>Send</span> -->
            </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { ref as cref, computed, reactive, onMounted, onBeforeMount } from 'vue';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter, useRoute } from 'vue-router';

import firebase_app from '@/assets/js/module.firebase_app';
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import send_message from '@/assets/js/module.send_message';
import messages from '@/assets/js/module.fetch_messages';

export default {
  setup() {
    // validate
    const state = reactive({
      new_message: ''
    });
    const rules = {
      new_message: { required }
    };
    const v$ = useVuelidate(rules, state);

    
    // router
    const _route = useRoute();
    const _router = useRouter();

   
    // authentication
    const logout = async() => {
      try {
        const _auth = getAuth(firebase_app);
        const reponse = await signOut(_auth);
       
        localStorage.getItem('CURRENT_USER')
          ? localStorage.removeItem('CURRENT_USER')
          : '';

        _router.push({ name: 'login' });
      } catch(error) { alert(error); }
    };


    // current user
    const current_user = localStorage.getItem('CURRENT_USER')
      ? JSON.parse(localStorage.getItem('CURRENT_USER'))
      : '';


    // scrolling
    const scroll_down = query => {
      const block = document.querySelector(query);
      block.scrollTop = block.scrollHeight;
    };

    onMounted(() => {
      if(!current_user) _router.push({ name: 'login' });

      window.addEventListener('resize', () => {        
        scroll_down('.chat__list');
      })
    })
    

    return {
      v$,
      state,
      current_user,
      messages,
      logout,
      scroll_down
    }
  },
  methods: {
    on_submit() {
      this.v$.$validate();
      if(this.v$.$error) return;


      send_message(this.current_user, this.state.new_message);
      this.state.new_message = '';


      this.scroll_down('.chat__list');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_global.scss';

.chat {
  min-height: 100vh;
  display: flex;

  &__body {
    flex: 1 1 100%;
    position: relative;

    display: grid;
    grid-template: 40px 1fr 40px / 1fr;
    gap: 10px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-size: 36px;
    color: $user-color;
  }

  &__button {
    &_logout { max-width: 100px; }
    &_submit { max-width: 100px; }
  }

  &__list {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;

    max-height: calc(100vh - ( $padding*3 /*3-d $padding is grid-gaps sum */ + 80px /* 80px = (header + input) sections */ ));
    overflow-y: scroll;
    scroll-behavior: smooth;
  }

  &__submit {}

  &__empty {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    span {
      font-size: 36px;
      color: rgb(185, 184, 184);
    }
  }
}

.message {
  &:not(:last-child) { margin: 0 0 10px 0; }
  color: $msg-color;

  &__body {
    display: flex;
  }

  &__date {
    flex: 0 0 auto;
    margin: 0 5px 0 0;
    font-weight: bold;
    color: $date-color;
  } 

  &__username {
    flex: 0 0 auto;
    margin: 0 5px 0 0;
    font-weight: bold;
    color: $user-color;

    &_current {
      color: rgb(71, 138, 177);
    }
  }

  &__content {
    flex: 0 1 100%;
    word-break: break-word;

    line-height: 16px;
  }
}

.submit {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: $bcg-color;
  transform: translateY(-$padding);


  display: flex;

  &__body {
    flex: 1 1 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $padding;
  }

  &__input {
    flex: 0 1 auto;
    word-break: break-word;
    color: $msg-color;
    padding: 5px 60px 5px 20px;
    width: 100%;
    margin: 0;
  }

  &__button {
    position: absolute;
    right: 0;
    width: 50px;
    height: 100%;

    transform: translateX(calc(-50%));

    background-color: transparent;
    color: $msg-color;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
