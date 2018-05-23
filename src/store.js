import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import swal from 'sweetalert'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    articles: '',
    user: '',
    error: '',
    errorLog: '',
    artProf:'',
    singArt: ''
  },
  mutations: {
    setError (state, payload) {
      console.log('commit', payload)
      state.error = payload
    },
    setErrorLog (state, payload) {
      console.log('commit', payload)
      state.errorLog = payload
    },
    setArticles (state, payload) {
      state.artProf = payload
    },
    setArticlesHome (state, payload) {
      state.articles = payload
    },
    setOneArticle (state, payload) {
      state.singArt = payload
    }
  },
  actions: {
    signup: function (context, payload) {
      console.log(payload)
      axios.post('http://localhost:3000/users/signup', payload)
        .then(response => {
          console.log('success', response)
          swal('successfuly registered')
        })
        .catch(function (err) {
          console.log(err.response.data.message)
          let errorMsg = err.response.data.message
          context.commit('setError', errorMsg)
        })
    },
    signin: function (context, payload) {
      console.log(payload)
      axios.post('http://localhost:3000/users/signin', payload)
        .then(response => {
          console.log('success', response.data.dataUser.username)
          let token = response.data.token
          let userblog = response.data.dataUser.username
          localStorage.setItem('blog-username', userblog)
          localStorage.setItem('blog-token', token)
          swal('successfuly logged in')
          window.location.reload(true)
        })
        .catch(function (err) {
          console.log(err.response.data.message)
          let errorMsg = err.response.data.message
          context.commit('setErrorLog', errorMsg)
        })
    },
    upload: function (context, payload) {
      let headers = payload.headers
      axios.post('http://localhost:3000/articles', payload.body, {headers})
      .then(response => {
        console.log('success', response.data)
        swal('successfuly created new article')
        this.$store.dispatch('getSingpos', headers)
      })
      .catch(function (err) {
        console.log(err)
      })
    },
    getSingpos: function (context, payload) {
      console.log(payload)
      axios.get('http://localhost:3000/articles/profile', {headers: payload})
      .then(response => {
        console.log('success', response.data)
        context.commit('setArticles', response.data.data)
      })
      .catch(function (err) {
        console.log(err)
      })
    },
    deleteArticle: function (context, payload) {
      console.log(payload)
      axios.delete(`http://localhost:3000/articles/${payload.id}`, {headers: payload.headers})
        .then( response => {
            swal('successfuly deleted article')    
            window.location.reload(true);      
        })
        .catch( err => {
            // this.error = err.response.data.message
        })
    },
    getAllPost: function (context, payload) {
      console.log('ke home action')
      axios.get('http://localhost:3000/articles/home')
      .then(response => {
        console.log('success', response.data)
        context.commit('setArticlesHome', response.data.data)
      })
      .catch(function (err) {
        console.log(err)
      })
    },
    updateArticle: function (context, payload) {
      console.log(payload)
      axios.put(`http://localhost:3000/articles/${payload.id}`, payload.body, {headers: payload.headers})
      .then(response => {
        console.log('success', response.data)
        swal('successfuly updated article') 
        // context.commit('setArticlesHome', response.data.data)
      })
      .catch(function (err) {
        console.log(err)
      })
    },
    search: function (context, payload) {
      axios.get(`http://localhost:3000/articles/search?title=${payload}`)
      .then(response => {
        console.log('success', response.data)
        context.commit('setArticlesHome', response.data.data)
      })
      .catch(function (err) {
        console.log(err)
      })
    },
    getOneArticle (context, payload) {
      axios.get(`http://localhost:3000/articles/detail/${payload}`)
      .then(response => {
        console.log('success', response.data)
        context.commit('setOneArticle', response.data.data)
      })
      .catch(function (err) {
        console.log(err)
      })
    }
  }  
})
