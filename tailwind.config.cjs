const iOSHeight = require('@rvxlab/tailwind-plugin-ios-full-height');

module.exports = {
	mode: "jit",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		iOSHeight,
	],
};
