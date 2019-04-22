import test_tasks from '@/assets/data/tasks.js'

import firebase from 'firebase/app'

export default {

  state: [],

  mutations: {

    LOAD_TASKS (state, data) {

        data.forEach(task => {state.push(task)})

    },

    ADD_TASK (state, data) {

        state.push(data)

    },

    CHANGE_TASK (state, {data, index}) {

        state.splice(index, 1, data)

    },

    REMOVE_TASK (state, index) {

        state.splice(index, 1)

    },

    CLEAR_STATE (state) {

      state = []

    },

  },

  actions: {

    async loadTasks ({ commit, state }) {

        try {

          const baseTask = await firebase.database().ref('tasks').once('value')
          const baseTasks = baseTask.val()
          console.log('tasks loaded on tasks store', baseTasks)

          commit('CLEAR_STATE')
          commit('LOAD_TASKS', baseTasks)

          return baseTasks

        }
        catch (error) {

          throw error

        }
    },

    async addTask ({ commit, getters }, data) {

        try {

          var tasks = getters.getTasks
          await firebase.database().ref('tasks').child(tasks.length).set(data)
          commit('ADD_TASK', data)

        }
        catch (error) {

          throw error

        }

    },

    async changeTask ({ commit, state, getters }, data) {

      var tasks = getters.getTasks
      var taskIndex
      tasks.forEach((item, index) => {
        if(item.id == data.id) {
          taskIndex = index
        }
      })
      try {

        await firebase.database().ref('tasks').child(taskIndex).set(data)

      }
      catch (error) {

        throw error

      }

    },

    async removeTask ({ commit, state, getters }, data) {

      var tasks = getters.getTasks
      var taskIndex
      tasks.forEach((item, index) => {
        if(item.id == data.id) {
          taskIndex = index
        }
      })
      try {

        await firebase.database().ref('tasks').child(taskIndex).remove()
        commit('REMOVE_TASK', taskIndex)

      }
      catch (error) {

        throw error

      }

    },

  },

  getters: {

    getTasks (state) {

        return state

    },

  }

}
