<template>
    <div id="multisearch-container" ref="multisearchContainer">
        <div v-show="show">
            <template v-for="item in list">
                <div class="anchor" v-for="ele in item.elementList" :style="getStripeStyle(item.color, ele)"
                    @click="clickAnchor(ele, item)">
                </div>
            </template>


            <el-row>
                <el-col>
                    <div style="width: 100%;">
                        <el-dropdown style="width: 100%;" trigger="click" :teleported="false">
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in historyList" @click="search(item.value, item.color)">
                                        <div
                                            style="width: 100%; display: flex;justify-content:space-between;align-items:center;">
                                            <el-text truncated>{{ item.value }}</el-text>
                                            <div style="width:10px;height:10px;border-radius:50%;"
                                                :style="'background-color:#' + item.color" />
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>

                            <div style="position: relative;">
                                <div style="position: absolute; left: -25px;top: 30px;">
                                    <el-icon style="cursor:pointer;" @click="showHistoryList()" class="el-dropdown-link">
                                        <ArrowDown />
                                    </el-icon>
                                </div>

                            </div>


                        </el-dropdown>

                        <el-input v-model="input" style="width: 100%;" size="large" ref="searchPannel"
                            @keydown="inputKeyDown">
                            <template #append>
                                <el-button :icon="Search" @click="search(input)" />
                            </template>
                        </el-input>

                    </div>
                </el-col>
            </el-row>

            <el-row v-for="item in list">
                <div style="position: relative;" v-show="item.pinned ? true : item.isHover" @mouseenter="textEnter(item)"
                    @mouseleave="textLeave(item)">
                    <div style="position: absolute; left: -25px;top: 15px;" @click="pinItem(item)">
                        <svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path :fill="item.pinned ? '#1677ff' : ''"
                                d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3a33.23 33.23 0 00-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 00-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8zM666.2 549.3l-24.5 24.5 3.8 34.4a259.92 259.92 0 01-30.4 153.9L262 408.8c12.9-7.1 26.3-13.1 40.3-17.9 27.2-9.4 55.7-14.1 84.7-14.1 9.6 0 19.3.5 28.9 1.6l34.4 3.8 24.5-24.5L608.5 224 800 415.5 666.2 549.3z" />
                        </svg>
                    </div>
                </div>
                <el-text style="flex-grow: 1;" truncated @mouseenter="textEnter(item)" @mouseleave="textLeave(item)">{{
                    item.value }}</el-text>
                <el-button-group>
                    <el-button :icon="Close" @click="unMark(item)" />
                    <el-button @click="changePosi(item, 0)">
                        {{ item.posi }}/{{ item.elementList.length }}
                    </el-button>
                    <!-- <el-button :icon="Aim" @click="changePosi(item, 0)">
                    </el-button> -->
                    <el-button :icon="ArrowUp" @click="changePosi(item, -1)" />
                    <el-button :icon="ArrowDown" @click="changePosi(item, 1)" />
                </el-button-group>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import Mark from 'mark.js';
