import Ember from 'ember';

export default Ember.Route.extend({

	trafficBrain: Ember.inject.service(),
	
	startTrafficMonitor: Ember.on('activate', function() {
		this.get('trafficBrain').runFor(30 * 60); // 30 min in seconds
	})

});
