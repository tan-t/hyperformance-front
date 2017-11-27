<template>
      <v-select
      :label="label"
      v-model="model"
      :items="items"
      :loading="loading"
      item-text="label"
      item-value="value"
      :disabled="disabled"
      :rules="rules"
      :error-messages="errors"
      :required="required"
      :search-input.sync="search"
      autocomplete
      @change="updateValue"
      @input="updateValue"
      ></v-select>
</template>

<script>
  export default {
    name: 'SearchSelect',
    props: [
      'defaultitems','model','query','label','rules','errors','required','disabled'
    ],
    watch: {
      search (val) {
        val && this.querySelections(val)
      }
    },
    computed:{
      items () {
        if(this.fetchedItems.length > 0){
          return this.fetchedItems;
        }
        return this.defaultitems;
      }
    },
    methods: {
      querySelections (v) {
        this.loading = true;
        this.query(v).then(records=>{
          this.fetchedItems = records;
          this.loading = false;
        });
      },
      updateValue (e) {
        this.$emit('change',this.model);
      }
    },
    data() {
      return {
        loading:false,
        search: null,
        formValid: this.valid,
        fetchedItems:[]
      }
    }
  }
</script>
