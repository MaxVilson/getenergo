<template>
    <div>
        <head-line :title="title"/>
        <form @submit.prevent="onSubmit"
            class="category__form">
            <div class="category__form-wrapper">

                <template v-if="level == 'root'">
                    <input-base id="input-name"
                        class="input-text category__control mt-0"
                        label="Название группы категорий"
                        v-model="form.name"
                        :validator="$v.form.name"/>
                    <v-redactor class="category__control"
                        v-model="form.description"/>
                    <input-file class="category__control"
                        v-model="form.imageBase64"/>
                    <input-file class="input-file_icon category__control" v-model="form.iconBase64">
                        <template v-slot:uploadTitle>Загрузите иконку</template>
                        <template v-slot:uploadText>
                            Загружено максимальное количество иконок: 1 Для удаления или замены наведите на иконку
                        </template>
                    </input-file>
                </template>
                <template v-else>
                    <div class="form-group category__control">
                        <form-group-title title="Общее"
                            @click="commonBlock = !commonBlock"/>
                        <transition-expand>
                            <div v-if="commonBlock">
                                <v-multiselect class="category__control"
                                    v-model="form.root_id"
                                    :options="categoryOptions"
                                    label="text"
                                    :allow-empty="false"
                                    id="input-root_id"
                                    placeholder=""
                                    :showNoResults="false"
                                    innerText="Выберите группу категорий"
                                    :validator="$v.form.root_id"/>
                                <v-multiselect v-if="level == 'subchild'"
                                    class="category__control"
                                    v-model="form.parent_id"
                                    :options="childCategoryOptions"
                                    label="text"
                                    :allow-empty="false"
                                    id="input-parent_id"
                                    placeholder=""
                                    :showNoResults="false"
                                    innerText="Выберите категорию"
                                    :validator="$v.form.parent_id"/>
                                <input-base id="input-name"
                                    class="input-text category__control mt-0"
                                    label="Название категории"
                                    v-model="form.name"
                                    :validator="$v.form.name"/>
                                <v-multiselect class="category__control"
                                    v-model="form.unit_id"
                                    :options="unitsOptions"
                                    label="text"
                                    :allow-empty="false"
                                    :showNoResults="false"
                                    id="input-unit_id"
                                    placeholder=""
                                    innerText="Выберите единицу измерения"
                                    :validator="$v.form.unit_id"/>
                                <v-redactor class="category__control"
                                    v-model="form.description"/>
                            </div>
                        </transition-expand>
                    </div>
                    <input-file class="category__control"
                        v-model="form.imageBase64"/>
                    <div class="form-group category__control">
                        <form-group-title title="Характеристики" @click="attrBlock = !attrBlock"/>
                        <transition-expand>
                            <div v-if="attrBlock">
                                <input-checkbox v-for="(attr, index) in form.attrs" :key="attr.attr_id"
                                    :id="'attr-requared-' + index"
                                    class="category__control"
                                    v-model="form.attrs[index].required"
                                    :text="attr.name">
                                    <button type="button" class="input-checkbox__delete"
                                        @click.prevent="form.attrs.splice(index, 1)"><icon-base icon="delete"/></button>
                                </input-checkbox>

                                <div class="d-flex justify-content-center">
                                    <v-btn class="btn_gray btn_md category__control"
                                        @click.prevent="$modal.show('attr-add')">Добавить</v-btn>
                                </div>
                            </div>
                        </transition-expand>
                    </div>
                    <modal-base name="attr-add">
                        <attr-select-form v-model="form.attrs"
                            @input="$modal.hide('attr-add')"/>
                    </modal-base>
                </template>

                <input-checkbox class="input-checkbox_origin category__control"
                    text="Скрыть от пользователей"
                    v-model="form.hidden"></input-checkbox>

                <v-btn class="btn-transparent btn-block btn_disable btn_create btn_py-12"
                    :class="{ 'btn_active': isDone }"
                    type="submit">Создать</v-btn>
            </div>
        </form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import API from '@/utils/api'
