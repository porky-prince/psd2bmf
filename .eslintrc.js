module.exports = {
	extends: ['xo', 'prettier'],
	env: {
		node: true,
		es6: true,
		jest: true,
	},
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'no-multi-assign': 'off',
		'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
		'max-params': 'off',
	},
};
