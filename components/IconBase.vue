<template>
    <svg class="icon"
         :class="iconClass">
        <use :xlink:href="iconHref"></use>
    </svg>
</template>

<script>
export default {
    name: 'base-icon',
    computed: {
        iconClass: function () {
            return 'icon-' + this.icon
        },
        iconHref: function () {
            return '/images/symbol-defs.svg#' + this.iconClass
        }
    },
    props: {
        icon: {
            type: String,
            default: '',
            required: true
        },
    }
}
</script>

<style lang="scss">
.icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
}
</style>