/* global Vue, Vuex, axios, FileReader, rxjs */
;(function () {
  const { from } = rxjs;
  const { map, tap } = rxjs.operators;

  Vue.use(Vuex)

  function randomId () {
    return Math.random()
      .toString()
      .substr(2, 10)
  }

  const store = new Vuex.Store({
    state: {
      loading: true,
      todos: [],
      newTodo: ''
    },
    getters: {
      newTodo: state => state.newTodo,
      todos: state => state.todos
    },
    mutations: {
      SET_LOADING (state, flag) {
        state.loading = flag
      },
      SET_TODOS (state, todos) {
        state.todos = todos
      },
      SET_NEW_TODO (state, todo) {
        state.newTodo = todo
      },
      ADD_TODO (state, todoObject) {
        console.log('add todo', todoObject)
        state.todos.push(todoObject)
      },
      REMOVE_TODO (state, todo) {
        var todos = state.todos
        todos.splice(todos.indexOf(todo), 1)
      },
      CLEAR_NEW_TODO (state) {
        state.newTodo = ''
        console.log('clearing new todo')
      }
    },
    actions: {
      loadTodos ({ commit }) {
        commit('SET_LOADING', true)
        from(
          axios
            .get('/todos')
        )
          .pipe(
            map(r => r.data),
            tap(todos => {
              commit('SET_TODOS', todos)
              commit('SET_LOADING', false)
            })
          )
          .subscribe();
      },
      setNewTodo ({ commit }, todo) {
        commit('SET_NEW_TODO', todo)
      },
      addTodo ({ commit, state }) {
        if (!state.newTodo) {
          // do not add empty todos
          return
        }
        const todo = {
          title: state.newTodo,
          completed: false,
          id: randomId()
        }
        from(
          axios.post('/todos', todo)
        )
          .pipe(
            tap(_ => {
              commit('ADD_TODO', todo)
            })
          )
          .subscribe();
      },
      removeTodo ({ commit }, todo) {
        from(
          axios.delete(`/todos/${todo.id}`)
        ).pipe(
          tap(_ => {
            console.log('removed todo', todo.id, 'from the server')
            commit('REMOVE_TODO', todo)
          })
        )
        .subscribe();
      },
      clearNewTodo ({ commit }) {
        commit('CLEAR_NEW_TODO')
      }
    }
  })

  // app Vue instance
  const app = new Vue({
    store,
    data: {
      file: null
    },
    el: '.todoapp',

    created () {
      this.$store.dispatch('loadTodos')
    },

    // computed properties
    // https://vuejs.org/guide/computed.html
    computed: {
      newTodo () {
        return this.$store.getters.newTodo
      },
      todos () {
        return this.$store.getters.todos
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
      setNewTodo (e) {
        this.$store.dispatch('setNewTodo', e.target.value)
      },

      addTodo (e) {
        e.target.value = ''
        this.$store.dispatch('addTodo')
        this.$store.dispatch('clearNewTodo')
      },

      removeTodo (todo) {
        this.$store.dispatch('removeTodo', todo)
      },

      uploadTodos (e) {
        // either set component data.file to test file
        // or read it off the native event
        const f = this.file || e.target.files[0]
        const reader = new FileReader()
        reader.onload = e => {
          const list = JSON.parse(e.target.result)
          list.forEach(todo => {
            this.$store.commit('ADD_TODO', todo)
          })
        }
        reader.readAsText(f)
      }
    }
  })

  window.app = app
})()
