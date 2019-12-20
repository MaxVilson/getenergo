<template>
    <div class="create">
        <modal-select-category @select="onSelectCategory"/>
        <modal-add-characteristic :value="attrs" @input="attrs = $event.slice()"/>
        <head-line title="Создание эталона"></head-line>
        <div class="container">
            <form class="create__wrapper" @submit.prevent="onSubmit">
                <div class="create__aside">
                    <ul class="create__aside-list">
                        <li class="create__aside-item" :class="{'create__aside-item_active': step > 0}">
                            1. Общее
                            <icon-base v-show="step > 1" icon="check"/>
                        </li>
                        <li class="create__aside-item" :class="{'create__aside-item_active': step > 1}">
                            2. Характеристики
                            <icon-base v-show="step > 2" icon="check"/>
                        </li>
                        <li class="create__aside-item" :class="{'create__aside-item_active': step > 2}">
                            3. Дополнительное
                            <icon-base v-show="step > 3" icon="check"/>
                        </li>
                    </ul>
                </div>

                <div class="create__content">

                    <div class="form-group category__control" 
                         :class="{'form-group_active': popupCategories}"
                         v-show="step > 0">
                        <form-group-title title="Категория" @click="popupCategories = !popupCategories" />
                        <transition-expand>
                            <div v-show="!popupCategories">
                                <input-base 
                                    id="input-category"
                                    class="category__control input-base_readonly-white"
                                    label="Категория"
                                    :value="modelCategory.name || ''"
                                    :validator="$v.form.category_id"
                                    :readonly="true"
                                    @click="$modal.show('select-category')"/>
                                <input-base 
                                    id="input-name"
                                    class="category__control"
                                    label="Название эталона"
                                    :validator="$v.form.name"
                                    v-model="form.name"/>

                                <div v-for="(alt, index) in form.altNames" :key="index">
                                    <input-base 
                                        :id="'input-alt-' + index"
                                        class="input-base_delete category__control"
                                        label="Доп. название эталона"
                                        v-model="form.altNames[index]"
                                        :validator="$v.form.altNames.$each[index]">
                                        <template v-slot:delete>
                                            <v-btn @click="form.altNames.splice(index, 1)"
                                                   class="btn_delete create__content-characteristic-delete">
                                                       <icon-base icon="cross"/>
                                            </v-btn>
                                        </template>
                                    </input-base>
                                </div>
                                <div class="d-flex justify-content-center">
                                    <v-btn class="btn_gray btn_py-4px btn_w220 category__control" @click="form.altNames.push('')">Добавить доп. название</v-btn>
                                </div>
                            </div>
                        </transition-expand>
                    </div>

                    <div class="form-group category__control" 
                         :class="{'form-group_active': popupCharacteristic}"
                         v-show="step > 1">
                        <form-group-title title="Характеристики" @click="popupCharacteristic = !popupCharacteristic"/>
                        <transition-expand>
                            <div v-show="!popupCharacteristic">
                                <div v-for="(attr, index) in attrs" :key="index">
                                    <input-base :id="'input-attr-value-' + index"
                                        class="category__control"
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
                                        @click.prevent="$modal.show('add-characteristic')">Добавить</v-btn>
                                </div>
                                <div class="create__content-characteristic-footer">
                                    <div class="create__content-characteristic-title">JSON характеристики</div>
                                    <input-base id="input-json"
                                        :class="{ 'category__control input-base_readonly-white': !jsonText }"
                                        label="Выберите JSON файл"
                                        :value="jsonFileName"
                                        :readonly="true"
                                        :disabled="!!jsonText"
                                        @click="$refs.inputJson.click()">
                                        <template v-slot:delete v-if="!!jsonFile">
                                            <v-btn @click="jsonFile = ''; jsonData = []; jsonFileName = ''; $refs.inputJson.value = ''; jsonError = ''"
                                                class="btn_delete create__content-characteristic-delete">
                                                <icon-base icon="cross"/>
                                            </v-btn>
                                        </template>
                                        <template v-slot:error v-if="jsonError && !jsonText">
                                            <div class="invalid-feedback d-block">{{ jsonError }}</div>
                                        </template>
                                    </input-base>
                                    <input type="file" class="d-none" ref="inputJson"
                                        @change="onJsonUpload">
                                    <div class="create__content-characteristic-or">
                                        <div class="create__content-characteristic-or-text">или</div>
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
                            </div>
                        </transition-expand>
                    </div>

                    <div class="form-group category__control" 
                         :class="{'form-group_active': popupAdditional}"
                         v-show="step > 2">
                        <form-group-title title="Дополнительное" @click="popupAdditional = !popupAdditional"/>
                        <transition-expand>
                            <div v-show="!popupAdditional">    

                                <div class="create__content-additional-title">Фотографии</div>
                                <input-file class="category__control input-file_multiple" 
                                            :max="3" 
                                            v-model="form.imagesBase64">
                                            <template v-slot:uploadTitle>Загрузите фотографии</template>
                                            <template v-slot:uploadText>
                                                Для удаления или замены наведите на фотографию
                                            </template>
                                </input-file>

                                <div class="create__content-additional-title">Описание</div>
                                <v-redactor class="category__control create__content-textarea"
                                    v-model="form.description"/>
                            </div>
                        </transition-expand>
                    </div>

                    <div class="form-group-last" v-show="popupCharacteristic">
                        <div class="mb-3">
                            <radio-buttons v-model="form.typeName" :options="radioBtns"/>
                        </div>
                        <input-checkbox class="input-checkbox_origin category__control"
                            text="Скрыть от пользователей"
                            v-model="form.hidden"/>
                        <input-checkbox class="input-checkbox_origin category__control"
                            text="Закрыть от индексации"
                            v-model="form.hide_robots"/>
                        <input-checkbox class="input-checkbox_origin category__control"
                            text="Исключить страницу из карты сайта"
                            v-model="form.hide_sitemap"/>
                    </div>
                    
                    <v-btn class="btn_gray btn-block" 
                           type="button"
                           v-show="step < 3"
                           @click="nextStep">
                        Далее
                    </v-btn>
                    <v-btn class="btn_fz-15 btn-block btn_active" 
                           type="submit"
                           v-show="step >= 3">
                        Создать
                    </v-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import API from '@/utils/api'
