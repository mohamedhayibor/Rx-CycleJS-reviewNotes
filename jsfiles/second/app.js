'use strict';
/* making the code more structural */

/*********** Logic (functional) *********************/ 
function main () {
	return Rx.Observable.timer(0, 1000)
		.map( x => `Seconds elapsed ${x}`)
}

/***********  Effects (imperative) *********************/
function DOMEffect(text$) {
	text$.subscribe( text => {
		const container = document.querySelector("#app")
		container.textContent = text
	})
}

// we get the same effect we pass main() to DOMeffect


// If we want to get a consoleLog Effect:
function consoleLogEffect(msg$) {
	msg$.subscribe(msg => console.log(msg))
}

// getting the observable from main
const sink = main();

DOMEffect(sink);
consoleLogEffect(sink);


/* In general you would want to put your effects in a function
* (seperated from your app)
*/