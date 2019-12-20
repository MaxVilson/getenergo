<template>
    <div class="parser">
        <label :for="id"></label>
        <input :id="id"
            type="file"
            @change="onUpload">
        <slot/>
    </div>
</template>

<script>
import Papa from 'papaparse'

export default {
    props: {
        value: { type: Array, default: () => { return [] } },
        id: { type: String, default: 'input-parser' },
    },
    methods: {
        onUpload(event) {
            
            if (event.target.files && event.target.files[0]) {
                let reader = reader = new FileReader()
                const file = event.target.files[0]
                reader.readAsText(file, 'CP1251')
                reader.onload = result => {
                    const csv = Papa.parse(result.target.result, { skipEmptyLines: true })

                    let data = csv.data
                    let headers = []
                    let rows = []

                    if (csv.errors.length) {
                        this.$emit('error', csv.errors)
                    }

                    if (data.length) {
                        data[0].forEach(item => {
                            headers.push(item)
                        })

                        data.splice(0, 1)

                        data.forEach(item => {
                            let row = {}

                            item.forEach((value, index) => {
                                row[headers[index]] = value
                            })

                            rows.push(row)
                        })

                        this.$emit('input', rows)
                    }
                }
            } else {
                this.$emit('input', [])
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