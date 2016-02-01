/* Now our goal is to build a counter app with increment and decrement buttons
* Before getting into the interactivity of the app, it is recommended to get
* static UI first. So here it is:
*/

const {button, p, label, input, h1, hr, div, makeDOMDriver} = CycleDOM;

function main(sources) {
  return {
    DOM: Rx.Observable.of(
      div([
        button('.decrement','Decrement'),
        button('.increment', 'Increment'),
        p([
          label('0')
        ])
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);



/* For the first argument on the buttons, you can set up either classes or
* ids with the "." or "#" selectors and if you check on your dev tools
* you will see the exact tags you wanted

*
*/

/***** Now as our static page is set, we can tackle some interactivity **********/










/************ The number one urge that will spoil th *********************
=> |So resist the urge of wanting to set the value of an observable. |
Just think about it in Fight Club style:
Rule 1: Don't set the value of an observable
Rule 2: Don't SET the value of an observable


Not following the rule spoils everything because the dynamic nature of 
of observables is their ultimate power, you would lose the reactive pattern
and doesn't give you seperation of concerns at all
*************************************************************************

Our goal is to declare the future value of the counter

for example if our counter stream: counter$ started with 10, you could view it as
10 ----> 10 -----> 10 -----> 10 -----> 10 
------------------> Time ------------> 
So what you would want to do is merge the increment and decrement action into the stream
.scan() allows us to make this type of operation with
(also named as horizontal combinator or (past combinator))

so as dummy visual Merging example we could have:
 10 ----> (-1) ----> (-1) ----> (-1) ----> (+1) ---->
 10 ----> ( 9) ----> ( 8) ----> ( 7) ----> ( 8) ---->

*/

/* Final Code */

const {label, button, p, input, div, makeDOMDriver } = CycleDOM;

function main(sources) {
  const incr$ = sources.DOM.select('.increment').events('click');
  const decr$ = sources.DOM.select('.decrement').events('click');
  
  const incrAction$ = incr$.map(ev => +1);
  const decrAction$ = decr$.map(ev => -1);
  
  const counter$ = Rx.Observable.of(0)
    .merge(incrAction$).merge(decrAction$)
    .scan((prev, current) => prev + current)
  
  return {
    DOM: counter$.map(counter =>
      div([
        button('.increment', 'increment'),
        button('.decrement', 'decrement'),
        p([
          label([`Counter: ${counter}`])
        ])
      ])
    )
  };
  
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);

/* If you have some ReactJS experience you can think that 
the way Observables keep state.
In another words, .scan() fetches the previous values and fetches those
------------------------

- If you notice on both incr$ and decr$, we care about the click events at this point.

The decrAction$ and incrAction$, represent what the actual buttons mean (incr$, decr$).
Just => what is the interpretation in our App

[JS BIN](http://jsbin.com/fujoje/2/edit?js,output)
*/


