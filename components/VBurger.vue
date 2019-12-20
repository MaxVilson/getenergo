<template>
    <button type="button" class="burger">
        <span></span>
    </button>
</template>

<script>
    export default {
        name: 'burger',
    }
</script>

<style lang="scss" scoped>
    .burger {
        display: inline-block;
        position: relative;
        z-index: 1;
        width: 25px;
        border: none;
        padding: 0;
        line-height: 20px;
        vertical-align: inherit;
        background: transparent;
        user-select: none;
        cursor: pointer;

        > span { 
            display: inline-block;
            position: relative;
            width: 100%;
            height: 4px;
            vertical-align: middle;
            font-size: 0;
            color: transparent;
            background: $white;
            transition: background .3s;

            &:before,
            &:after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 4px;
            background: $white;
            transform-origin: 50% 50%;
            transition: top .3s .3s, transform .3s;
            }

            &:before {
            top: -8px;
            }

            &:after {
            top: 8px;
            }
        }

        // &_close {

        //     > span { 
        //     transition: background .3s 0s;
        //     background: transparent;

        //     &:before,
        //     &:after {
        //         top: 0;
        //         transition: top .3s, transform .3s .3s;
        //     }

        //     &:before {
        //         transform: rotate3d(0, 0, 1, 45deg);
        //     }

        //     &:after {
        //         transform: rotate3d(0, 0, 1, -45deg);
        //     }
        //     }
        // }
    }
</style>