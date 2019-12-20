<template>
    <tabs-base :tabs="tabs">
        <template v-slot:common>
            <div class="popup-form-group">
                <v-redactor class="category__control"
                    v-model="value.description"/>
                <input-file class="category__control"
                    v-model="value.imageBase64"/>
                <input-file class="input-file_icon category__control" v-model="value.iconBase64">
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
        <template v-slot:seo>
            <div class="popup-form-group">
                <input-base id="input-text"
                    class="input-text category__control mt-0 mb-3"
                    label="Url"
                    v-model="value.url"/>

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

export default {
    components: {
        TabsBase,
        InputBase,
        InputCheckbox,
        VRedactor,
        InputFile,
    },
    data() {
        return {
            tabs: {
                common: 'Общее',
                seo: 'SEO',
            }
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
                    url: '',
                    title: '',
                    alt_image: '',
                    meta_description: '',
                }
            }
        },
    },
}
</script>