import { mapActions } from 'vuex'
import textHelper from '@/utils/textHelper'
import ModalAddCharacteristic from '@/components/ModalAddCharacteristic'
import ModalSelectCategory from '@/components/Modal/ModalSelectCategory'
import InputBase from '@/components/InputBase'
import VBtn from '@/components/VBtn'
import HeadLine from '@/components/HeadLine'
import FormGroupTitle from '@/components/FormGroupTitle'
import InputCheckbox from '@/components/InputCheckbox'
import InputTextarea from '@/components/InputTextarea'
import VRedactor from '@/components/VRedactor'
import TransitionExpand from '@/components/TransitionExpand'
import InputFile from '@/components/InputFile'
import RadioButtons from '@/components/RadioButtons'
import { required, minLength } from 'vuelidate/lib/validators'


export default {
    layout: 'default-without-sidebar',
    async fetch ({ store }) {
        await store.dispatch('categories/getCategories')
        await store.dispatch('attrs/getAttrs', { page: 1, limit: 8 })
    },
    mixins: [
        validationMixin,
        textHelper,
    ],
    computed: {
        formAttrs: function() {
            return Object.values(this.form.attrs)
        }
    },
    data() {
        return {
            jsonFileName: '',
            jsonFile: '',
            jsonText: '',
            jsonData: '',
            jsonError: '',
            step: 1,
            modelCategory: {},
            form: {
                category_id: '',
                name: '',
                url: '',
                altNames: [],
                attrs: {},
                typeName: 'product',
                imagesBase64: [],
                description: '',
                hidden: 0,
                hide_robots: 0,
                hide_sitemap: 0,
            },
            loading: false,
            attrs: [],
            showCategories: true,
            showCharacteristic: false,
            showAdditional: false,
            showBtn: true,
            popupCategories: false,
            popupCharacteristic: false,
            popupAdditional: false,
            radioBtns: [
                { text: 'Товар', value: 'product' },
                { text: 'Аксессуар', value: 'accessory' },
            ],
        }
    },
    validations() {
        return {
            form: {
                category_id: {
                    required,
                },
                name: {
                    required,
                    minLength: minLength(2),
                },
                altNames: {
                    $each: {
                        required
                    }
                },
                attrs: {
                    $each: {
                        required
                    }
                },
            }
        }
    },
    components: {
        ModalAddCharacteristic,
        ModalSelectCategory,
        InputBase,
        VBtn,
        HeadLine,
        FormGroupTitle,
        InputTextarea,
        VRedactor,
        TransitionExpand,
        InputFile,
        RadioButtons,
        InputCheckbox
    },
    watch: {
        attrs: function(value) {
            for (const attr_id in this.form.attrs) {
                
                if (this.form.attrs.hasOwnProperty(attr_id)) {
                    let index = this.attrs.findIndex(attr => attr.attr_id == attr_id)
                    if (index == -1) {
                        Vue.delete(this.form.attrs, attr_id)
                    }
                }
            }
            value.forEach(attr => {
                if (!this.form.attrs[attr.attr_id]) {
                    Vue.set(this.form.attrs, attr.attr_id, '')
                }
            })
        },
        modelCategory: function(value) {
            this.form.category_id = value ? value.category_id : null
        }
    },
    methods: {
        ...mapActions('models', {
            createModel: 'createModel'
        }),
        async onSubmit() {
            this.$v.form.$touch()
            if (this.loading || this.$v.form.$pending || this.$v.form.$error) return

            this.loading = false
            try {
                this.form.url = this.urlFormatter(this.translit(this.form.name))
                await this.createModel(this.form)
                this.$router.push('/catalog')
            } catch (error) {
                
            }
            this.loading = false
        },
        async onSelectCategory(category_id) {
            this.modelCategory = await API.get(this.$axios, 'manager/category/categories/' + category_id, { expand: 'categoryAttrs' })
            this.attrs = this.modelCategory.categoryAttrs.map(attr => { return { name: attr.attr.name, attr_id: attr.attr_id, required: !!attr.required } })
            this.form.attrs = Object.fromEntries(this.attrs.map(attr => { return [attr.attr_id, ''] }))
            this.$modal.hide('select-category')
        },
        openCategories() {
            // this.$v.form.$touch()
            // if (this.loading || this.$v.form.$pending || this.$v.form.$error) return

            if (!this.showCharacteristic && !this.showAdditional) {
                this.showCharacteristic = true
                this.popupCategories = true
            }
            else if (this.showCharacteristic && !this.showAdditional) {
                this.showAdditional = true
                this.popupCharacteristic = true
                this.showBtn = false
            }
        },
        nextStep() {
            if (this.step == 1) {
                this.$v.form.category_id.$touch()
                if (this.loading || this.$v.form.category_id.$pending || this.$v.form.category_id.$error) return
                this.$v.form.category_id.$reset()
                this.$v.form.name.$touch()
                if (this.loading || this.$v.form.name.$pending || this.$v.form.name.$error) return
                this.$v.form.name.$reset()
                this.$v.form.altNames.$touch()
                if (this.loading || this.$v.form.altNames.$pending || this.$v.form.altNames.$error) return
                this.$v.form.altNames.$reset()
                this.popupCategories = true
            }

            if (this.step == 2) {
                this.$v.form.attrs.$touch()
                if (this.loading || this.$v.form.attrs.$pending || this.$v.form.attrs.$error) return
                this.$v.form.attrs.$reset()
                this.popupCharacteristic = true
            }

            this.step++
        },
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
    },
}
</script>

