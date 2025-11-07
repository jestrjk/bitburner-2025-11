import { context } from 'esbuild';
import { BitburnerPlugin } from 'esbuild-bitburner-plugin';

const createContext = async () => await context({
  entryPoints: [
    //'servers/**/*.js',
    //'servers/**/*.jsx',
    'servers/**/*.ts',
    'servers/**/*.tsx',
  ],
  outbase: "./servers",
  outdir: "./build",
  plugins: [
    BitburnerPlugin({
      port: 12525,
      types: 'NetscriptDefinitions.d.ts',
      mirror: {
      },
      distribute: {
      },
    })
  ],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  logLevel: 'debug',
});

const ctx = await createContext();

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.log('\nShutting down file watcher...');
  await ctx.dispose();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down file watcher...');
  await ctx.dispose();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('✗ Uncaught exception:', error);
  await ctx.dispose();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('✗ Unhandled rejection at:', promise, 'reason:', reason);
  await ctx.dispose();
  process.exit(1);
});

// Start watching
try {
  ctx.watch().then(() => {
    console.log('✓ File watcher started successfully');
  }).catch((error) => {
    console.error('✗ File watcher error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('✗ Failed to start file watcher:', error);
  process.exit(1);
}