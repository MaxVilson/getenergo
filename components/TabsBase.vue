<template>
    <div>
        <ul class="nav nav-tabs d-flex">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
                <button type="button"
                    class="nav-link"
                    @click.prevent="current = index"
                    :class="{ active: current == index }">{{ tab }}</button>
            </li>
        </ul>
        <div class="tab-content">
            <div v-for="(_, slot) of $scopedSlots" :key="slot"
                class="tab-pane"
                :class="{ active: current == slot }">
                <slot :name="slot"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabs: { type: Object, default: () => { return {} } },
        active: { type: String, default: '' },
    },
    data() {
        return {
            current: this.active ? this.active : (Object.entries(this.tabs).length ? Object.keys(this.tabs)[0] : '')
        }
    }
}
</script>

<style lang="scss" scoped>
    .nav-tabs {
        padding-right: (40 / 16 + rem);
        padding-left: (40 / 16 + rem);
    }
    .nav-item {
        margin-right: (10 / 16 + rem);

        &:last-child {
            margin-right: 0;
        }
    }

    .nav-link {
        font-size: (14 / 16 + rem);
        border: none;
        background-color: transparent;
        outline: none;
    }

    .tab-pane {
        width: 100%;
    }

    .tab-content {
        margin-top: 24px;
    }

</style>
