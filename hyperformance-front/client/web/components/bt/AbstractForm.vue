<template>
  <v-form v-model="formValid" ref="form" lazy-validation @change="onChange">
    <v-container v-for="field in fields" :key="field.id">
    <v-container v-if="field.type === 'TEXT'">
    <v-text-field
      :label="field.label"
      v-model="field.model"
      :disabled="disabled || !!field.disabled"
      :rules="field.rules"
      :error-messages="field.errors"
    ></v-text-field>
    </v-container>

    <v-container v-if="field.type === 'PASSWORD'">
    <v-text-field
      :label="field.label"
      v-model="field.model"
      :disabled="disabled || !!field.disabled"
      :rules="field.rules"
      hint="At least 8 characters"
      min="8"
      :append-icon="field.password_visibility ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (field.password_visibility = !field.password_visibility)"
      type="password"
      :type="!field.password_visibility ? 'password' : 'text'"
      :error-messages="field.errors"
    ></v-text-field>
    </v-container>

    <v-container v-else-if="field.type === 'SELECT'">
      <v-select
      :label="field.label"
      v-model="field.model"
      :items="field.items"
      item-text="label"
      item-value="value"
      :disabled="disabled || !!field.disabled"
      :rules="field.rules"
      :error-messages="field.errors"
      autocomplete
      ></v-select>
    </v-container>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'AbstractForm',
    props: [
      'fields', 'valid', 'disabled'
    ],
    methods: {
      onChange: function(e) {
        console.log('hoge');
      },
      validate: function() {
        return this.$refs.form.validate();
      }
    },
    data() {
      return {
        formValid: this.valid
      }
    }
  }
</script>
