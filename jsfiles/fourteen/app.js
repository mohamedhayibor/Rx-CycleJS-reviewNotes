/* Body-Mass Index calculator built with in Cycle.js.
The idea here is that the user would input their height
and weight to get their bodymass.

Before getting too deeply about the app's logic, let's set up 
the static page: 

*/
const { label, input, h3, p, a, div, button, makeDOMDriver } = CycleDOM;

function main(sources) {
  return {
    DOM: Rx.Observable.of(
      div([
        div([
          label(`weight: 00kg`),
          input('.weight', {type: 'range', min: 40, max: 150, value: 70})
        ]),
        div([
          label(`height: 00cm`),
          input('.height', {type: 'range', min: 120, max: 230, value: 160})
        ]),
        h3(`Your BMI is 000`)
      ])
    )
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
}


Cycle.run(main, drivers)

/* Then let's list out the different steps to take in our logic
1- read the user weight (read DOM event)
2- read the user height (read DOM event)
3- "calculate" the user's BMI
4- Display the user's BMI, height and weight (write DOM events),

PS: step 4 is happening instantly in this case.
*/



/* In our previous counter example, we got our way by merging two streams But because to calculate the BMI, we need both height and weight we will use the method .combineLatest() instead.

*/


const { label, input, h3, p, a, div, button, makeDOMDriver } = CycleDOM;

function main(sources) {
  const weight$ = sources.DOM.select('.weight').events('input')
    .map(ev => ev.target.value);
  const height$ = sources.DOM.select('.height').events('input')
    .map(ev => ev.target.value);
  
  const state$ = Rx.Observable.combineLatest(
    weight$.startWith(70),
    height$.startWith(130),
    (weight, height) => {
      const heightInMeters = height * 0.01;
      const bmi = Math.round(weight /(heightInMeters * heightInMeters));
      
      return {bmi, weight, height};
    });
  
  return {
    DOM: state$.map( state =>
      div([
        div([
          label(`weight: ${ state.weight } kg`),
          input('.weight', {type: 'range', min: 40, max: 150, value: state.weight })
        ]),
        div([
          label(`height: ${ state.height } cm`),
          input('.height', {type: 'range', min: 120, max: 230, value: state.height })
        ]),
        h3(`Your BMI is ${ state.bmi }`)
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};


Cycle.run(main, drivers);


/* Comment later

[JSBIN](http://jsbin.com/cimuviz/2/edit?js,output)

 */