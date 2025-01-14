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
        "favicon",
        "commands"  // 允许插件访问键盘和鼠标
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
    ],
    // 添加 快捷键 配置
    "commands": {
      "show_popup": {
        "suggested_key": {
          "default": "Ctrl+Shift+K",
          "mac": "Command+Shift+K"
        },
        "description": "Toggle feature"
      }
    }
  }
});
