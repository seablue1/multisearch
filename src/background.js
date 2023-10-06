'use strict';

// This callback WILL NOT be called for "_execute_action"
chrome.commands.onCommand.addListener(async (command) => {
  if (command == "showPanel") {
    var [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tab.id, {
      type: 'showPanel',
    }).catch(e=>{
      console.log("not support for this page");
    })
  }
});