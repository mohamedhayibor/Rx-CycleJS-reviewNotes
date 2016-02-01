/* From the previous example we were getting the same strings in both 
the console.log and the page 

-If we wanted different outputs, we'll need to set up different sinks:
-In JS we can get that with return an object with different keys: DOM and Log
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
function DOMEffect(text$) {
	return text$.subscribe(text => {
		const container = document.querySelector('#app')
		container.textContent = text;
	})
}

function consoleLogEffect(msg$) {
	msg$.subscribe(msg => console.log(msg))
}

const sinks = main();

DOMEffect(sinks.DOM) // => output on the page
consoleLogEffect(sinks.Log) // output on the console


/** You can think of the sink here as a placeholder for our logic */