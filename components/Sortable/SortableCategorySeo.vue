<template>
    <div class="sortable-category-seo">
        <form @submit.prevent="onSubmit" class="category__form">
            <div class="category__form-wrapper">
                <div class="form-group category__control">
                    <form-group-title title="Категория" @click="isHidden = !isHidden"/>
                    <transition-expand>
                        <div v-if="!isHidden">
                            <input-base id="input-text" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text2" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text3" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text4" class="input-text category__control mt-0" label="Название категории"/> 
                        </div>
                    </transition-expand>                
                </div>

                <div class="form-group category__control">
                    <form-group-title title="Эталон" @click="isHidden2 = !isHidden2"/>
                    <transition-expand>
                        <div v-if="!isHidden2">
                           <input-base id="input-text5" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text6" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text7" class="input-text category__control mt-0" label="Название категории"/> 
                            <input-base id="input-text8" class="input-text category__control mt-0" label="Название категории"/> 
                        </div>
                    </transition-expand>
                </div>
                <v-btn class="btn btn-transparent btn-block btn_disable btn_create category__btn-create"
                    type="submit">Сохранить</v-btn>
            </div>
        </form>
    </div>
</template>

<script>
    import InputBase from '@/components/InputBase'
    import VBtn from '@/components/VBtn'
    import FormGroupTitle from '@/components/FormGroupTitle'

    export default {
        name: 'sortable-category-seo',
        data() {
            return {
                isHidden: false,
                isHidden2: false,
            }
        }
    }
</script>