<template>

    <div class="kanban-column">

        <div class="kanban-column__heading no-select">

            <v-toolbar flat dense class="z-index-3 transparent">

                <v-toolbar-title class="px-1 primary--text" style="background-color: #f5f5f5">{{ name }}</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-flex xs5 pa-0>
                  <v-btn v-if="index == 0" block color="primary" class=" ma-0" @click="dialog = !dialog">Новая задача</v-btn>
                </v-flex>
            </v-toolbar>

        </div>

        <div
            class="kanban-column__container"
        >

            <div class="kanban-column__scroller"
                :data-id="id"
                :data-index="index"
                :id="'container-id-' + id"
            >

                <dnd-list

                    class="kanban-column__dnd-list scroll-me"

                    drag-class="kanban-column__card_drag"
                    drop-class="kanban-column__card_dropped"

                    @drop="onDrop($event)"

                    :get-child-payload="getChildPayload"
                    :should-animate-drop="shouldAnimateDrop"
                    :should-accept-drop="shouldAcceptDrop"

                >

                    <dnd-item
                        v-for="card in cardList"
                        :key="card.id"
                        class="kanban-column__dnd-item"
                        :data-id="card.id"
                        :data-column-id="id"
                        :id="'card-id-' + card.id"
                        @click="dialog = !dialog"
                    >

                        <kanban-card
                          :data="card"
                          @edit="(payload) => editItem(payload)"
                        />

                    </dnd-item>

                </dnd-list>

            </div>

        </div>

        <v-dialog v-model="dialog" v-if="dialog" max-width="600px">

          <form-task
            :id="editedId"
            :item="editedItem"

            @close="close"
            @deleted="(payload) => deleteItem(payload)"
            @changed="(payload) => changeItem(payload)"
            @created="(payload) => createItem(payload)"
          />

        </v-dialog>

    </div>

</template>

<script>

    import KanbanCard from './kanban-card'
    import FormTask from './../forms/form-task'
    import { Container, Draggable } from "vue-smooth-dnd"


    export default {

        name: 'kanban-column',

        props: {

            data: {

                  type: Array,
                  default: () => ([])

              },

            id: Number,

            index: Number,

            name: String
        },

        components: {

            'kanban-card': KanbanCard,
            'form-task': FormTask,
            'dnd-list': Container,
            'dnd-item': Draggable//,

        },

        data () {

            return {

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

            }

        },

        computed: {

            cardList () {

                return this.data.filter(task => {

                  return task.status == this.id

                })

            },

        },

        watch: {

          dialog (val) {
            val || this.close()
          },

        },

        created: function () {},

        methods: {

            onDrop: function (dropResult) {
                const { removedIndex, addedIndex, payload, droppedElement } = dropResult

                if (removedIndex !== null && addedIndex !== null) {

                    return false

                }

                if (addedIndex !== null) {

                    this.$emit('moved', {
                      id: payload.id,
                      status: this.id
                    })

                }

            },

            getChildPayload: function (index) {

                let _tasks = this.data.filter(task => {

                  return task.status == this.id

                })

                return _tasks[index]

            },

            shouldAnimateDrop: function (sourceContainerOptions, payload) {

                return true

            },

            shouldAcceptDrop: function (sourceContainerOptions, payload) {

                return true

            },

            editItem: function (item) {

              this.editedId = item.id
              this.editedItem = Object.assign({}, item)
              this.dialog = true

            },

            deleteItem: function (item) {

              this.$emit('deleted', item)
              this.close()

            },

            changeItem: function (item) {

              this.$emit('changed', item)
              this.close()

            },

            createItem: function (item) {

              this.$emit('created', item)
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

    .kanban-column {

        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        display: flex;
        flex: 316px 0 0;
        min-height: 0px;
        padding: 0 4px;
        box-sizing: border-box;
    }

    .kanban-column__container {

        flex: 1;
        overflow: auto;
        position: relative;
        margin-right: -4px;
        overflow-y: scroll;
        width: 100%;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        background-color: #f5f5f5;
        box-sizing: border-box;

    }

    .kanban-column__container::-webkit-scrollbar-track {

        -webkit-box-shadow: inset 0 0 4px alpha(#000, .01);
        background-color: #F5F5F5;
    }
    .kanban-column__container::-webkit-scrollbar {

        width: 4px;
        background-color: #F5F5F5
    }
    .kanban-column__container::-webkit-scrollbar-thumb {

        background-color: alpha(#000, .2);
    }
    .kanban-column__container:hover,
    .kanban-column__container:focus {

        visibility: visible
    }

    .kanban-column__scroller {

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

    .kanban-column__scroller.kanban-column__scroller_undroppable {

        opacity: .3

    }

    .kanban-column__dnd-list {

        height: 100%;

    }

    .kanban-column__dnd-item {

        box-sizing: border-box;
        padding: 0px 8px 16px 8px;
    }

    .kanban-column__dnd-item:first-child {

        padding-top: 4px;

    }

    .kanban-column__dnd-item.scrolled .kanban-card.v-card--raised {

        box-shadow: 0 3px 3px -2px rgba(25,118,211,.2), 0 3px 4px 0 rgba(25,118,211,.14), 0 1px 8px 0 rgba(25,118,211,.12);

    }

    .kanban-column__dnd-item.scrolled .kanban-card.v-card--raised.v-card--hover:hover {

        box-shadow: 0 5px 5px -3px rgba(25,118,211,.2), 0 8px 10px 1px rgba(25,118,211,.14), 0 3px 14px 2px rgba(25,118,211,.12);

    }

    .kanban-column__overlay {

        display: flex;
        flex-direction: column;

        align-items: center;
        align-content: center;
        justify-content: center;

        position: absolute;
        z-index: 10;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: rgba(245,245,245, 0.6);

    }

    .kanban-column__progress {

        opacity: .7;

    }

    .kanban-column__card_drag {

        transition: transform 0.18s ease;
        transform: rotateZ(5deg);

    }

    .kanban-column__card_dropped {

        transition: transform 0.18s ease-in-out;
        transform: rotateZ(0deg);

    }

    .kanban-column__heading-name-DELETE {

        display: inline-block;
        position: relative;
        z-index: 3;

        font-size: 18px;
        line-height: 25px;
        font-weight: bold;

        padding: 0 4px;

        background-color: #f5f5f5;

        color: #333;

    }

    .kanban-column__subheading {

        display: block;
        position: relative;
        width: 100%;

        padding: 0 8px 16px 8px;
        background-color: #f5f5f5;

    }

</style>

<style lang="stylus">

    .kanban-column

        &__heading

            display: block
            position: relative

            background-color: #f5f5f5

            border-top-left-radius: 8px
            border-top-right-radius: 8px

            .v-avatar

                flex-shrink: 0

            .v-toolbar__title:not(:first-child)

                margin-left: 8px

            .v-toolbar__content,
            .v-toolbar__extension

                padding: 0 16px 0 8px

</style>
