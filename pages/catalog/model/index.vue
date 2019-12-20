<template>
    <div class="w-100">
        <div class="top-text">Электродвигатели и приводная техника — Предохранители на номинальное напряжение до 1000 В <span>— Подвесные и консольные светильники для уличного освещения</span></div>
        <div class="d-flex mb-4">
            <h1 class="title">Каталог</h1>
            <div class="buttons ml-auto">
                <v-btn class="btn_transparent mb-2 btn-group">Загрузить эталоны</v-btn>
                <v-btn class="btn_transparent mb-2 btn-group">Скачать эталоны</v-btn>
                <v-btn class="btn_transparent mb-2 btn-group">Загрузить фотографии</v-btn>
                <v-btn class="btn_transparent mb-2 btn-group">Создать эталон</v-btn>
            </div>
        </div>
        <div class="d-flex flex-wrap mb-2">
            <!-- <v-multiselect
                class="multiselect-filter"
                v-model="params.etalon"
                :options="filterEtalon"
                label="text"
                :allow-empty="false"
                placeholder=""
                :showNoResults="false"
                innerText="Новый эталон"/> -->
            <v-btn class="btn_transparent mb-2 btn-id">Найти эталоны по ID</v-btn>
            <input-origin type="text"
                placeholder="Поиск"
                class="input-origin_br-8 input-origin_icon-left w-100 mb-2">
                    <icon-base icon="search"/>
            </input-origin>
        </div>
        <table class="table w-100 mb-4">
             <thead class="page__attrs-thead">
                    <tr>
                        <td class="header-check"></td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('model_id')">ID
                                <icon-base v-if="params.sort != 'model_id'" icon="filter"/>
                                <icon-base v-if="params.sort == 'model_id' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'model_id' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('image')">Image
                                <icon-base v-if="params.sort != 'image'" icon="filter"/>
                                <icon-base v-if="params.sort == 'image' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'image' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('name')">Название
                                <icon-base v-if="params.sort != 'name'" icon="filter"/>
                                <icon-base v-if="params.sort == 'name' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.sort == 'name' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                        <td class="page__attrs-table-filter">
                            <span @click="updateSort('created_at')">Дата создания
                                <icon-base v-if="params.updateSort != 'created_at'" icon="filter"/>
                                <icon-base v-if="params.updateSort == 'created_at' && params.order == 'desc'" icon="filter-up"/>
                                <icon-base v-if="params.updateSort == 'created_at' && params.order == 'asc'" icon="filter-down"/>
                            </span>
                        </td>
                    </tr>
                </thead>
            <tbody>
                <tr v-for="model in models" :key="model.model_id">
                    <td style="width: 1%"><div class="checkbox"
                             @click="$set(model, 'showCheckbox', '!showCheckbox')"
                             :class="{ 'checkbox_active': model.showCheckbox == true }">
                            <icon-base icon="check"/>
                        </div>
                    </td>
                    <td style="width: 1%">{{ model.model_id }}</td>
                    <td style="width: 1%"><img class="img-fluid img" v-if="!!model.images.length" :src="model.images[0].url" :alt="model.name"></td>
                    <td>{{ model.name }}</td>
                    <td style="width: 1%">{{ model.created_at }}</td>
                </tr>
            </tbody>
        </table>
        <div class="row align-items-center">
            <div class="col-auto mr-auto d-flex align-items-center">
                <span class="bottom-multiselect-text">Эталонов на странице</span>
                <v-multiselect
                    class="bottom-multiselect"
                    v-model="params.limit"
                    :options="perPageOptions"
                    label="text"
                    :searchable="false"
                    :allow-empty="false"
                    id="input-limit"
                    :placeholder="String.prototype.toString(params.limit)"/>
            </div>
            <div class="col-auto">
                <v-pagination v-model="params.page"
                    :total_pages="totalPages"
                    :params="params"/>
            </div>
        </div>
    </div>
    <!-- <modal-base
        name="etalon-edit"
        v-if="!!editForm">
        <template v-slot:title>
            <header-edit v-model="editForm.name"/>
        </template>
        <model-edit-form v-model="editForm"/>
        <div class="modal-base-footer d-flex">
            <v-btn class="btn btn_disable modal-base-footer__btn-create">Сохранить</v-btn>
            <v-btn class="btn modal-base-footer__btn-preview ml-auto">
                <icon-base icon="view" />
                Предпросмотр
            </v-btn>
        </div>
    </modal-base> -->
</template>

// <script>
// import { mapGetters, mapActions } from 'vuex'
// import { debounce } from 'throttle-debounce'
// import VPagination from '@/components/VPagination'
// import VMultiselect from '@/components/VMultiselect'
// import VBtn from '@/components/VBtn'
// import InputOrigin from '@/components/InputOrigin'

