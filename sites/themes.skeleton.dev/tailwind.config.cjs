import { skeleton } from "@skeletonlabs/skeleton/plugin";

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: {
				preset: [
					{ name: "next" },
				],
			},
		}),
	]
};

module.exports = config;
