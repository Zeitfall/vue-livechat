import { ref as cref } from 'vue';

import firebase_app from '@/assets/js/module.firebase_app';
import { ref as fbref, onValue, getDatabase } from 'firebase/database';

const _db = getDatabase(firebase_app);
const _ref = fbref(_db, 'messages');

let messages = cref([]);

onValue(_ref, snapshot => {
  let _array = [];

  if(!snapshot.val()) return;

  for(const m of Object.entries(snapshot.val())) {
    _array.push({
      key: m[0],
      date: m[1].date,
      message: m[1].message,
      user: m[1].user
    });
  }

  messages.value = _array;
});

export default messages;
