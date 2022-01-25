import firebase_app from '@/assets/js/module.firebase_app';
import { getDatabase, set, ref, push } from 'firebase/database';

export default function send_message(user, message) {
  const _db = getDatabase(firebase_app);
  const _ref = ref(_db, 'messages');
  const _push = push(_ref);

  const date = new Date();

  set(_push, {
    date: {
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    },
    user,
    message
  })
}