<style lang="scss" scoped>
    .create {

        &__wrapper {
            position: relative;
            display: flex;
            justify-content: center;
        }

        &__aside {
            position: absolute;
            top: 0;
            left: 0;

            &-list {
                margin-bottom: 0;
                padding-left: 0;
                list-style: none;
            }

            &-item {
                margin-bottom: 20px;
                font-size: (12 / 16 + rem);
                line-height: 1rem;
                color: #999999;

                &_active {
                    color: #575757;
                }

                & .icon {
                    margin-left: 8px;
                    width: 10px;
                    height: 10px;
                    vertical-align: baseline;
                    fill: #27AE60;
                }
            }
        }

        &__content {
            &-characteristic {
                &-title {
                    margin-bottom: 10px;
                    font-size: (20 / 16 + rem);
                    font-weight: 500;
                }

                &-delete {
                    position: absolute;
                    top: 6px;
                    right: 5px;
                }

                &-footer {
                    position: relative;
                    margin-top: 20px;

                    &:after {
                        content: '';
                        position: absolute;
                        top: -20px;
                        left: -20px;
                        width: 498px;
                        height: 1px;
                        background-color: #E5E5E5
                    }
                }

                &-or {
                    margin-bottom: 12px;
                    font-size: (13 / 16 + rem);
                    text-align: center;
                    color: $disable;

                    &-text {
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
            }

            &-additional {
                &-title {
                    margin-bottom: 12px;
                    font-weight: 500;
                }
            }

            &-textarea {

                & textarea {
                    border-radius: 4px;
                }
            }
        }

        .form-group {
            padding-top: 0;
            padding-bottom: 0;
            width: 500px;
            
            &_active {
                cursor: pointer;
            }

            & .icon {
                transition: all .15s;
            }

            &_active .icon-dropdown {
                transform: rotate(-90deg);
                transition: all .15s;
            }
            

            &-title {
                padding-top: 20px;
                padding-bottom: 20px;
                margin-bottom: 0;
            }
        }
    }

    .btn_active {
        margin-top: 28px;
    }

    .input-checkbox {
        &::v-deep &__label {
            &:after {
                border: 2px solid #4F4F4F;
            }
        }
    }
</style>