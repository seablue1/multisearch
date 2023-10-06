
const maxLength = 10

export async function getHistoryList() {
    var result = await chrome.storage.sync.get("historyList");
    return result.historyList ? result.historyList : []
}

export async function setHistoryList(list) {
    await chrome.storage.sync.set({ 'historyList': list });
}

export async function addHistoryItem(item) {
    var historyList = await getHistoryList()
    if (historyList.length >= maxLength) {
        historyList.pop()
        historyList.unshift(item)
    } else {
        historyList.unshift(item)
    }
    setHistoryList(historyList)
}

export async function getPinList() {
    var result = await chrome.storage.sync.get("pinList");
    return result.pinList ? result.pinList : []
}

export async function setPinList(list) {
    await chrome.storage.sync.set({ 'pinList': list });
}

export async function addPinItem(item) {
    var pinList = await getPinList()
    if (pinList.length >= maxLength) {
        pinList.pop()
        pinList.unshift(item)
    } else {
        pinList.unshift(item)
    }
    setPinList(pinList)
}

export async function removePinItem(item) {
    
    var pinList = await getPinList()
    var removeIndex = 0;
    pinList.forEach((i, index) => {
        if (i.value == item.value) {
            removeIndex = index;
        }
    });
    pinList.splice(removeIndex, 1)
    setPinList(pinList)
}