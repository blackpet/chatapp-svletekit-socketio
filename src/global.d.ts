/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

type User = {
  uid: string;
  nickname: string;
  role: 'tutor' | 'student';
}

interface ImportMetaEnv {
  VITE_SERVER_PATH: string;
}
