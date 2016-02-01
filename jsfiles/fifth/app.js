'use strict'
function main(DOMSource) {
	const click$ = DOMSource;
	return {
  		DOM: click$
  			.startWith(null)
  			.flatMapLatest( () => 
  				Rx.Observable.timer(0, 1000)
  					.map(i => `Seconds elapsed ${i}`)
  			),
    	Log: Rx.Observable.timer(0, 2000)
    		.map(x => 2 * x)
	}
}

function DOMDriver(text$) {
	text$.subscribe(text => {
		const container = document.querySelector('#app')
		container.textContent = text;
	})

	// DOMSource to return all click within the page
	const DOMSource = Rx.Observable.fromEvent(document, 'click');
	return DOMSource;
}

// To get a console.log effect
function consoleLogDriver(msg$) {
	msg$.subscribe(msg => console.log(msg))
}

function run (mainFn, drivers) {
	const proxyDOMSource = new Rx.Subject();
	const sinks = mainFn(proxyDOMSource);
	const DOMSource = drivers.DOM(sinks.DOM)
	DOMSource.subscribe(click => proxyDOMSource.onNext(click));

	/* Subscribes to the dom source, get every click and feed it back to the DOM source
	onNext => pushes the event onto the proxy observable
	 */
	// Object.keys(drivers).forEach( key => {
	// 	drivers[key](sinks[key])
	// })
}

const drivers = {
	DOM: DOMDriver,
	LOG: consoleLogDriver
}

run(main, drivers)

/* Thus far, we don't have way of getting user inputs (clicks, texts and so on).
* To tackle this we can borrow the data flow networks terminalogies:
* -source: input (read) effects
* -sink: output (write) effects

* Lucky for us, Observables makes it really easy for us to the the clicks with:
Rx.Observable.fromEvent(document, 'click')


* Here we strike the heart of the matter when we start to consider the following:
	a = f(b)
	b = g(a)
	Because both a and b are observables, we can solve the matter each params proxies:
	bProxy = ...
	a = f(bProxy)
	b = g(a)
	bProxy.imitate(b)


	the RxJS => new Rx.Subject() has nothing happening until you assign to something later


So now every time we click on the DOM it will go to main(DOMSource) and then we can use it

// This allows to reset the timer every single time dom is clicked.


 - Also you can think of new Rx.Subject() as a null value (observable) in RXJS




The onNext method pushes the event to the proxy observable


Finally we were able to get and write from the dom.



*/