import { Search, Close, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { getHistoryList, addHistoryItem, getPinList, addPinItem, removePinItem } from '../storage'



var multisearchContainer = ref()
var searchPannel = ref()
var show = ref(true)
onMounted(() => {
    searchPannel.value.focus()
})
defineExpose({
    swichPannel: () => {
        show.value = !show.value
        if (show.value) {
            searchPannel.value.focus()
        } else {
            searchPannel.value.blur()
        }
    }
})

var input = ref()
var list = ref([])
var pinList = ref([])
onMounted(async () => {
    pinList.value = await getPinList()
    pinList.value.forEach(pin => {
        search(pin.value, pin.color, true)
    })
})

var clickAnchor = (ele, item) => {

    ele.scrollIntoView({ block: 'center' });
    for (const i in item.elementList) {
        if (item.elementList[i] == ele) {
            changePosi(item, parseInt(i) + 1 - item.posi) // 神坑
            break
        }
    }
}

var changePosi = (item, offset) => {

    var posi = item.posi + offset
    if (item.elementList.length > posi - 1 && posi - 1 >= 0) {
        item.elementList[item.posi - 1].setAttribute('style', "background-color:#" + item.color);

        item.posi += offset;
        item.elementList[item.posi - 1].scrollIntoView({ block: 'center' })
        item.elementList[item.posi - 1].setAttribute('style', "background-color:#" + 'ff9632');
    }
}

var pinItem = (item) => {
    item.pinned = !item.pinned

    if (item.pinned) {
        addPinItem({ value: item.value, color: item.color })
    } else {
        removePinItem(item)
    }

}

var inputKeyDown = (e) => {
    if (e.key == 'Enter') {
        search()
    }
}

var search = (markStr, color, pinned) => {
    if (markStr == null) {
        markStr = input.value
        input.value = null
    }
    if (color == null) {
        color = generateColor()
    }

    if (markStr != null && markStr != "") {
        var instance = new Mark("body");
        var item = {
            color,
            value: markStr,
            className: "powermark-" + color,
            elementList: [],
            posi: 0,
            pinned
        }

        instance.mark(
            markStr,
            {
                each: (ele) => {
                    ele.setAttribute('style', "background-color:#" + item.color);
                    item.elementList.push(ele)
                },
                className: item.className,
                filter: (node) => {
                    return !multisearchContainer.value.contains(node)
                },
                separateWordSearch: false,
                acrossElements: true
            }
        );

        if (item.elementList.length != 0) {
            
            item.elementList.sort((a, b) => (window.scrollY + a.getBoundingClientRect().top) - (window.scrollY + b.getBoundingClientRect().top))

            var nearLeast = 0;
            var dist = item.elementList[0].getBoundingClientRect().top
            item.elementList.forEach((e, i) => {
                if (Math.abs(e.getBoundingClientRect().top) < Math.abs(dist)) {
                    dist = Math.abs(e.getBoundingClientRect().top)
                    nearLeast = i
                }
            })
            item.posi = nearLeast + 1
        }

        addHistoryItem({ value: item.value, color: item.color })
        list.value.push(item)
    }
}
var unMark = (item) => {
    var instance = new Mark("body");
    instance.unmark({ className: item.className })
    list.value = list.value.filter(e => {
        return e.className != item.className
    })
}



const defaultColorList = ['01f7f7', '00f700', 'ffff00', '1eead7']
function generateColor() {
    for (const color of defaultColorList) {
        var found = false
        for (const item of list.value) {
            if (item.color === color) {
                found = true
                break
            }
        }
        if (!found) {
            return color
        }
    }

    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

var getStripeStyle = (color, ele) => {
    var blackground = 'background-color:#' + color + ';';
    var toTop = window.scrollY + ele.getBoundingClientRect().top
    var topPercent = toTop > 0 ? toTop / document.body.scrollHeight : 0;
    var top = 'top:' + topPercent * 100 + '%'
    return blackground + top
}



var historyList = ref()
var showHistoryList = async () => {
    historyList.value = await getHistoryList()
}

var lastTimmer;
var textEnter = (item) => {
    if (lastTimmer) {
        clearTimeout(lastTimmer)
        lastTimmer = undefined
    }
    list.value.forEach(i => {
        i.isHover = false
    })
    item.isHover = true
}
var textLeave = (item) => {
    lastTimmer = setTimeout(() => {
        item.isHover = false
    }, 500)
}

</script>

<style scoped>
#multisearch-container {
    z-index: 1000;
    position: fixed;
    right: 15px;
    top: 100px;
    width: 400px;
}

.anchor {
    z-index: 1000;
    position: fixed;
    right: 0;
    width: 15px;
    height: 5px;
    background-color: #ffc107;
    cursor: pointer
}
</style>