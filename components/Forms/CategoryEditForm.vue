<template>
    <tabs-base :tabs="tabs">
        <template v-slot:common>
            <div class="popup-form-group">
                <v-multiselect v-if="value.level == 'child' || value.level == 'subchild'"
                    class="category__control"
                    v-model="value.root_id"
                    :options="categoryOptions"
                    label="text"
                    :allow-empty="false"
                    id="input-filter"
                    placeholder=""
                    :showNoResults="false"
                    innerText="Выберите группу категорий"
                    :validator="$v.value.root_id"/>

                <v-multiselect v-if="value.level == 'subchild'"
                    class="category__control"
                    v-model="value.parent_id"
                    :options="childCategoryOptions"
                    label="text"
                    :allow-empty="false"
                    id="input-filter2"
                    placeholder=""
                    :showNoResults="false"
                    innerText="Выберите категорию"
                    :validator="$v.value.parent_id"/>

                <v-multiselect v-if="value.level == 'child' || value.level == 'subchild'"
                    class="category__control"
                    v-model="value.unit_id"
                    :options="unitsOptions"
                    label="text"
                    :allow-empty="false"
                    :showNoResults="false"
                    id="input-filter2"
                    placeholder=""
                    innerText="Выберите единицу измерения"
                    :validator="$v.value.unit_id"/>

                <v-redactor class="category__control"
                    v-model="value.description"/>

                <input-file class="category__control"
                    v-model="value.imageBase64"/>

                <input-file v-if="value.level == 'root'" 
                    class="input-file_icon category__control" 
                    v-model="value.iconBase64">
                    <template v-slot:uploadTitle>Загрузите иконку</template>
                    <template v-slot:uploadText>
                        Загружено максимальное количество иконок: 1 Для удаления или замены наведите на иконку
                    </template>
                </input-file>

                <input-checkbox class="input-checkbox_origin category__control"
                    text="Скрыть от пользователей"
                    v-model="value.hidden"/>
            </div>
        </template>
        <template v-slot:attrs v-if="value.level == 'child' || value.level == 'subchild'">
            <div class="popup-form-group">
                <input-checkbox v-for="(attr, index) in value.attrs" :key="attr.attr_id"
                    :id="'attr-required-' + index"
                    class="category__control"
                    v-model="value.attrs[index].required"
                    :text="attr.name">
                    <button type="button" class="input-checkbox__delete"
                        @click.prevent="value.attrs.splice(index, 1)"><icon-base icon="delete"/></button>
                </input-checkbox>

                <div class="d-flex justify-content-center">
                    <v-btn class="btn_gray btn_md category__control"
                        @click.prevent="$modal.show('attr-add')">Добавить</v-btn>
                </div>
            </div>
            <modal-base name="attr-add">
                <attr-select-form v-model="value.attrs"
                    @input="$modal.hide('attr-add')"/>
            </modal-base>
        </template>
        <template v-slot:seo>
            <div class="popup-form-group">
                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Url"
                    v-model="value.url"
                    :validator="$v.value.url"/>

                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Title"
                    v-model="value.title"/>

                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Alt photo"
                    v-model="value.alt_image"/>

                <input-base id="input-text"
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
</template>

<script>
import InputBase from '@/components/InputBase'
import InputCheckbox from '@/components/InputCheckbox'
import VRedactor from '@/components/VRedactor'
import TabsBase from '@/components/TabsBase'
import InputFile from '@/components/InputFile'
import VBtn from '@/components/VBtn'
import VMultiselect from '@/components/VMultiselect'
import { mapActions, mapGetters } from 'vuex'
import ModalBase from '@/components/Modal/ModalBase'
import AttrSelectForm from '@/components/Forms/AttrSelectForm'
import { required, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
    components: {
        TabsBase,
        InputBase,
        InputCheckbox,
        VRedactor,
        InputFile,
        VMultiselect,
        ModalBase,
        AttrSelectForm,
        VBtn,
    },
    mixins: [
        validationMixin,
    ],
    validations() {
        let rules = {
            value: {
                url: {
                    required,
                    minLength: minLength(2),
                },
            }
        }
        if (this.value.level == 'child' || this.value.level == 'subchild') {
            rules.value.root_id = {
                required
            }
            rules.value.unit_id = {
                required
            }
        }
        if (this.value.level == 'subchild') {
            rules.value.parent_id = {
                required
            }
        }
        return rules
    },
    data() {
        let tabs = {};
        tabs.common = 'Общее'
        if (this.value.level == 'child' || this.value.level == 'subchild') {
            tabs.attrs = 'Характеристики'
        }
        tabs.seo = 'SEO'
        return {
            tabs: tabs
        }
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    level: '',
                    description: '',
                    imageBase64: '',
                    iconBase64: '',
                    hidden: 0,
                    hide_robots: 0,
                    hide_sitemap: 0,
                    url: '',
                    title: '',
                    alt_image: '',
                    meta_description: '',
                    meta_descriptionEtalon: '',
                    root_id: '',
                    unit_id: '',
                    attrs: [],
                }
            }
        },
    },
    computed: {
        ...mapGetters({
            units: 'units/getUnits',
            categories: 'categories/getCategories',
        }),
        categoryOptions() {
            if (this.value.level == 'subchild') {
                return this.categories.filter(category => category.path.length).map(category => { return { name: category.category_id, text: category.name }})
            } else if (this.value.level == 'child') {
                return this.categories.map(category => { return { name: category.category_id, text: category.name }})
            }
        },
        childCategoryOptions() {
            if (!this.value.root_id) {
                return []
            }
            return this.categories.find(category => category.category_id === this.value.root_id).path.map(category => { return { name: category.category_id, text: category.name }})
        },
        unitsOptions() {
            return this.units.map(unit => { return { name: unit.unit_id, text: unit.name }})
        },
    },
}
</script>