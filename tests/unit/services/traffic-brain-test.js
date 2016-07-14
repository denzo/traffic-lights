import { moduleFor, test } from 'ember-qunit';

moduleFor('service:traffic-brain', 'Unit | Service | traffic brain', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('cycle contains red, green and yellow', function(assert) {
	var service = this.subject();
	var cycle = service.get('cycle');
 
  assert.expect(3);
  assert.ok(cycle.find(item => item === 'red'));
  assert.ok(cycle.find(item => item === 'green'));
  assert.ok(cycle.find(item => item === 'yellow'));
});

test('the initial state of lights contains red and green', function(assert) {
	var service = this.subject();
	var lights = service.get('lights');
	
	assert.expect(2);
	assert.ok(lights.find(item => item.color === 'red'));
	assert.ok(lights.find(item => item.color === 'green'));
});

test('changing lights produces desired outcome', function(assert) {
	var service = this.subject();
	var item = service.get('lights').find(item => item.color === 'green');
	
	assert.expect(3);
	
	service.change(['green']);
	assert.equal(item.color, 'yellow');
	service.change(['yellow']);
	assert.equal(item.color, 'red');
	service.change(['red']);
	assert.equal(item.color, 'green');
});

test('after a full cycle the color should switch', function(assert) {
	var service = this.subject();
	
	var cycleDuration = 5 * 60; // 5 minutes in seconds
	var warningDuration = 30; // 30 seconds to display yellow light
	
	var lights = service.get('lights');
	var red = lights.find(item => item.color === 'red');
	var green = lights.find(item => item.color === 'green');
	
	assert.expect(4);
	
	// after a full cycle the color should switch
	service.runFor(cycleDuration, cycleDuration, warningDuration);
	assert.equal(red.color, 'green');
	assert.equal(green.color, 'red');
	
	// run one more time and it should be back to the initial state
	service.runFor(cycleDuration, cycleDuration, warningDuration);
	assert.equal(red.color, 'red');
	assert.equal(green.color, 'green');
	
});

test('after a an almost full cycle the green should turn yellow', function(assert) {
	var service = this.subject();
	
	var cycleDuration = 5 * 60; // 5 minutes in seconds
	var warningDuration = 30; // 30 seconds to display yellow light
	
	var lights = service.get('lights');
	var red = lights.find(item => item.color === 'red');
	var green = lights.find(item => item.color === 'green');
	
	assert.expect(2);
	
	service.runFor(cycleDuration - warningDuration, cycleDuration, warningDuration);
	assert.equal(red.color, 'red');
	assert.equal(green.color, 'yellow');
});

