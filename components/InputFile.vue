<template>
    <div class="input-file" :class="{ 'input-file_active': image.length }">
        <div class="input-file__wrapper">
            <div class="input-file__img" v-for="(item, index) in image" :key="index">
                <img :src="item" alt="">
                <button type="button" 
                        class="input-file__btn input-file__refresh"
                        @click="$refs.inputFile.click()">
                            <icon-base icon="refresh"/>
                </button>
                <button type="button" 
                        class="input-file__btn input-file__delete"
                        @click="onDelete(index)">
                            <icon-base icon="delete"/>  
                </button>
            </div>
            
            <div v-if="max > 1">
                <div v-show="image.length <= 2" class="input-file__text">
                    <slot name="uploadTitle">{{ uploadTitle }}</slot>
                    <div class="input-file__subtext">(перетащить)</div>
                </div>
                <div class="input-file__text-second">
                    <div v-show="image.length > 0 && image.length <= 2">
                        <slot name="uploadText">{{ uploadText }}</slot>
                    </div>
                    <div v-show="image.length > 2" style="textAlign: left;">
                        Загружено максимальное количество фотографий: 3 Для замены или удаления наведите на фотографию
                    </div>
                </div>
            </div>

            <div v-else>
                <div v-show="image.length == 0" class="input-file__text">
                    <slot name="uploadTitle">{{ uploadTitle }}</slot>
                    <div class="input-file__subtext">(перетащить)</div>
                </div>
                <div v-show="image.length > 0" class="input-file__text-second">
                    <slot name="uploadText">{{ uploadText }}</slot>
                </div>
            </div>

            <input type="file" class="input-file__input"
                :multiple="max > 1"
                ref="inputFile"
                @change="onUpload"
                accept="image/png, image/jpeg">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'input-file',
        data() {
            return {
                image: this.max == 1 ? (this.value ? [this.value] : []) : this.value,
                imageError: [],
                uploadTitle: 'Загрузите фотографии',
                uploadText: 'Загружено максимальное количество фотографий: 1 Для замены или удаления наведите на фотографию',
            }
        },
        props: {
            value: { type: String | Object, default: () => { return [] } },
            max: { type: Number, default: 1 }
        },
        methods: {
            onUpload(event) {
                this.imageError = []

                if (event.target.files) {

                    if (this.max == 1) {
                        this.image = []
                    }

                    for (let i = 0; i < event.target.files.length; i++) {
                        if (this.max <= i || this.image.length >= this.max) {
                            break
                        }

                        if (event.target.files[i]) {
                            let reader = new FileReader()
                            let image = new Image()
                            reader.readAsDataURL(event.target.files[i])

                            reader.onload = e => {
                                image.src = e.target.result
                            }

                            image.onload = e => {
                                if (image.width < 100 || image.height < 100) {
                                    this.imageError = 'Размер изображения меньше 100x100'
                                    return
                                }

                                if (image.width > 4000 || image.height > 4000) {
                                    this.imageError = 'Размер изображения больше 4000x4000'
                                    return
                                }

                                this.image.push(image.src)
                            }
                        }
                    }
                }
            },
            onDelete(index) {
                this.image.splice(index, 1)
                this.$refs.inputFile.value = ''
            }
        },
        watch: {
            image() {
                this.$emit('input', this.max > 1 ? this.image : (this.image.length ? this.image[0] : ''))
            }
        }
    }
</script>

<style lang="scss">
    .input-file {
        position: relative;
        width: 100%;
        height: 120px;
        border: 1px dashed rgba(0, 146, 255, 0.2);
        background: linear-gradient(0deg, #F3F9FD, #F3F9FD), #E8F5FF;
        font-size: 0;
        cursor: pointer;

        &__wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 10px 28px;
            margin-bottom: 0;
        }

        &__img {
            position: relative;
            flex: 0 0 auto;
            margin-right: 12px;
            width: 100px;
            height: 100px;
            border-radius: 4px;
            background-color: $white;

            &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                width: 100%;
                height: 100%;
                border-radius: 4px;
                background-color: rgba(0, 0, 0, .2);
                opacity: 0;
                transition: all .15s;
            }

            &:hover {
                & .input-file__btn {
                    display: flex;
                    transition: all .15s;
                    opacity: 1;
                }

                &:after {
                    opacity: 1;
                    transition: all .15s;
                }
            }

            & img {
                width: 100%;
                height: 100%;
                max-width: 100%;
                background-size: cover;
            }
        }

        &__btn {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 50%;
            z-index: 5;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 50%;
            background-color: $white;
            transform: translateY(-50%);
            transition: all .15s;
            opacity: 0;

            & .icon {
                width: 14px;
                height: 14px;
            }
        }

        &__refresh {
            left: 14px;
        }

        &__delete {
            right: 14px;
        }

        &__text {
            font-size: (14 / 16 + rem);
            font-weight: 500;
            text-align: center;
            color: $blue;

            &-second {
                font-size: (13 / 16 + rem);
                font-weight: 400;
                color: $disable;
            }
        }

        &__subtext {
            color: #7AA8CA;
        }

        &__input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;

            &::-webkit-file-upload-button {
                visibility: hidden;
            }
        }

        &_multiple {

            & .input-file__wrapper {
                padding-right: 16px;
                padding-left: 16px;
            }
            
            & .input-file__img {
                margin-right: 8px;
                width: 80px;
                height: 80%;
            }

            & .input-file__text-second {
                font-size: (12 / 16 + rem);
                text-align: center;
            }

            & .input-file__text-second {
                margin-left: 6px;
            }
        }
    }
</style>