<template>
    <div>
        <modal-add-characteristic :value="attrs" @input="attrs = $event.slice()"/>
        <tabs-base :tabs="tabs">
            <template v-slot:common>
                <div class="popup-form-group">
                    <div class="block-category-group mb-3">
                        <div class="block-category-group__row">
                            <span class="block-category-group__title">Группа категорий:</span>
                            <span class="block-category-group__text">Кабель и провод</span>
                        </div>
                        <div class="block-category-group__row">
                            <span class="block-category-group__title">Категория:</span>
                            <span class="block-category-group__text">Кабель</span>
                        </div>
                        <div class="block-category-group__row">
                            <span class="block-category-group__title">Подкатегория:</span>
                            <span class="block-category-group__text">Кабель алюминевый силовой</span>
                        </div>
                        <button type="button" class="block-category-group__refresh">
                            <icon-base icon="refresh" />
                        </button>
                    </div>

                    <input-base id="input-unit"
                                class="input-text input-quantity input-base_readonly-white category__control mt-0 mb-3"
                                label="Единица измерения"
                                readonly
                                v-model="value.unit">
                                <template v-slot:icon-right>
                                    <icon-base icon="lock"/>
                                </template>
                    </input-base>

                    <input-base id="input-quantity"
                                class="input-text input-unit input-base_readonly-white category__control mt-0 mb-3"
                                label="Количество товарных предложений"
                                v-model="value.quantity">
                                <template v-slot:icon-right>
                                    <icon-base icon="link"/>
                                </template>
                    </input-base>

                    <input-checkbox class="input-checkbox_origin"
                        text="Скрыть от пользователей"
                        v-model="value.hidden"/>
                </div>

                <div class="popup-form-group-line">
                    <input-base id="input-additional"
                                class="input-text input-unit input-base_readonly-white category__control mt-0 mb-3"
                                label="Доп. название эталона"
                                v-model="value.quantity">
                                <template v-slot:icon-right>
                                    <icon-base icon="delete"/>
                                </template>
                    </input-base>
                    <div class="d-flex justify-content-center">
                        <v-btn class="btn btn_gray btn_md category__control px-3"
                            @click.prevent="$modal.show('add-characteristic')">Добавить доп. название</v-btn>
                    </div>
                    <input-checkbox class="input-checkbox_origin mb-4"
                        text="Скрыть от пользователей"
                        v-model="value.hidden"/>
                </div>
            </template>

            <template v-slot:characteristic>
                
                <div class="popup-form-group">
                    <div v-for="(attr, index) in attrs" :key="index">
                        <input-base :id="'input-attr-value-' + index"
                            class="input-text input-unit input-base_urgent category__control mt-0 mb-3"
                            :class="{'input-base_urgent': attr.required}"
                            :label="attr.name"
                            v-model="form.attrs[attr.attr_id]"
                            :validator="$v.form.attrs.$each[attr.attr_id]">
                            <template v-slot:delete>
                                <v-btn v-if="!attr.required"
                                    @click="attrs.splice(index, 1)"
                                    class="btn_delete create__content-characteristic-delete">
                                    <icon-base icon="delete"/>
                                </v-btn>
                            </template>
                        </input-base>
                    </div>
                    
                    <div class="d-flex justify-content-center">
                        <v-btn class="btn_gray btn_md category__control" 
                            @click.prevent="$modal.show('add-characteristic')">
                            Добавить
                        </v-btn>
                    </div>
                </div>

                <div class="popup-form-group-line">
                    <div class="field-title">JSON характеристики</div>
                    <input-base id="input-json"
                        :class="{ 'category__control input-base_readonly-white': !jsonText }"
                        label="Выберите JSON файл"
                        :value="jsonFileName"
                        :readonly="true"
                        :disabled="!!jsonText"
                        @click="$refs.inputJson.click()">
                        <template v-slot:delete v-if="!jsonText">
                            <v-btn @click="jsonFile = ''; jsonData = []; jsonFileName = ''; $refs.inputJson.value = ''; jsonError = ''"
                                class="btn_delete create__content-characteristic-delete">
                                <icon-base icon="cross"/>
                            </v-btn>
                        </template>
                        <template v-slot:error v-if="jsonError && !jsonText">
                            <div class="invalid-feedback d-block">{{ jsonError }}</div>
                        </template>
                    </input-base>
                    <div class="or">
                        <div class="or__text">или</div>
                    </div>
                    <input-textarea class="category__control"
                        v-model="jsonText"
                        @change="onJsonInput"
                        :disabled="!!jsonFile">
                        <template v-slot:error v-if="jsonError && !jsonFile">
                            <div class="invalid-feedback d-block">{{ jsonError }}</div>
                        </template>
                    </input-textarea>
                </div>
            </template>

            <template v-slot:additional>
                <div class="popup-form-group">
                    <input-file class="mb-4"
                                v-model="value.imageBase64"/>

                    <div class="dropdown">
                        <div class="d-flex align-items-center">
                            <div class="field-title">Описание</div>
                            <button class="dropdown__btn ml-auto" @click="dropdownShow = !dropdownShow">
                                Скрыть характеристики
                                <icon-base icon="triangle"/>
                            </button>
                        </div>
                        <transition-expand>
                            <div class="dropdown__list" v-show="dropdownShow">
                                <div class="dropdown__item d-flex">
                                    <div class="dropdown__name">Характеристика</div>
                                    <div class="dropdown__value ml-auto">значение</div>
                                </div>
                                <div class="dropdown__item d-flex">
                                    <div class="dropdown__name">Характеристика</div>
                                    <div class="dropdown__value ml-auto">значение</div>
                                </div>
                                <div class="dropdown__item d-flex">
                                    <div class="dropdown__name">Характеристика</div>
                                    <div class="dropdown__value ml-auto">значение</div>
                                </div>
                            </div>
                        </transition-expand>
                    </div>

                    <input-textarea class="mb-2"/>

                    <radio-buttons class="mb-4" :options="radioBtns"/>
                </div>
            </template>

            <template v-slot:seo>
                <div class="popup-form-group">
                    <input-base id="input-url"
                        class="input-text category__control mt-0 mb-3"
                        label="Url"
                        v-model="value.url"/>

                    <input-base id="input-title"
                        class="input-text category__control mt-0 mb-3"
                        label="Title"
                        v-model="value.title"/>

                    <input-base id="input-image1"
                        class="input-text category__control mt-0 mb-3"
                        label="Alt image1"
                        v-model="value.alt_image"/>

                    <input-base id="input-image2"
                        class="input-text category__control mt-0 mb-3"
                        label="Alt image2"
                        v-model="value.alt_image"/>

                    <input-base id="input-image3"
                        class="input-text category__control mt-0 mb-3"
                        label="Alt image3"
                        v-model="value.alt_image"/>

                    <input-base id="input-description"
                        class="input-text category__control mt-0 mb-4"
                        label="Meta description"
                        v-model="value.meta_description"/>

                    <input-checkbox class="input-checkbox_origin category__control mb-3"
                        text="Закрыть от индексации"
                        v-model="value.hide_robots"/>

                    <input-checkbox class="input-checkbox_origin mt-0 mb-4"
                        text="Исключить страницу из карты сайта"
                        v-model="value.hide_sitemap"/>
                </div>
            </template>
        </tabs-base>
    </div>
    
