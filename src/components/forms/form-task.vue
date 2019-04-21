<template>

  <v-form
    ref="task_form"
    v-model="valid"
    lazy-validation
  >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column wrap>
              <v-flex xs12 sm6 md4>

                <v-text-field
                  v-model="getItem.name"
                  label="Наименование"
                  :rules=[rules.required]
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6 md4>
                <v-textarea
                  outline
                  v-model="getItem.description"
                  label="Описание"
                  :rules=[rules.required]
                  required
                ></v-textarea>
              </v-flex>

              <v-layout ma-0 justify-space-brtween>
                  <v-flex>
                    <v-autocomplete
                      v-model="getItem.priority"
                      label="Приоритет"
                      :rules=[rules.required]
                      required
                      :items="priorityTypes"
                      item-text="text"
                      item-value="val"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field
                      v-model="getItem.estimate"
                      label="Лимит"
                      :rules="[rules.required, rules.isNumeric]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field
                      v-if="editedId != -1"
                      v-model="getItem.fact"
                      label="Факт"
                    ></v-text-field>
                  </v-flex>
              </v-layout>

              <v-flex xs3>
                <v-autocomplete
                  v-if="editedId != -1"
                  v-model="getItem.status"
                  label="Статус"
                  :items="getStatuses"
                  item-text="text"
                  item-value="val"
                ></v-autocomplete>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn v-if="editedId > -1" color="error" flat @click="deleteItem">Удалить</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="close">Отмена</v-btn>
          <v-btn color="primary" flat @click="validate">Сохранить</v-btn>
        </v-card-actions>

      </v-card>
    </v-form>

</template>

<script>

    export default {

        name: 'form-task',

        props: {

            item: {

                  type: Object,
                  default: {}

              },

            id: Number,
            refer: String,

        },

        data: () => ({

          valid: true,
          rules: {
            required: value => !!value || 'Пожалуйста, заполните поле',
            isNumeric: value => !isNaN(value) || 'Пожалуйста, введите числовое значение'
          },
          editedId: -1,
          editedItem: {},
          priorityTypes: [
            {
              val: 1,
              text: "Наивысший"
            },
            {
              val: 2,
              text: "Высокий"
            },
            {
              val: 3,
              text: "Средний"
            },
            {
              val: 4,
              text: "Низкий"
            },
          ],
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

        watch: {

          item (val) {
            this.setup()
          },

        },

        computed: {

            formTitle () {

              return this.editedId === -1 ? 'Новая задача' : 'Изменить задачу'

            },

            getStatuses () {

              return this.statuses.slice(1)

            },

            getItem () {

              return this.editedItem

            }

        },

        created: function () {
          console.log('EDITED ITEM', this.editedItem)
          this.setup()

        },

        methods: {

          setup: function () {

            this.editedId = this.id
            this.editedItem = this.item

          },

          validate () {

            if (this.$refs.task_form.validate()) {

              this.save()

            }

          },

          deleteItem: function () {

            this.$emit('deleted', this.editedItem)

          },

          close: function () {

              this.$emit('close')

          },

          save: function () {

            if (this.editedId > -1) {

              this.$emit('changed', this.editedItem)

            } else {

              this.editedItem.user_id = this.$store.getters.user_id
              this.editedItem.date_start = new Date()
              this.editedItem.id = new Date().getUTCMilliseconds()

              this.$emit('created', this.editedItem)

            }
            
          }

        }

    }

</script>

<style lang="stylus">


</style>
