<template>
    <div class="m-auto">
        <div class="text-muted">
            Главная страница. Перейти в <nuxt-link to="/catalog">Каталог</nuxt-link>
        </div>
    </div>
</template>

<script>
import Papa from 'papaparse'

export default {
    layout: 'default-without-sidebar',
    data() {
        return {
            raw: '',
            csv: [],
            fields: [
                'category_id',
                'root_id',
                'parent_id',
                'name',
                'unit',
                'description',
                'image',
                'icon',
                'url',
                'title',
                'alt_image',
                'hidden',
                'hide_robots',
                'hide_sitemap',
                'sort_order',
                'sort_order_main_page',
            ],
        }
    },
    methods: {
        onUpload(event) {
            if (event.target.files && event.target.files[0]) {
                let reader = reader = new FileReader()
                const file = event.target.files[0]
                reader.readAsText(file, 'CP1251')
                reader.onload = result => {
                    this.csv = Papa.parse(result.target.result, { skipEmptyLines: true })
                }
            }
        }
    }
}
</script>
