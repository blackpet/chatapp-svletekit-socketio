<script lang="ts">
  import {variables} from '$lib/variables';
  import {onDestroy, onMount, tick} from 'svelte';
  import {goto} from '$app/navigation';
  import user from '../../store/user';
  import io from 'socket.io-client';

  let messages = [];
  let uid, nickname;
  let messageText = '';
  let container, messageInput;

  let socket;

  onMount(() => {
    if (!$user.isSignIn) {
      goto('/');
      return;
    }
    uid = $user.user.uid;
    nickname = $user.user.nickname;

    socket = connectServer();
    // notify new user connected
    socket.emit('WELCOME_USER', nickname);

    socket.on('QNA_NEWMESSAGE', data => {
      console.log('new message!!', data);
      appendMessage(data);
    });
    socket.on('WELCOME_USER', welcomeNewUser);

    console.log('user', $user);
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  })

  function connectServer() {
    const _socket = io(variables.serverPath);
    return _socket;
  }

  function sendMessage(message) {
    socket.emit('QNA_NEWMESSAGE', message);
  }

  async function appendMessage(message) {
    messages = [...messages, message];
    messageText = '';

    await tick();
    container.scrollTop = container.scrollHeight;
    messageInput.focus();
  }

  async function submitMessage() {
    if (!nickname || !messageText) {
      return;
    }
    const newMessage = {type: 'chat', uid, nickname, message: messageText, selected: false, my: false};

    // send to server
    sendMessage(newMessage);

    // append new message to view
    newMessage.my = true;
    appendMessage(newMessage);
  }

  function welcomeNewUser(nickname) {
    messages = [...messages, {type: 'notice', nickname}];
  }
</script>


<div class="min-h-screen bg-gray-100 flex justify-between">
  <!-- selected messages -->
  <div class="hidden flex-1 bg-indigo-200">
    <h1>Selected Messages</h1>
  </div>

  <!-- real time messages -->
  <div class="flex-1 bg-red-200 flex flex-col justify-between min-h-screen">
    <h1>Real-time Messages (nickname:{nickname})</h1>
    <div class="flex-1 bg-gray-200 flex flex-col overflow-y-auto p-2" bind:this={container}>

      {#each messages as item}
        {#if item.type === 'notice'}
          <div class="text-center text-gray-500 text-sm">{item.nickname} 님이 입장하였습니다.</div>
        {:else}
          <div class="m-2">
            {#if !item.my}
              <div class="text-gray-400 text-xs ml-1 mb-1">{item.nickname}</div>
            {/if}

            <div class="flex" class:my-message={item.my}>
              <div class="bg-white rounded-xl py-2 px-4 max-w-[80%] break-words">
                {item.message}
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <div class="h-full flex justify-center items-center">no messages</div>
      {/each}

    </div>

    <div class="p-4">
      <form on:submit|preventDefault={submitMessage}>
        <div class="flex gap-4">
          <div class="hidden">
            <div class="uppercase text-sm text-gray-400">nickname</div>
            <input class="text-lg text-gray-400 p-2 rounded focus:outline-none focus:placeholder-gray-300 placeholder-gray-400"
                   type="text"
                   placeholder="your nickname"
                   readonly
                   bind:value={nickname}>
          </div>
          <div class="flex-1">
            <div class="uppercase text-sm text-gray-400">message</div>
            <div class="flex">
              <input class="text-lg p-2 rounded-l w-full focus:outline-none focus:placeholder-gray-300 placeholder-gray-400" type="text" placeholder="write messages"
                     bind:value={messageText}
                     bind:this={messageInput}>
              <button class="bg-gray-200 px-2 rounded-r">Send</button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </div>

</div>

<style>
  .my-message {
      @apply justify-end;
  }
  .my-message > * {
      @apply bg-blue-600 text-white;
  }
</style>
