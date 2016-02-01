
/* From the previous code, we notice that the sinks
are not logic nor effects. In another words it is just
helping us to make our app run. So let's abstract it away
*/

'use strict'
/***********  Logic *********************/
function main() {
	return {
  		DOM: Rx.Observable.timer(0, 1000)
    		.map( x => `Seconds elapsed ${x}`),
    	Log: Rx.Observable.timer(0, 2000)
    		.map(x => 2 * x)
	}
}
/***********  Effects *********************/
function DOMDriver(text$) {
	text$.subscribe(text => {
		const container = document.querySelector('#app')
		container.textContent = text;
	})
}

function consoleLogDriver(msg$) {
	msg$.subscribe(msg => console.log(msg))
}

/***********  Drivers *********************/
const drivers = {
	DOM: DOMDriver,
	Log: consoleLogDriver
}

function run (mainFn, drivers) {
	const sinks = mainFn();
	Object.keys(drivers).forEach( key => {
		drivers[key](sinks[key])
	})
}

run(main, drivers) // => if using JSbin you'll see the output on both the page and console

/* You have probably noticed that hardcoding the methods
*  somehow makes it difficult for us to update our logic and effects
*  (For example getting rid of either DOM or Log)
*  ----------
*  To make our job easier instead of hard-coding the effects inside run
*  We can pass each logic to its corresponding effects.
*  => experience in functional programming helps here.
* **************
* Stalz used the variable name driver for illustration: (middleware between hardware and software)
*/