module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', "plugin:tailwindcss/recommended"],
	plugins: ['@typescript-eslint', 'tailwindcss'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
		  files: ['*.svelte'],
		  parser: 'svelte-eslint-parser',
		  parserOptions: {
			parser: '@typescript-eslint/parser',
		  },
		  env: { browser: true, node: false },
		  rules: {
			'no-inner-declarations': 'off',
			'no-self-assign': 'off',
		  },
		},
		{
		  files: ['src/**/*.ts', 'src/**/*.js'],
		  env: { browser: true, node: false },
		},
	  ],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	// rules: {
	// 	"tailwindcss/classnames-order": "warn",
	// 	"tailwindcss/enforces-negative-arbitrary-values": "warn",
	// 	"tailwindcss/enforces-shorthand": "warn",
	// 	"tailwindcss/migration-from-tailwind-2": "warn",
	// 	"tailwindcss/no-arbitrary-value": "off",
	// 	"tailwindcss/no-custom-classname": "warn",
	// 	"tailwindcss/no-contradicting-classname": "error"
	// }
};