</template>

<script>
import VBtn from '@/components/VBtn'
import InputBase from '@/components/InputBase'
import InputCheckbox from '@/components/InputCheckbox'
import VRedactor from '@/components/VRedactor'
import TabsBase from '@/components/TabsBase'
import InputFile from '@/components/InputFile'
import InputTextarea from '@/components/InputTextarea'
import TransitionExpand from '@/components/TransitionExpand'
import RadioButtons from '@/components/RadioButtons'
import ModalAddCharacteristic from '@/components/ModalAddCharacteristic'

export default {
    components: {
        TabsBase,
        InputBase,
        InputCheckbox,
        VRedactor,
        InputFile,
        InputTextarea,
        TransitionExpand,
        ModalAddCharacteristic,
        RadioButtons,
        VBtn,
    },
    data() {
        return {
            dropdownShow: false,
            radioBtns: [
                { text: 'Товар', value: 'product' },
                { text: 'Аксессуар', value: 'accessory' },
            ],
            tabs: {
                common: 'Общее',
                characteristic: 'Характеристики',
                additional: 'Дополнительное',
                seo: 'SEO',
            },
            jsonFileName: '',
            jsonFile: '',
            jsonText: '',
            jsonData: '',
            jsonError: '',
            attrs: [],
        }
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    description: '',
                    imageBase64: '',
                    iconBase64: '',
                    hidden: 0,
                    hide_robots: 0,
                    hide_sitemap: 0,
                    unit: 's',
                    title: '',
                    alt_image: '',
                    meta_description: '',
                    quantity: '',
                }
            }
        },
    },
    methods: {
        onJsonUpload(event) {
            if (event.target.files.length) {
                let reader = reader = new FileReader()
                const file = event.target.files[0]
                this.jsonFileName = file.name
                reader.readAsText(file)
                reader.onload = result => {
                    this.jsonFile = result.target.result
                    this.jsonError = this.validateJson(result.target.result)
                    console.log(this.validateJson(result.target.result))

                    if (this.jsonError) {
                        return
                    }

                    this.jsonData = JSON.parse(this.jsonFile)
                    this.parseJson(this.jsonData)
                }
            }
        },
        onJsonInput() {
            this.jsonError = this.validateJson(this.jsonText)
            if (this.jsonError) {
                return
            }
            this.jsonData = JSON.parse(this.jsonText)
            this.parseJson(this.jsonData)
        },
        validateJson(str) {
            if (!/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                return 'Неверный формат JSON'
            }
            try {
                JSON.parse(str);
            } catch (e) {
                return 'Неверный формат JSON'
            }
            const data = JSON.parse(str)
            if (!Array.isArray(data)) {
                return 'Неверный формат данных'
            }
            let error = false
            data.forEach(attr => {
                if (!attr.attr_id && !attr.name) {
                    error = 'Отсутсвует обязательное поле (attr_id или name)'
                }
                if (!attr.value) {
                    error = 'Отсутсвует обязательное поле (value)'
                }
            })
            return error
        },
        async parseJson(attrs) {
            this.attrs.forEach((attr, index) => {
                if (!attr.required) {
                    this.attrs.splice(index, 1)
                }
            })

            const data = await API.get(this.$axios, 'manager/category/attr/get-list', { attrs: attrs })

            data.forEach(attr => {
                const index = this.attrs.findIndex(el => el.attr_id == attr.attr_id)
                if (index == -1) {
                    this.attrs.push({ name: attr.name, attr_id: attr.attr_id, required: false })
                }
                Vue.set(this.form.attrs, attr.attr_id, attr.value)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .block-category-group {
        position: relative;
        padding: (12 / 16 + rem) 1rem;
        border: 1px solid $border-color;
        border-radius: 4px;

        &__title {
            display: inline-block;
            min-width: 100px;
            font-size: (11 / 16 + rem);
            line-height: (20 / 16 + rem);
            vertical-align: middle;
        }

        &__text {
            font-size: (14 / 16 + rem);
        }

        &__refresh {
            position: absolute;
            top: 50%;
            right: 15px;
            background-color: transparent;
            border: none;
            transform: translateY(-50%);
        }
    }

    .input-unit {
        & .icon {
            position: absolute;
            top: 50%;
            right: 20px;
            width: 18px;
            transform: translateY(-50%);
        }
    }

    .input-quantity {
        & .icon {
            position: absolute;
            top: 50%;
            right: 19px;
            width: 12px;
            height: 12px;
            transform: translateY(-50%);
        }
    }

    .field-title {
        margin-bottom: (10 / 16 + rem);
        font-weight: 500;
        line-height: (19 / 16 + rem);
    }

    .or {
        margin-bottom: 12px;
        font-size: (13 / 16 + rem);
        text-align: center;
        color: $disable;

        &__text {
            position: relative;

                &:after,
                &:before {
                content: '';
                position: absolute;
                top: 50%;
                width: 46%;
                height: 1px;
                background-color: $disable;
                transform: translateY(-50%);
            }
            &:after {
                left: 0;
            }
            &:before {
                right: 0;
            }
        }
    }

    .dropdown {

        &__btn {
            margin-bottom: (8 / 16 + rem);
            padding: 0;
            border: none;
            background-color: transparent;
            font-size: (14 / 16 + rem);
        }

        &__item {
            border-bottom: 1px solid #F0F0F0;
            font-size: (12 / 16 + rem);
            color: #484848;
        }

        &__name {

        }
    }
</style>
