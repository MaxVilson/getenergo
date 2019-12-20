<template>
    <nav>
        <ul class="pagination">
            <li class="pagination__item"
                v-if="start > 1"
                @click.prevent="$emit('input', 1)">
                <nuxt-link :to="{ path: firstLink.path, query: firstLink.query }"
                    class="pagination__link">{{ firstLink.page }}</nuxt-link>
            </li>

            <li class="pagination__item"
                v-if="start > 2 && links.length < total_pages">
                <span class="pagination__link">...</span>
            </li>

            <li class="pagination__item"
                @click.prevent="$emit('input', link.page)"
                v-for="link in links" :key="link.page"
                :class="{ active: value == link.page }">
                <nuxt-link :to="{ path: link.path, query: link.query }"
                    class="pagination__link">{{ link.page }}</nuxt-link>
            </li>

            <li class="pagination__item"
                v-if="start + max_links < total_pages && links.length < total_pages">
                <span class="pagination__link">...</span>
            </li>

            <li class="pagination__item"
                v-if="start + max_links <= total_pages"
                @click.prevent="$emit('input', total_pages)">
                <nuxt-link :to="{ path: lastLink.path, query: lastLink.query }"
                    class="pagination__link">{{ lastLink.page }}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'v-pagination',
    props: {
        value: { type: Number | String, default: 1 },
        params: { type: Object, default: () => {} },
        total_pages: { type: Number, required: true },
        max_links: { type: Number, default: 5 },
    },
    computed: {
        start() {
            return this.value - Math.floor(this.max_links / 2) > 1 ? this.value - Math.floor(this.max_links / 2) : 1
        },
        links() {
            let links = []
            for (let index = 0; index < this.max_links; index++) {
                if (index + this.start <= this.total_pages) {
                    links.push({
                        page: index + this.start,
                        path: this.$route.path,
                        query: Object.assign({}, this.params, { page: index + this.start })
                    })
                }
            }
            return links
        },
        firstLink() {
            return {
                page: 1,
                path: this.$route.path,
                query: Object.assign({}, this.params, { page: 1 })
            }
        },
        lastLink() {
            return {
                page: this.total_pages,
                path: this.$route.path,
                query: Object.assign({}, this.params, { page: this.total_pages })
            }
        },
    },
}
</script>

<style lang="scss">
    .pagination {
        margin-bottom: 0;

        &__link {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 26px;
            height: 26px;
            border-radius: 36px;
            background-color: transparent;
            font-size: (12 / 16 + rem);
            font-weight: 500;
            text-decoration: none;
            color: #828282;
            &:hover {
                text-decoration: none;
                color: $black;
            }
        }
    }
    .pagination__item.active {
        border-radius: 50%;
        background-color: $blue;
        & a {
            color: $white;
        }
    }
</style>
