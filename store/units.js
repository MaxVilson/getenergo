import API from '@/utils/api'

export const state = () => ({
    units: []
})

export const getters = {
    getUnits(state) {
        return state.units
    }
}

export const mutations = {
    setUnits: (state, units) => state.units = units,
    addUnit: (state, unit) => state.units.push(unit),
    updateUnit: (state, unit) => {
        if (typeof(unit.name) != 'undefined') {
            state.units[unit.index].name = unit.name
        }
        if (typeof(unit.short) != 'undefined') {
            state.units[unit.index].short = unit.short
        }
    },
}

export const actions = {
    async getUnits({ commit }) {
        await commit('setUnits', await API.get(this.$axios, 'manager/category/units', { fields: 'unit_id,name,short' }))
    },
    async updateUnit({ commit }, unit) {
        await commit('updateUnit', unit)
    },
    async saveUnits({ dispatch, getters }) {
        let requests = []
        getters['getUnits'].forEach(unit => {
            if (unit.unit_id) {
                requests.push(new Promise(() => API.update(this.$axios, 'manager/category/units/' + unit.unit_id, unit)).then(() => resolve()).catch(() => resolve()))
            } else {
                requests.push(new Promise(() => API.create(this.$axios, 'manager/category/units', unit)).then(() => resolve()).catch(() => resolve()))
            }
        })
        await Promise.all(requests)
        await dispatch('getUnits')
    },
    async addUnit({ commit }, unit) {
        await commit('addUnit', unit)
    }
}