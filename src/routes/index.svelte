<script lang="ts">
	import {goto} from '$app/navigation';
	import {onMount} from 'svelte';
	import user from "../store/user";

	let loading = true;

	let uid: string
	let nickname: string
	let role: 'tutor' | 'student' = 'student';

	onMount(() => {
		loading = false;
	});

	function signIn() {
		if (!uid || !nickname) {
			alert('required!!!!!!!');
			return;
		}
		user.signIn({uid, nickname, role});
		// TODO qna 바로가기!
		goto('/qna');
	}
</script>

<svelte:head>
	<title>KIRD Live-K</title>
</svelte:head>

{#if loading}
	<div>Connecting to Live-K...</div>
{:else}


	<div class="grid place-content-center h-screen bg-gray-300">
		<h1 class="text-center text-3xl font-bold mb-8">KIRD Live-K</h1>
		<div class="bg-gray-100 rounded-xl p-16 pt-8 shadow-xl w-[500px]">

			{#if !$user.isSignIn}
				<h2 class="uppercase text-center text-2xl font-bold mb-12">sign in</h2>
				<div class="flex flex-col gap-4">
					<div class="mb-4">
						<div class="mb-1 uppercase text-sm text-gray-400">id</div>
						<input class="text-lg p-2 rounded focus:outline-none focus:placeholder-gray-300 placeholder-gray-400 w-full" type="text" placeholder="your id"
									 bind:value={uid}>
					</div>
					<div class="mb-4">
						<div class="mb-1 uppercase text-sm text-gray-400">nickname</div>
						<input class="text-lg p-2 rounded focus:outline-none focus:placeholder-gray-300 placeholder-gray-400 w-full" type="text" placeholder="your nickname"
									 bind:value={nickname}>
					</div>
<!--					<div class="mb-4">-->
<!--						<div class="mb-1 uppercase text-sm text-gray-400">role</div>-->
<!--						<div>-->
<!--							<label>-->
<!--								<input type="radio" value="student" bind:group={role}> student-->
<!--							</label>-->
<!--							<label>-->
<!--								<input type="radio" value="tutor" bind:group={role}> tutor-->
<!--							</label>-->
<!--						</div>-->
<!--					</div>-->
				</div>
				<div class="text-center">
					<button class="uppercase bg-blue-500 rounded-lg text-xl text-white p-4 py-2 mt-8" on:click={signIn}>sign in</button>
				</div>
			{:else}
				<ul>
					<li>uid: {$user.user.uid}</li>
					<li>nickname: {$user.user.nickname}</li>
					<li>role: {$user.user.role}</li>
				</ul>
				<nav>
					<ul>
						<li><a href="/qna">Q&A</a></li>
						<li>Quiz</li>
						<li>Poll</li>
						<li>Share</li>
					</ul>
				</nav>
			{/if}
		</div>
	</div>
{/if}
