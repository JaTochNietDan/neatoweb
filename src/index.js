import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import Login from '../src/login.vue';
import Loading from '../src/loading.vue';
import Home from '../src/home.vue';

var app = new Vue({
  el: '#page',
  data: {
    user: new Neato.User(),
	currentView: Loading,
	robot: {},
  },
  created: function() {
	self = this;
	this.user.isConnected().done(function () {
		self.currentView = Home;
	}).fail(function (test) {
		self.currentView = Login;
	});
  },
  computed: {
    ViewComponent () {
      return this.currentView;
    }
  },
  render (h) { return h(this.ViewComponent) }
});