<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Подробный вид</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-layout ma-0 justify-end align-baseline>
          <v-flex xs4 pr-2>
              <v-select
                v-model="filtered"
                :items="statuses"
                item-text="text"
                item-value="val"
                label---="Filter"
              ></v-select>
          </v-flex>

          <v-flex xs4 pr-2>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
          </v-flex>

          <v-flex xs5 pa-0>
            <v-btn block color="primary" class="mb-2" @click="dialog = !dialog">Новая задача</v-btn>
          </v-flex>

          <v-dialog v-if="dialog" v-model="dialog" max-width="600px">

            <form-task
              :id="editedId"
              :item="editedItem"

              @close="close"
              @deleted="(payload) => deleteItem(payload)"
              @changed="(payload) => changeItem(payload)"
              @created="(payload) => createItem(payload)"
            />

          </v-dialog>
        </v-layout>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="getItems"
      :search="search"
      class="elevation-1"
      hide-actions---
    >

      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.priority }}</td>
        <td class="text-xs-center">{{ props.item.status }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-right">{{ props.item.fact }}</td>
        <td class="text-xs-right">{{ props.item.estimate }}</td>
        <td class="text-xs-right">{{ moment(props.item.date_start).format('DD-MM-YYYY') }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>


<script>

  import FormTask from './../forms/form-task'

  export default {

    name: 'task-table',

    components: {

      'form-task': FormTask,

    },

    data: () => ({
      search: null,
      filtered: 0,
      dialog: false,
      headers: [
        { text: 'Название', value: 'name', align: 'left', sortable: false },
        { text: 'Приоритет', value: 'priority' },
        { text: 'Статус', value: 'status' },
        { text: 'Описание', value: 'description', align: 'left', sortable: false },
        { text: 'Факт', value: 'fact', align: 'right' },
        { text: 'Лимит', value: 'estimate', align: 'right' },
        { text: 'Дата создания', value: 'date_start', align: 'right' },
        { text: 'Действия', value: 'name', sortable: false }
      ],
      editedId: -1,
      editedItem: {
        id: null,
        user_id: null,
        priority: null,
        status: 1,
        name: '',
        description: '',
        estimate: null,
        fact: null,
        date_start: '',
      },
      defaultItem: {
        id: null,
        user_id: null,
        priority: null,
        status: 1,
        name: '',
        description: '',
        estimate: null,
        fact: null,
        date_start: '',
      },
      statuses: [
        {
          val: 0,
          text: "все"
        },
        {
          val: 1,
          text: "создана"
        },
        {
          val: 2,
          text: "в работе"
        },
        {
          val: 3,
          text: "завершена"
        }
      ],
    }),

    computed: {

      getItems () {

        var arr = this.$store.getters.getTasks.filter(task => {

          return task.user_id == this.$store.getters.user_id

        })

        return (this.filtered != 0) ? arr.filter(task => {return task.status == this.filtered}) : arr

      },

    },

    filters: {

      formatDate: function (val) {

          let $_date = val.split('-').reverse().join('.')
          return $_date

      }
    },

    watch: {

      dialog (val) {
        val || this.close()
      },

    },

    methods: {

      editItem: function (item) {

        this.editedId = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true

      },

      deleteItem: function (payload) {

        confirm('Уверены?') && this.$store.dispatch('removeTask', payload)
        this.close()

      },

      changeItem: function (payload) {

        this.$store.dispatch('changeTask', payload)
        this.close()

      },

      createItem: function (payload) {

        this.$store.dispatch('addTask', payload)
        this.close()

      },

      close: function () {
          this.dialog = false
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedId = -1
      },
    }
  }
</script>
