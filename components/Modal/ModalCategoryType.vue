<template>
    <modal name="category-type" height="auto" :width="500" :scrollable="true">
        <div class="modal-category-type">
            <div class="modal-category-type__wrapper">
                <div class="d-flex modal-category-type__top-line">
                    <div class="modal-category-type__title">Выберите уровень категории</div>
                    <button type="button"
                            class="modal-category-type__close ml-auto"
                            @click="$modal.hide('category-type')">
                                <icon-base icon="close"/>
                    </button>
                </div>
                <div class="modal-category-type__btns">
                    <v-btn class="btn_transparent modal-category-type__btn"
                           v-for="(btn, index) in buttons"
                           :key="index"
                           :class="{'modal-category-type__btn_active': index == active}"
                           @click="active = index, path = btn.href">
                                {{ btn.name }}
                    </v-btn>
                </div>
                <div class="d-flex justify-content-center">
                    <v-btn class="btn_disable btn_gray-light btn_md btn_height-md modal-category-type__btn-create"
                           :href="path"
                           :class="{ 'modal-category-type__btn-create_active': path != undefined }">Создать
                    </v-btn>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import VBtn from '@/components/VBtn';

    export default {
        name: 'modal-category-type',
        components: {
            VBtn
        },
        data() {
            return {
                buttons: [
                    { name: 'Группа категорий', href: 'http://admin.holypony.ru/catalog/category/create/root'},
                    { name: 'Категория', href: 'http://admin.holypony.ru/catalog/category/create/child'},
                    { name: 'Подкатегория', href: 'http://admin.holypony.ru/catalog/category/create/subchild'},
                ],
                path: undefined,
                active: undefined
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-category-type {
        position: relative;

        &__wrapper {
            padding: 28px;
        }

        &__top-line {
            margin-bottom: 20px;
        }

        &__title {
            font-size: (20 / 16 + rem);
            font-weight: 700;
        }

        &__close {
            position: absolute;
            top: 17px;
            right: 10px;
            border: none;
            background-color: transparent;

            & .icon {
                width: 24px;
                height: 24px;
            }
        }

        &__btn {
            padding-top: (20 / 16 + rem);
            padding-bottom: (20 / 16 + rem);
            margin-bottom: (12 / 16 + rem);
            width: 100%;
            border-radius: 8px;
            font-weight: 500;
            transition: all .15s;

            &:hover {
                border: 1px solid #A3D8FF;
                background-color: $blue-light;
                transition: all .15s;
            }

            &:active {
                border: 1px solid #27AE60;
                color: #27AE60;
            }

            &_active {
                border: 1px solid #27AE60;
                color: #27AE60;

                &:hover {
                    border: 1px solid #27AE60;
                    color: #27AE60;
                    background-color: transparent;
                }
            }

            &-create {
                margin-top: 8px;

                &_active {
                    background-color: $primary;
                    color: $white;
                    cursor: pointer;
                }
            }
        }
    }
</style>
