<template>
    <div class="d-flex align-items-center form-group-title" :title="title" @click="$emit('click')">
        <span>{{ title }}</span>
        <icon-base class="ml-auto" icon="dropdown"/>
    </div>
</template>

<script>
    export default {
        name: 'form-group-title',
        props: {
            title: { type: String },
        }
    }
</script>

<style lang="scss" scoped>
    .form-group-title {
        padding-bottom: (18 / 16 + rem);
        cursor: pointer;

        & span {
            font-size: (20 / 16 + rem);
            font-weight: 500;
            line-height: 23px;
        }

        & .icon {
            width: 12px;
            height: 12px;
        }
    }
</style>