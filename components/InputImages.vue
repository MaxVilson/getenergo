<template>
    <div class="parser">
        <label for="input-images"></label>
        <input id="input-images"
            multiple
            type="file"
            accept="image/png, image/jpeg"
            @change="onUpload">
        <slot/>
    </div>
</template>

<script>
import API from '@/utils/api'

export default {
    props: {
        value: { type: Array, default: () => { return [] } },
    },
    methods: {
        async onUpload(event) {
            if (event.target.files) {
                let formData = new FormData()
                for (const index in event.target.files) {
                    if (event.target.files.hasOwnProperty(index)) {
                        formData.append('images[]', event.target.files[index])
                    }
                }
                const response = await this.$axios.post('/api/manager/upload/model-images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                this.$emit('uploaded', response.data) 
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.parser {
    position: relative;
    cursor: pointer;

    input {
        visibility: hidden;
        opacity: 0;
        width: 0;
        height: 0;
    }

    label {
        cursor: pointer;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
}
</style>