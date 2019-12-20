<template>
    <div class="head-line">
        <div class="container">
            <div class="head-line__wrapper">
                <div @click="$router.back()">   
                    <v-btn class="btn_sm btn_disable btn_disable-color-gray btn_arrow head-line__btn" href="#">
                        <icon-base icon="arrow-left-dis" />
                        Назад
                    </v-btn>
                </div>
                <!-- </nuxt-link> -->
                <h1 class="head-line__title" :title="title"> {{ title }} </h1>
            </div>
        </div>    
    </div>
</template>

<script>
    import VBtn from '@/components/VBtn';
    export default {
        name: 'head-line',
        props: {
            title: { type: String, default: 'Создание группы категорий' },
        },
        components: {
            VBtn,
        }
    }
</script>

<style lang="scss" scoped>
    .head-line {

        &__wrapper {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding-top: 40px;
            padding-bottom: 40px;
        }

        &__title {
            margin-bottom: 0;
            margin-left: 20px;
            font-weight: 500;
        }
    }

    .btn {
        cursor: pointer;
    }
</style>