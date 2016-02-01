'use strict';
// logic
Rx.Observable.timer(0, 1000) // increment timer by 1 at each second
	.map( x => `Seconds elapsed ${x}`)
	// effects
	.subscribe( text => {
		const container = document.querySelector("#app")
		container.textContent = text
	})

/* Main goal of using Cycle.js
=> separating logic from effects

logic: the arrangements of your orders (functional)
---------------
Effects => anything that changes the external world. (imperative)

---------------
The guiding principle is that we want to push subscribes (effects) as far away from our logic (app).
In another words, we want our effects to live in the framework (cyclejs). Thus the developer will only need to take care of the logic
*/