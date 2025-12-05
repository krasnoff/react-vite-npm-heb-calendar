/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { copyFileSync, mkdirSync } from 'node:fs';
import { globSync } from 'glob';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Plugin to copy fonts and README to dist directory
const copyAssetsPlugin = () => {
  return {
    name: 'copy-assets',
    writeBundle() {
      try {
        // Create Fonts directory in existing HebrewCalendar structure
        const distHebCalendarDir = path.resolve(__dirname, 'dist/components/heb-calendar/HebrewCalendar');
        const distFontsDir = path.resolve(distHebCalendarDir, 'Fonts');
        const distAlefDir = path.resolve(distFontsDir, 'Alef');
        
        mkdirSync(distHebCalendarDir, { recursive: true });
        mkdirSync(distFontsDir, { recursive: true });
        mkdirSync(distAlefDir, { recursive: true });
        
        // Copy font files
        const fontFiles = globSync('src/components/heb-calendar/HebrewCalendar/Fonts/Alef/**/*', {
          cwd: __dirname,
          nodir: true
        });
        
        fontFiles.forEach(file => {
          const srcPath = path.resolve(__dirname, file);
          const fileName = path.basename(file);
          const destPath = path.resolve(distAlefDir, fileName);
          copyFileSync(srcPath, destPath);
          console.log(`Copied font: ${fileName}`);
        });

        // Copy README file to dist root
        const readmeSrc = path.resolve(__dirname, 'README.md');
        const readmeDest = path.resolve(__dirname, 'dist/README.md');
        copyFileSync(readmeSrc, readmeDest);
        console.log('Copied README.md to dist directory');
        
      } catch (error) {
        console.error('Error copying assets:', error);
      }
    }
  };
};

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), copyAssetsPlugin()],
  publicDir: false, // Disable automatic copying of public directory
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MyReactLib',          // only used for UMD, but fine to keep
      formats: ['es'],             // 👈 ESM ONLY
      fileName: () => 'index.js',  // output: dist/index.js as ESM
    },
    assetsInlineLimit: (filePath) => {
      // Don't inline font files - keep them as separate files
      if (filePath.endsWith('.ttf') || filePath.endsWith('.woff') || filePath.endsWith('.woff2')) {
        return false;
      }
      return undefined; // Use default behavior (4096 bytes threshold)
    },
    rollupOptions: {
      // don't bundle React – treat as peer dep
      external: ['react', 'react-dom'],
    },
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});