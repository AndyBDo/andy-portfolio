import {defineConfig} from '@playwright/test';
export default defineConfig({testMatch:'**/*.spec.js',timeout:90000,use:{channel:'chrome'},webServer:{command:'npm run dev',url:'http://localhost:5173',reuseExistingServer:true}});
