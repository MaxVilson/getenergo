<template>
    <nav>
        <ul class="breadcrumbs">
            <li class="breadcrumb-item"
                :class="{ active: index + 1 == links.length }"
                v-for="(link, index) in links" :key="index">
                <nuxt-link v-if="index + 1 < links.length"
                    :to="{ path: link.to, query: link.query }">
                    {{ link.text }}
                </nuxt-link>
                <span v-else>{{ link.text }}</span>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        links: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss">
.breadcrumbs {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 0.8125rem;
    list-style: none;
    padding: 0;
    margin: 20px 0;

    li {
        display: inline-block;
    }

    a {
        color: #444;
        text-decoration: none;

        &:hover {
            color: #1889DB;
        }
    }

    span {
        font-weight: bold;
    }
}
.breadcrumb-item + .breadcrumb-item::before {
    content: "—";
}
</style>