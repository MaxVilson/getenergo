<template>
    <nuxt-link to="/" class="main-logo">
        <img src="/images/mainLogo.svg" alt="лого">
    </nuxt-link>
</template>

<script>
    export default {
        name: 'main-logo',
    }
</script>

<style lang="scss" scoped>
    .main-logo {
        display: inline-block;
        width: 160px;
        height: 44px;

        & img {
            width: 100%;
            max-width: 100%;
            height: 100%;
        }
    }
</style>
