'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
import { createApp } from 'vue'


var pvue;

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showPanel') {
    if (pvue) {
      pvue.swichPannel()
    } else {
      var node = document.createElement("div")
      document.body.appendChild(node)
      pvue = createApp(require("./content/content.vue").default).mount(node)
    }
  }
  sendResponse({});
  return true;
});
