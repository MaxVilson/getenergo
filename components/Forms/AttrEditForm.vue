<template>
    <div class="modal-edit-characteristic">
        <input-base :value="value.attr_id"
            readonly
            class="category__control input-base_readonly-white"
            id="input-id"
            label="ID">
            <template v-slot:icon-right>
                <icon-base icon="lock" />
            </template>
        </input-base>

        <v-multiselect :value="value.field"
            @input="update('field', $event)"
            class="category__control"
            :options="types"
            label="text"
            :searchable="false"
            :allow-empty="false"
            placeholder=""
            innerText="Выберите тип поля"
            :validator="$v.value.field"/>

        <input-textarea :value="value.description"
            @input="update('description', $event)"
            class="category__control"
            id="input-description"
            placeholder="Напряжение, В — ..."/>

        <v-multiselect :value="value.filter"
            @input="update('filter', $event)"
            class="category__control"
            :options="types"
            label="text"
            :searchable="false"
            :allow-empty="false"
            placeholder=""
            innerText="Выберите тип фильтра"
            :validator="$v.value.filter"/>
        <template v-if="categories.length">
            <div class="modal-edit-characteristic__subtitle">Используется в {{ categories.length == 1 ? '1 категории' : categories.length + ' категориях' }}:</div>
            <ul class="modal-edit-characteristic__list">
                <li class="modal-edit-characteristic__list-item" v-for="category in categories" :key="category.category_id">
                    <a href="#" class="modal-edit-characteristic__list-link">{{ category.name }}</a>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import VBtn from '@/components/VBtn'
import InputBase from '@/components/InputBase'
import VMultiselect from '@/components/VMultiselect'
import InputTextarea from '@/components/InputTextarea'
import InputOrigin from '@/components/InputOrigin'
import { required, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
    components: {
        VMultiselect,
        InputBase,
        InputTextarea,
        VBtn,
        InputOrigin
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    id: '',
                    type: '',
                    description: '',
                    field: '',
                }
            }
        },
        categories: { type: Array, default: () => { return [] } }
    },
    mixins: [
        validationMixin,
    ],
    validations() {
        return {
            value: {
                field: {
                    required,
                },
                filter: {
                    required,
                },
            }
        }
    },
    computed: {
        data: {
            get() {
                return this.form
            },
            set(value) {
                console.log(value)
            }
        }
    },
    data() {
        return {
            types: [
                { name: 'checkbox', text: 'Чекбокс' },
                { name: 'slider', text: 'Слайдер' },
                { name: 'radio', text: 'Радио' },
                { name: 'empty', text: 'Без фильтра' },
            ],
        }
    },
    methods: {
        update(key, value) {
            this.$emit('input', { ...this.value, [key]: value })
        },
    }
}
</script>

<style lang="scss">
    .modal-edit-characteristic {
        padding: 20px 40px;
        border-radius: 6px;

        &__top-line {
            position: relative;

            &-input {
                width: 428px;

                & .input-origin__input {
                    padding-right: 80px;
                }
            }
        }

        &__title {
            display: inline-block;
            margin-bottom: 20px;
            max-width: 428px;
            font-size: (20 / 16 + rem);
            font-weight: 500;
            line-height: (27 / 16 + rem);
            vertical-align: top;
            cursor: pointer;

            & .icon {
                margin-right: 3px;
            }
        }

        &__close {
            position: absolute;
            top: 0;
            right: -12px;
            padding: 0;
            border: none;
            background-color: transparent;

            & .icon {
                width: 20px;
                height: 20px;
            }
        }

        &__input-save {
            position: absolute;
            top: 50%;
            right: 10px;
            border: none;
            background-color: transparent;
            font-size: (12 / 16 + rem);
            color: $primary;
            transform: translateY(-50%);
        }

        &__subtitle {
            margin-bottom: 12px;
            font-weight: 500;
            color: $black;
        }

        &__list {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 16px;
            padding-left: 0;
            list-style: none;

            &-item {
                margin-right: 8px;
                margin-bottom: 8px;
            }

            &-link {
                display: inline-block;
                padding: 8px 12px;
                border-radius: 16px;
                background-color: $blue-light;
                font-size: (14 / 16 + rem);
                text-decoration: none;
                color: $color-main;
                transition: all .15s;

                &:hover {
                    background-color: $primary;
                    text-decoration: none;
                    color: $white;
                }
            }
        }
    }

    .icon-lock {
        position: absolute;
        top: 50%;
        right: 20px;
        width: 11px;
        height: 11px;
        transform: translateY(-50%);
        opacity: 0.5;
    }
</style>
