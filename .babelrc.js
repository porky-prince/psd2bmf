module.exports = api => {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: '8.0.0',
					},
				},
			],
		],
	};
};
