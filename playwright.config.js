import {defineConfig} from '@playwright/test';
const port=5180;
export default defineConfig({testMatch:'**/*.spec.js',timeout:90000,use:{channel:'chrome',baseURL:`http://localhost:${port}`},webServer:{command:`npm run dev -- --port ${port} --strictPort`,url:`http://localhost:${port}`,reuseExistingServer:!process.env.CI}});
