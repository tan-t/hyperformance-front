<template>
  <v-card>
    <v-card-title>
      {{title}}
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
      >
      <template slot="items" slot-scope="props">
        <td v-for="header in headers">

          <v-container v-if="!header.type">
            <v-container v-if="header.editable">
              <v-edit-dialog
              @open="tmp = props.item[header.value]"
              @save="props.item[header.value] = tmp || props.item[header.value]"
              large
              lazy
              >
              <div>{{props.item[header.value]}}</div>
              <div slot="input" class="mt-3 title">Update</div>
              <v-text-field
              slot="input"
              label="Edit"
              v-model="tmp"
              single-line
              counter
              autofocus
              :rules="header.rules"
              ></v-text-field>
            </v-edit-dialog>
          </v-container>
          <v-container v-if="!header.editable">
            {{props.item[header.value]}}
          </v-container>
        </v-container>

        <v-container v-if="header.type == 'TAG'">
          <abstract-tag :tag="props.item[header.value]" :tagMap="header.tagMap"></abstract-tag>
        </v-container>

        <v-container v-if="header.type == 'ACTION'">
          <v-btn @click="onClickAction" :data-id="props.item[header.actionId]">{{header.actionName}}</v-btn>
        </v-container>

        </td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>


<script>
import AbstractTag from '@/components/bt/misc/AbstractTag'

  export default {
    name:'AbstractGrid',
    props:['headers','items','title'],
    components:{
      AbstractTag
    },
    methods: {
      onClickAction: function(e) {
        this.$emit('clickaction',e);
      }
    },
    data () {
      return {
        tmp: '',
        search: '',
        pagination: {},
      }
    }
  }
</script>
