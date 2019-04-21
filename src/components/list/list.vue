<template>
  <v-layout ma-0 justify-center>
    <v-flex xs6>
      <v-toolbar flat color="white">
        <v-toolbar-title>Краткий вид</v-toolbar-title>

        <v-spacer></v-spacer>

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
      </v-toolbar>

      <div class="list__container">
        <div class="list__scroller">
            <v-list two-line>
                <template v-for="(item, index) in getItems">
                  <v-list-tile
                    :key="item.id"
                    avatar
                    ripple---
                  >
                    <v-list-tile-content @dblclick="editItem(item)" style="cursor: pointer">
                      <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                      <v-list-tile-sub-title class="text--primary">Статус: {{ item.status }}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>Лимит: {{ item.estimate }} Факт: {{ item.fact }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-list-tile-action-text>Приоритет: {{ item.priority }}</v-list-tile-action-text>
                      <v-icon
                        color="error"
                        @click="deleteItem(item)"
                      >
                        delete
                      </v-icon>
                    </v-list-tile-action>

                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < getItems.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list>
          </div>
        </div>
    </v-flex>
  </v-layout>
</template>


<script>

  import FormTask from './../forms/form-task'

  export default {

    name: 'task-list',

    components: {

      'form-task': FormTask,

    },

    data: () => ({

      dialog: false,
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

    }),

    computed: {

      getItems () {

        var arr = this.$store.getters.getTasks.filter(task => {

          return task.user_id == this.$store.getters.user_id

        })

        return arr.sort((a, b) => {

          return a.priority - b.priority

        })

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
      }
    },

    created () {},

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

<style>
.list__container {

    flex: 1;
    overflow: auto;
    position: relative;
    margin-right: -4px;
    overflow-y: scroll;
    width: 100%;
    min-height: 500px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: #f5f5f5;
    box-sizing: border-box;

}

.list__container::-webkit-scrollbar-track {

    -webkit-box-shadow: inset 0 0 4px alpha(#000, .01);
    background-color: #F5F5F5;
}
.list__container::-webkit-scrollbar {

    width: 4px;
    background-color: #F5F5F5
}
.list__container::-webkit-scrollbar-thumb {

    background-color: alpha(#000, .2);
}
.list__container:hover,
.list__container:focus {

    visibility: visible
}

.list__scroller {

    position: absolute;
    overflow-y: auto;

    width: 100%;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    visibility: visible;

    opacity: 1;
    transition: opacity .7s;

}

.list__scroller.list__scroller_undroppable {

    opacity: .3

}
</style>
