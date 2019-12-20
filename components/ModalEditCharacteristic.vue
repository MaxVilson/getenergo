<template>
    <modal name="edit-characteristic" height="auto" :width="524"  :scrollable="true">
        <div class="modal-edit-characteristic">
            <div class="modal-edit-characteristic__top-line">
                <input-origin v-model="characteristicName" v-if="showInput" type="text" placeholder="Название" class="modal-edit-characteristic__top-line-input category__control">
                    <button @click="showInput = !showInput" type="button" class="modal-edit-characteristic__input-save">Сохранить</button>
                </input-origin>
                <div v-else @click="showInput = !showInput" class="modal-edit-characteristic__title">
                    <icon-base icon="pencil"/>
                    {{ characteristicName }}
                </div>
                <button type="button" class="modal-edit-characteristic__close" @click="$modal.hide('edit-characteristic')">
                    <icon-base icon="close"/>
                </button>
            </div>

            <input-base
                class="category__control"
                id="input-id"
                label="ID">
                <template v-slot:icon-right>
                    <icon-base icon="lock" />
                </template>
            </input-base>

            <v-multiselect
                class="category__control"
                :options="types"
                label="text"
                :searchable="false"
                :allow-empty="false"
                placeholder=""
                innerText="Выберите тип поля"/>

            <input-textarea
                class="category__control"
                id="input-description"
                placeholder="Напряжение, В — ..."/>

            <v-multiselect
                class="category__control"
                :options="typesFilter"
                label="text"
                :searchable="false"
                :allow-empty="false"
                placeholder=""
                innerText="Выберите тип фильтра"/>

            <div class="modal-edit-characteristic__subtitle">Используется в 8 категориях:</div>
            <ul class="modal-edit-characteristic__list">
                <li class="modal-edit-characteristic__list-item" v-for="(item, i) in list" :key="i">
                    <a href="#" class="modal-edit-characteristic__list-link">{{ item }}</a>
                </li>
            </ul>

            <v-btn
                class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                type="submit">Сохранить</v-btn>

        </div>
    </modal>
</template>

<script>
    import VBtn from '@/components/VBtn'
    import InputBase from '@/components/InputBase'
    import VMultiselect from '@/components/VMultiselect'
    import InputTextarea from '@/components/InputTextarea'
    import InputOrigin from '@/components/InputOrigin'

    export default {
        name: 'modal-edit-characteristic',
        components: {
            VMultiselect,
            InputBase,
            InputTextarea,
            VBtn,
            InputOrigin
        },
        data() {
            return {
                showInput: false,
                characteristicName: 'Название характеристики',
                types: [
                    { name: 'type1', text: 'Выпадающий список с поиском' },
                    { name: 'type2', text: 'Текст' },
                    { name: 'type3', text: 'Дропдаун с поисковой строкой' },
                    { name: 'type4', text: 'Без фильтра' },
                ],
                typesFilter: [
                    { name: 'checkbox', text: 'Чекбокс' },
                    { name: 'slider', text: 'Слайдер' },
                    { name: 'radio', text: 'Радио' },
                    { name: 'empty', text: 'Без фильтра' },
                ],
                list: ['Комплект промежуточной подвески', 'Спиральные вязки', 'Термоусаживающие и изоляционные материалы', 'Выключатели пуска двигателя', 'Разветвитель', 'Резисторы', 'Счетчики коммерческого учета', 'Токоограничивающие патроны']
            }
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
