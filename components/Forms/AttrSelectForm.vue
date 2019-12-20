<template>
    <div class="modal-add-characteristic">
        <div class="modal-add-characteristic__wrapper">
            <div class="modal-add-characteristic__row">
                <div class="modal-add-characteristic__title">Добавить характеристику</div>
                <!-- <button type="button"
                        class="modal-add-characteristic__close ml-auto"
                        @click="$modal.hide('add-characteristic')">
                            <icon-base icon="close"/>
                </button> -->
            </div>
            <input-origin class="modal-add-characteristic__input" type="text" placeholder="Введите название характеристики"
                v-model="search"
                @input="onSearch">
                <icon-base icon="search"/>
            </input-origin>
            <ul class="modal-add-characteristic__list">
                <li v-for="attr in attrs" :key="attr.attr_id"
                    class="modal-add-characteristic__item"
                    :class="{ 'modal-add-characteristic__item_active': selected.findIndex(item => item.attr_id == attr.attr_id) !== -1 }"
                    @click="toggleAttr(attr), save = true">
                    {{ attr.name }}
                    <icon-base icon="check"/>
                </li>
            </ul>
            <div class="modal-add-characteristic__footer d-flex justify-content-center">
                <v-btn class="btn_disable btn_gray-light btn_md btn_height-md"
                    :class="{ 'btn_active': save == true }"
                    @click.prevent="$emit('input', selected)">Добавить
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'throttle-debounce'
import InputOrigin from '@/components/InputOrigin';
import VBtn from '@/components/VBtn';

export default {
    components: {
        InputOrigin,
        VBtn
    },
    data() {
        return {
            selected: this.value.slice(),
            search: '',
            save: false
        }
    },
    computed: {
        ...mapGetters({
            attrs: 'attrs/getAttrs',
        }),
        debounceSearch: function() {
            return debounce(500, this.filter)
        }
    },
    props: {
        value: { type: Array, default: () => [] },
    },
    methods: {
        ...mapActions('attrs', {
            getAttrs: 'getAttrs',
        }),
        toggleAttr(attr) {
            const index = this.selected.findIndex(item => item.attr_id == attr.attr_id)
            if (index === -1) {
                this.selected.push({
                    attr_id: attr.attr_id,
                    required: 0,
                    name: attr.name
                })
            } else {
                if (!this.selected[index].required) {
                    this.selected.splice(index, 1)
                }
            }
        },
        async filter() {
            await this.getAttrs({ page: 1, limit: 8, query: this.search })
        },
        onSearch() {
            return this.debounceSearch()
        },
    }
}
</script>

<style lang="scss" scoped>
    .modal-add-characteristic {
        width: 500px;
        height: auto;

        &__wrapper {
            padding: 28px;
        }

        &__row {
            position: relative;
            display: flex;
            margin-bottom: 28px;
        }

        &__title {
            font-size: (20 / 16 + rem);
            font-weight: 700;
            line-height: (23 / 16 + rem);
            color: $black;
        }

        &__close {
            position: absolute;
            top: -10px;
            right: 0;
            padding: 0;
            border: none;
            background-color: transparent;

            & svg {
                width: 22px;
                height: 22px;
            }
        }

        &__input {
            margin-bottom: 8px;
        }

        &__list {
            margin-bottom: 0;
            padding-left: 0;
            list-style: none;
        }

        &__item {
            position: relative;
            padding: 18px 16px;
            line-height: (20 / 16 + rem);
            border: 1px solid $border-color;
            border-bottom: none;
            color: $black;
            cursor: pointer;

            &:hover {
                background-color: $blue-light;
                transition: all .3s;
            }

            &:last-child {
                border-bottom: 1px solid $border-color;
            }

            & svg {
                position: absolute;
                top: 50%;
                right: 24px;
                display: none;
                width: 12px;
                height: 12px;
                fill: #27AE60;
            }

            &_active {
                & svg {
                    display: block;
                }
            }
        }

        &__footer {
            margin-top: 24px;
        }
    }

    // Через пропсы высота не передается, делаем ее auto здесь
    .v--modal-box {
        height: auto !important;
    }
</style>
