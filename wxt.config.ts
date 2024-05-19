import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    "permissions": [
        "tabs",
        "bookmarks",
        "storage",
        "scripting",
        "activeTab",
        "actions",
        "favicon"
    ],
    "action": {
      "default_popup": "popup.html"
    },
    "web_accessible_resources": [
      {
        "resources": ["_favicon/*"],
        "matches": ["<all_urls>"],
        "extension_ids": ["*"]
      }
    ]
  }
});
