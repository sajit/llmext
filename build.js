const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: {
      background: './background.js',
      popup: './src/popup.js',
    },
    bundle: true,
    outdir: './dist',
    platform: 'browser', // Optimized for Chrome extensions
    target: 'es2020',
    format: 'esm', // Outputs ES modules,
    //external: ["@langchain/core", "@langchain/ollama"],
  })
  .then(() => console.log('Build complete'))
  .catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
  });

