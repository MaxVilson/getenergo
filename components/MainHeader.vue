<template>
    <header class="main-header">
        <div class="py-2 main-header__wrapper">
            <main-logo/>
            <div class="main-header__menu" @click="show = !show, showBurger = !showBurger">
                <div class="d-inline-flex">
                    <icon-base icon="burger-menu" v-if="showBurger"/>
                    <icon-base icon="menu-close" v-else/>
                </div>
                <button type="button" class="main-header__menu"> Меню </button>
            </div>
        </div>
        <transition-expand>
            <nav class="main-header__nav" v-show="show">
                <div class="container">
                    <ul class="main-header__list">
                        <nuxt-link :to="link.path"
                                   v-for="(link, index) in links"
                                   :key="index">
                            <li class="main-header__item">
                                <v-btn class="main-header__item-btn"
                                       :class="{'main-header__item-btn-active': link.path == active}"
                                       @click="active = link.path"> {{ link.name }}
                                </v-btn>
                            </li>
                        </nuxt-link>
                    </ul>
                </div>
            </nav>
        </transition-expand>
    </header>
</template>

<script>
    import mainLogo from '@/components/MainLogo';
    import VBtn from '@/components/VBtn'
    import TransitionExpand from '@/components/TransitionExpand'

    export default {
        name: 'main-header',
        components: {
            mainLogo,
            VBtn,
            TransitionExpand
        },
        data() {
            return {
                show: false,
                active: undefined,
                showBurger: true,
                links: [
                    { name: 'Каталог', path: '/catalog'},
                    { name: 'Характеристики', path: '/catalog/attrs'},
                    //{ name: 'Производители', path: '/catalog/category/category'},
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-header {
        box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.25);
        background-color: $gray-dark;

        &__wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            padding-right: (30 / 16 + rem);
            padding-left: (30 / 16 + rem);

            @media (min-width: 1920px) {
                padding-right: (146 / 16 + rem);
                padding-left: (120 / 16 + rem);
            }
        }

        &__menu {
            margin-top: 5px;
            padding: 0;
            border: none;
            background-color: transparent;
            vertical-align: top;
            color: $white;
            outline: none;
            cursor: pointer;

            & > div {
                outline: none;
            }
        }

        &__nav {
            width: 100%;
            background: #3E494E;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 0px 0px 8px 8px;
        }

        &__list {
            display: flex;
            flex-wrap: wrap;
            padding-top: 28px;
            padding-bottom: 36px;
            padding-left: 40px;
            margin-bottom: 0;
            list-style: none;

            & > a {
                margin-right: 24px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &__item {

            &-btn {
                padding-top: 10px;
                padding-bottom: 9px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: $white;

                &:hover {
                    background-color: $white;
                    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
                    color: $color-text-dark;
                }

                &-active {
                    background-color: $primary;
                    color: $white;
                }
            }
        }
    }

    .icon-burger-menu {
        fill: $white;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .icon-menu-close {
        width: 32px;
        height: 32px;
    }
</style>