import textHelper from '@/utils/textHelper'
import HeadLine from '@/components/HeadLine'
import InputBase from '@/components/InputBase'
import VRedactor from '@/components/VRedactor'
import VBtn from '@/components/VBtn'
import InputFile from '@/components/InputFile'
import InputCheckbox from '@/components/InputCheckbox'
import TransitionExpand from '@/components/TransitionExpand'
import ModalBase from '@/components/Modal/ModalBase'
import AttrSelectForm from '@/components/Forms/AttrSelectForm'
import VMultiselect from '@/components/VMultiselect'
import FormGroupTitle from '@/components/FormGroupTitle'
import { required, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
    layout: 'default-without-sidebar',
    validate ({ params }) {
        const levels = ['root', 'child', 'subchild']
        return levels.indexOf(params.level) !== -1
    },
    mixins: [
        validationMixin,
        textHelper,
    ],
    async fetch ({ store, query }) {
        await store.dispatch('attrs/getAttrs', { page: 1, limit: 8 })
        await store.dispatch('units/getUnits')
        await store.dispatch('categories/getCategories')
    },
    async asyncData({ params }) {
        return {
            level: params.level
        }
    },
    data() {
        return {
            commonBlock: true,
            attrBlock: true,
            form: {
                root_id: null,
                parent_id: null,
                name: '',
                unit_id: '',
                description: '',
                imageBase64: '',
                iconBase64: '',
                url: '',
                hidden: 0,
                attrs: []
            },
            types: [
                { name: 'checkbox', text: 'Чекбокс' },
                { name: 'slider', text: 'Слайдер' },
                { name: 'radio', text: 'Радио' },
                { name: 'empty', text: 'Без фильтра' },
            ],
            loading: false,
        }
    },
    validations() {
        let rules = {
            form: {
                name: {
                    required,
                    minLength: minLength(2),
                },
            }
        }
        if (this.level == 'child' || this.level == 'subchild') {
            rules.form.root_id = {
                required
            }
            rules.form.unit_id = {
                required
            }
        }
        if (this.level == 'subchild') {
            rules.form.parent_id = {
                required
            }
        }
        return rules
    },
    computed: {
        ...mapGetters({
            units: 'units/getUnits',
            categories: 'categories/getCategories',
        }),
        isDone() {
            if (this.level == 'root') {
                return !!this.form.name
            }
            if (this.level == 'child') {
                return !!this.form.name && !!this.form.root_id && !!this.form.unit_id
            }
            if (this.level == 'subchild') {
                return !!this.form.name && !!this.form.root_id && !!this.form.parent_id && !!this.form.unit_id
            }
        },
        categoryOptions() {
            if (this.level == 'subchild') {
                return this.categories.filter(category => category.path.length).map(category => { return { name: category.category_id, text: category.name }})
            } else if (this.level == 'child') {
                return this.categories.map(category => { return { name: category.category_id, text: category.name }})
            }
        },
        childCategoryOptions() {
            if (!this.form.root_id) {
                return []
            }
            return this.categories.find(category => category.category_id === this.form.root_id).path.map(category => { return { name: category.category_id, text: category.name }})
        },
        unitsOptions() {
            return this.units.map(unit => { return { name: unit.unit_id, text: unit.name }})
        },
        title: function() {
            if (this.level == 'root') {
                return 'Создание группы категорий'
            } else if (this.level == 'child') {
                return 'Создание категории'
            } else if (this.level == 'subchild') {
                return 'Создание подкатегории'
            }
            return ''
        }
    },
    watch: {
        'form.root_id': function(value) {
            this.form.parent_id = ''
        }
    },
    components: {
        InputBase,
        VBtn,
        InputFile,
        InputCheckbox,
        VRedactor,
        TransitionExpand,
        ModalBase,
        VMultiselect,
        HeadLine,
        FormGroupTitle,
        AttrSelectForm,
    },
    methods: {
        ...mapActions('categories', {
            createCategory: 'createCategory',
        }),
        async onSubmit() {
            this.$v.form.$touch()
            if (this.loading || this.$v.form.$pending || this.$v.form.$error) return

            this.loading = true
            try {
                this.form.url = this.urlFormatter(this.translit(this.form.name))
                if (this.level == 'child') {
                    this.form.parent_id = this.form.root_id
                }
                await this.createCategory(this.form)
                this.$router.push('/catalog/catalog')
            } catch (error) {

            }
            this.loading = false
        }
    }
}
</script>
