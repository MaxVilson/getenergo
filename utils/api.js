const config = {
    headers: { Accept: 'application/json' }
}

export default {
    async head(axios, path, query = {}) {
        const head = await axios.get('/api/' + path, Object.assign({}, { params: query }, config))

        return {
            page: parseInt(head.headers['x-pagination-current-page']),
            totalPages: Math.ceil(parseInt(head.headers['x-pagination-total-count']) / parseInt(head.headers['x-pagination-per-page'])),
            limit: parseInt(head.headers['x-pagination-per-page']),
        }
    },
    async get(axios, path, query = {}) {
        try {
            return await axios.$get('/api/' + path, Object.assign({}, { params: query }, config))
        } catch (error) {
            throw error.response
        }
    },
    async create(axios, path, data) {
        try {
            return await axios.$post('/api/' + path, data, config)
        } catch (error) {
            throw error.response
        }
    },
    async update(axios, path, data) {
        try {
            return await axios.$patch('/api/' + path, data, config)
        } catch (error) {
            throw error.response
        }
    },
    async delete(axios, path) {
        try {
            return await axios.$delete('/api/' + path, config)
        } catch (error) {
            throw error.response
        }
    },
    async updloadBase64Image(axios, image) {
        try {
            return await axios.$post('/api/manager/upload/image-base64', { image: image }, config)
        } catch (error) {
            throw error.response
        }
    }
}