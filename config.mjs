import { context } from 'esbuild';
import { BitburnerPlugin } from 'esbuild-bitburner-plugin';

let ctx = null;
let isShuttingDown = false;
let restartCount = 0;
const MAX_RESTART_ATTEMPTS = 10;
const RESTART_DELAY_MS = 2000;

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

const startWatching = async () => {
  try {
    if (ctx) {
      console.log('Disposing previous context...');
      await ctx.dispose().catch(err => {
        console.warn('Warning: Error disposing context:', err.message);
      });
    }

    ctx = await createContext();
    console.log('✓ File watcher context created');

    // Start watching with error handling
    await ctx.watch();
    console.log('✓ File watcher started successfully');
    restartCount = 0; // Reset restart count on success
  } catch (error) {
    console.error('✗ File watcher error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    if (!isShuttingDown) {
      restartCount++;
      if (restartCount <= MAX_RESTART_ATTEMPTS) {
        const delay = RESTART_DELAY_MS * Math.min(restartCount, 5); // Exponential backoff, max 10s
        console.log(`⚠ Attempting to restart file watcher (${restartCount}/${MAX_RESTART_ATTEMPTS}) in ${delay}ms...`);
        setTimeout(() => {
          if (!isShuttingDown) {
            startWatching().catch(err => {
              console.error('✗ Failed to restart watcher:', err);
              if (restartCount >= MAX_RESTART_ATTEMPTS) {
                console.error('✗ Max restart attempts reached. Exiting.');
                process.exit(1);
              }
            });
          }
        }, delay);
      } else {
        console.error('✗ Max restart attempts reached. Exiting.');
        process.exit(1);
      }
    }
  }
};

// Handle process termination gracefully
const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\nReceived ${signal}. Shutting down file watcher...`);
  try {
    if (ctx) {
      await ctx.dispose();
    }
    console.log('✓ File watcher shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught exceptions (but allow restart)
process.on('uncaughtException', async (error) => {
  console.error('✗ Uncaught exception:', error);
  console.error('Stack:', error.stack);
  
  if (!isShuttingDown) {
    // Try to restart instead of immediately exiting
    if (ctx) {
      try {
        await ctx.dispose();
      } catch (e) {
        console.warn('Warning: Error disposing context during exception:', e.message);
      }
      ctx = null;
    }
    
    restartCount++;
    if (restartCount <= MAX_RESTART_ATTEMPTS) {
      const delay = RESTART_DELAY_MS * Math.min(restartCount, 5);
      console.log(`⚠ Attempting to restart after exception (${restartCount}/${MAX_RESTART_ATTEMPTS}) in ${delay}ms...`);
      setTimeout(() => {
        if (!isShuttingDown) {
          startWatching();
        }
      }, delay);
    } else {
      console.error('✗ Max restart attempts reached after exception. Exiting.');
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('✗ Unhandled rejection at:', promise);
  console.error('Reason:', reason);
  
  if (!isShuttingDown) {
    // Try to restart instead of immediately exiting
    if (ctx) {
      try {
        await ctx.dispose();
      } catch (e) {
        console.warn('Warning: Error disposing context during rejection:', e.message);
      }
      ctx = null;
    }
    
    restartCount++;
    if (restartCount <= MAX_RESTART_ATTEMPTS) {
      const delay = RESTART_DELAY_MS * Math.min(restartCount, 5);
      console.log(`⚠ Attempting to restart after rejection (${restartCount}/${MAX_RESTART_ATTEMPTS}) in ${delay}ms...`);
      setTimeout(() => {
        if (!isShuttingDown) {
          startWatching();
        }
      }, delay);
    } else {
      console.error('✗ Max restart attempts reached after rejection. Exiting.');
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});

// Start watching
startWatching();