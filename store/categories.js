import API from '@/utils/api'

export const state = () => ({
    categories: [],
    categoriesMainPage: [],
})

export const getters = {
    getCategories(state) {
        return state.categories
    },
    getCategoriesMainPage(state) {
        return state.categoriesMainPage
    }
}

export const mutations = {
    setCategories: (state, categories) => state.categories = categories,
    setCategoriesMainPage: (state, categories) => state.categoriesMainPage = categories,
}

export const actions = {
    async getCategories({ commit }, data) {
        commit('setCategories', await API.get(this.$axios, 'manager/category/categories', data))
    },
    async getCategoriesMainPage({ commit }) {
        let categories = await API.get(this.$axios, 'manager/category/categories')
        commit('setCategoriesMainPage', categories.sort((a, b) => a.sort_order_main_page - b.sort_order_main_page))
    },
    async updateSortMainPage({ commit }, categories) {
        commit('setCategoriesMainPage', categories)
        let requests = []
        for (let index = 0; index < categories.length; index++) {
            const category = Object.assign({}, categories[index], { sort_order_main_page: index + 1 })
            requests.push(new Promise(() => API.update(this.$axios, 'manager/category/categories/' + category.category_id, category)).then(() => resolve()).catch(() => resolve()))
        }
        await Promise.all(requests)
    },
    async updateSortCatalog({ dispatch }, categories) {
        let requests = []
        for (let index = 0; index < categories.length; index++) {
            const category = Object.assign({}, categories[index], { sort_order: index + 1 })
            requests.push(new Promise(() => API.update(this.$axios, 'manager/category/categories/' + category.category_id, category)).then(() => resolve()).catch(() => resolve()))
        }
        await Promise.all(requests)
        await dispatch('getCategories')
    },
    async createCategory({ dispatch }, data) {
        const category = await API.create(this.$axios, 'manager/category/categories', data.form)
        await API.create(this.$axios, 'manager/category/categories/' + category.category_id + '/attrs', data.attrs)
        await dispatch('getCategories')
    }
}