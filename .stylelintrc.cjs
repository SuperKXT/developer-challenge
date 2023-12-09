/** @type {import('stylelint').Config} */
const config = {
	extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
	rules: {
		'declaration-block-no-redundant-longhand-properties': null,
		'no-descending-specificity': null,
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global'],
			},
		],
	},
};

module.exports = config;
