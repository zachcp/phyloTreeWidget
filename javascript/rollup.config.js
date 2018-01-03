import multiEntry from 'rollup-plugin-multi-entry';

export default [
	// browser-friendly UMD build
	{
        //input: 'src/phyloTree.js',
        input: ['src/phyloTree.js',
                'src/drawTree.js',
                'src/updateTree.js',
                'src/zoom.js',
                'src/labels.js'],
        plugins: [multiEntry()],
		output: {
            name: 'phyloTree',
			file: "../inst/htmlwidgets/lib/phylotree/phylotree.js",
			format: 'umd'
        }
    },
];
