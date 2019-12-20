import API from '@/utils/api'

export const state = () => ({
    attrs: [],
    page: 1,
    limit: 20,
    totalPages: null
})

export const getters = {
    getAttrs(state) {
        return state.attrs
    },
    getTotalPages(state) {
        return state.totalPages
    },
    getPage(state) {
        return state.page
    },
    getLimit(state) {
        return state.limit
    },
}

export const mutations = {
    setAttrs: (state, attrs) => state.attrs = attrs,
    setPage: (state, page) => state.page = parseInt(page),
    setLimit: (state, limit) => state.limit = parseInt(limit),
    setTotalPages: (state, totalPages) => state.totalPages = parseInt(totalPages),
}

export const actions = {
    async getAttrs({ commit }, info) {
        info['per-page'] = typeof(info.limit) == 'undefined' ? 20 : info.limit
        const pagination = await API.head(this.$axios, 'manager/category/attrs', info)
        info.page = info.page || !pagination.totalPages ? (info.page > pagination.totalPages ? pagination.totalPages : info.page) : 1
        await commit('setAttrs', await API.get(this.$axios, 'manager/category/attrs', info))
        commit('setPage', info.page)
        commit('setLimit', info.limit)
        commit('setTotalPages', pagination.totalPages)
    },
    async createAttr({}, attr) {
        return await API.create(this.$axios, 'manager/category/attrs', attr)
    },
    async deleteAttr({ dispatch, getters }, attr_id) {
        await API.delete(this.$axios, 'manager/category/attrs/' + attr_id)
        dispatch('getAttrs', {
            page: getters['getPage'],
            limit: getters['getLimit'],
        })
    }
}