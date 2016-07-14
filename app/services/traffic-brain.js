import Ember from 'ember';

export default Ember.Service.extend({

	/**
	* {Number} Full cycle duration in seconds.
	*/
	cycleDuration: 5 * 60,
	
	/**
	* {Number} Duration of the yellow light in seconds.
	*/
	warningDuration: 30,
	
	
	/**
	* The lights operate in a linear cycle.
	* Therefore we specify the desired cycle here.
	* 'green' can only change to 'yellow',
	* 'yellow' can only change to 'red' and
	* 'red' can only change to 'green'.
	* {Array.<String>}
	*/
	cycle: Ember.computed(function() {
		return ['green', 'yellow', 'red'];
	}),

	/**
	* {Array.<Object>} The state of lights with intial values.
	*/
	lights: Ember.computed(function() {
		return [
			{
				name: 'NS',
				color: 'green'
			},
			{
				name: 'WE',
				color: 'red'
			}
		];
	}),
	
	/**
	* A runner that will output the state of the lights.
	* @param {Number} maxDuration in seconds
	* @param {Number} cycleDuration in seconds
	* @param {Number} warningDuration in seconds
	*/
	runFor(maxDuration, cycleDuration = this.get('cycleDuration'), warningDuration = this.get('warningDuration')) {
		var currentDuration = 0;
		while(currentDuration <= maxDuration) {
			this.check(currentDuration, cycleDuration, warningDuration);
			currentDuration++;
		}
	},

	/**
	* @param {Number} duration in seconds
	* @param {Number} cycleDuration in seconds
	* @param {Number} warningDuration in seconds
	*/
	check(duration, cycleDuration, warningDuration) {
		if (duration === 0) {
			this.outputState(duration);
			return;
		}
		
		switch(duration % cycleDuration) {
			case 0:
				this.change(['red', 'yellow']);
				this.outputState(duration);
				break;
			case cycleDuration - warningDuration:
				this.change(['green']);
				this.outputState(duration);
				break;
		}
	},

	/**
	* Changes the specified colors to the next stage within the cycle.
	* @param {Array.<String>} colorsToChange An array of colors that needs to change
	*/
	change(colorsToChange) {
		var cycle = this.get('cycle');
		var lights = this.get('lights');
	
		lights.forEach(trafficLight => {
			if (colorsToChange.indexOf(trafficLight.color) !== -1) {
				trafficLight.color = cycle[cycle.indexOf(trafficLight.color) + 1] || cycle[0];
			}
		});
	},
	
	/**
	* Output to the console the state of the lights
	* @param {Number} seconds Used to create readable output
	*/
	outputState(seconds) {
		return console.log(seconds / 60, 'minutes', this.get('lights').map(light => light.name + ':' + light.color));
	}
	

});
