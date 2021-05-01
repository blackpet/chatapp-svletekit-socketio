import {writable} from 'svelte/store';

let user: User = null;
let isSignIn: boolean = false;

const _store = writable({
  user,
  isSignIn,
});

export default {
  subscribe: _store.subscribe,
  async signIn(_user: User) {
    try {
      user = await new Promise<User>(resolve => resolve(_user));
      isSignIn = true;
    } catch (error) {
      console.log('error occured during signing in');
      user = null;
      isSignIn = false;
    }

    _store.set({user, isSignIn});
  }
}