// export default {
//     async fetch({ store, query }) {
//         await store.dispatch('models/getModels', query)
//         await store.dispatch('categories/getCategories')
//     },
//     asyncData({ query }) {
//         return {
//             params: {
//                 page: query.page || 1,
//                 limit: query.limit || 20,
//                 sort: query.sort || '',
//                 order: query.order || '',
//                 query: query.query || '',
//                 etalon: null,
//             }
//         }
//     },
//     components: {
//         VPagination,
//         VMultiselect,
//         VBtn,
//         InputOrigin,
//     },
//     computed: {
//         ...mapGetters({
//             models: 'models/getModels',
//             page: 'models/getPage',
//             limit: 'models/getLimit',
//             query: 'models/getQuery',
//             totalPages: 'models/getTotalPages',
//             sort: 'models/getSort',
//             order: 'models/getOrder'
//         }),
//         debounceFetch() {
//             return debounce(500, this.fetch)
//         }
//     },
//     data() {
//         return {
//             perPageOptions: [
//                 { name: 10, text: '10' },
//                 { name: 20, text: '20' },
//                 { name: 50, text: '50' },
//                 { name: 0, text: 'Все' },
//             ],
//             filterEtalon: [
//                 { name: 'all', text: 'Все' },
//                 { name: 'new', text: 'Новый эталон' },
//                 { name: 'this', text: 'Эталон' },
//             ],
//             loading: false
//         }
//     },
//     watch: {
//         params: {
//             deep: true,
//             async handler(value) {
//                 return this.debounceFetch()
//             }
//         },
//     },
//     methods: {
//         ...mapActions('models', {
//             getModels: 'getModels'
//         }),
//         async fetch() {
//             await this.getModels(this.params)
//             this.$router.replace({ path: this.$route.path, query: this.params })
//         },
//         updateSort(field) {
//             if (this.params.sort == field) {
//                 this.params.order = this.params.order == 'asc' ? 'desc' : 'asc'
//             } else {
//                 this.params.sort = field
//                 this.params.order = 'asc'
//             }
//         },
//     }
// }
// </script>

// <style lang="scss" scoped>
//     .top-text {
//         margin-top: 20px;
//         margin-bottom: 20px;
//         font-size: (13 / 16 + rem);

//         & span {
//             font-weight: 500;
//         }
//     }

//     .btn-group {
//         margin-left: (12 / 16 + rem);
//         padding-top: (5 / 16 + rem);
//         padding-bottom: (5 / 16 + rem);
//         line-height: 20px;
//         border-radius: 8px;
//     }

//     .btn-id {
//         padding: (9 / 16 + rem) 1rem;
//     }

//     .input-origin {
//         height: 40px;
//     }

//     .multiselect-filter {
//         height: auto;

//         &::v-deep .multiselect__tags {
//             padding-top: (10 / 16 + rem);
//             padding-bottom: (10 / 16 + rem);
//             padding-right: 2rem;
//             padding-left: 1rem;
//             font-size: (15 / 16 + rem);
//             vertical-align: middle;
//             line-height: (18 / 16 + rem);
//         }

//         &::v-deep .multiselect__select {
//             top: 50%;
//             margin: 0;
//             transform: translateY(-50%);
//             width: 24px;
//             height: 100%;

//             &:before {
//                 top: 16px;
//                 margin: 0;
//             }
//         }

//         &::v-deep .multiselect__single {
//             padding-left: 0;
//             margin-bottom: 0;
//         }
//     }

//     thead {
//         & td {
//             padding-top: 12px;
//             padding-bottom: 12px;
//         }
//     }

//     td {
//         padding-top: (8 / 16 + rem);
//         padding-bottom: (8 / 16 + rem);
//         padding-left: (20 / 16 + rem);

//         &:first-child {
//             padding-left: 1rem;
//         }

//         & span {
//             font-size: 1rem;
//         }
//     }

//     .header-check {
//         position: relative;

//         &:after {
//             content: '';
//             position: absolute;
//             top: 14px;
//             left: 19px;
//             width: 18px;
//             height: 18px;
//             border: 2px solid #4F4F4F;
//             border-radius: 2px;
//         }
//     }

//     .checkbox {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         width: 24px;
//         height: 24px;
//         border: 1px solid rgba(51, 51, 51, 0.5);
//         box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.1);
//         border-radius: 3px;
//         cursor: pointer;

//         & .icon {
//             opacity: 0;
//             transition: opacity .15s;
//         }

//         &_active {
//             & .icon {
//                 opacity: 1;
//                 transition: opacity .15s;
//             }
//         }
//     }

//     .img {
//         width: 64px;
//         height: 64px;
//         object-fit: cover;
//         border-radius: 6px;
//         border: 1px solid rgba(0, 0, 0, 0.1);
//     }

//     .bottom-multiselect {
//         width: 63px;
//         height: 34px;

//         &::v-deep .multiselect__tags {
//             padding-top: 8px;
//             padding-left: 6px;
//         }

//         &::v-deep .multiselect__select {
//             top: -1px;
//             right: -7px;
//         }

//         &::v-deep .multiselect__option {
//             padding-top: 22px;
//             border: none;
//         }

//         &::v-deep .multiselect__option--highlight {
//             &:after {
//                 right: -16px;
//                 width: 10px;
//                 height: 10px;
//                 background-color: #E9F7FF;
//             }
//         }

//         &::v-deep .multiselect__option--selected:after {
//             right: -16px;
//             width: 10px;
//             height: 10px;
//         }
//     }

//     .bottom-multiselect-text {
//         margin-right: (12 / 16 + rem);
//         margin-left: (20 / 16 + rem);
//         font-size: (12 / 16 + rem);
//         font-weight: 500;
//         color: #828282;
//     }

//     .modal-base-footer {
//         padding-right: (40 / 16 + rem);
//         padding-left: (40 / 16 + rem);

//         &__btn {
//             &-create {
//                 padding-right: (97 / 16 + rem);
//                 padding-left: (97 / 16 + rem);
//             }

//             &-preview {
//                 padding: (13.5 / 16 + rem) (22 / 16 + rem);
//                 background-color: #F5FBFE;
//                 border: none;
//                 font-weight: 500;
//                 color: $primary;

//                 & .icon {
//                     width: 18px;
//                     height: 18px;
//                 }
//             }
//         }
//     }
// </style>
