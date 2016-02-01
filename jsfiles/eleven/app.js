const {label, input, h, h1, hr, span, makeDOMDriver } = CycleDOM;

function main(sources) {
	return {
      DOM: Rx.Observable.of(
        div([
          label('Name: '),
          input({type: 'text'}),
          hr(),
          h1('Hello')
        ])
      )
    };
}

const drivers = {
	DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers)


/**************** Fully functional Hello world  {name} app *************/

const {label, input, h1, hr, div, makeDOMDriver} = CycleDOM;

function main(sources) {
  const inputEv$ = sources.DOM.select('.field').events('input');
  const name$ = inputEv$.map(ev => ev.target.value).startWith('');
  return {
    DOM: name$.map(name => 
      div([
        label('Name: '),
        input('.field', {type: 'text'}),
        hr(),
        h1(`Hello ${name}`!)
      ])
    )
  };
  
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);


/* Let's build a Hello world the cycleJs way
The key takeaways are:
- The DOM driver (makeDOMDriver) is doing the heavy lifting
- The main always returns an object of sinks
- Here the DOM sink is returning an Observable
- The observable is only returning one event (div event) `a virtual dom element`
- (label, input, hr and h1) at this point are write effects


-0-


- Notice that instead of "Rx.Observable.of" we have "name$", we can do this:
- because name$ itself is an observable (getting it's value from inputEv$)
- thus mapping it can get to our desired outcome.



- To detect the input being inputted, we need some read effects:
- The read effects come from the DOMSource (with select we can restrict our choices)
----------------
- We are importing the needed dom elements from CycleDOM

- '.field' => the first argument for the input represent its class

- The secret sauce of CycleJS is that there is a continuous loop between
- write and read events, thus the name.
- 
- Side-note: At some point you might wondering, why do have the .startWith('') method on name$
- and as Stalz eloquently put it you cannot map on emptiness, so you have to begin with
- an empty string. Also, you could put there any string there you want. For instance: "world"
*/