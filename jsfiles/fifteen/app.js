/* Our former Big main function is working properly and its great.
* However we can start to get easily confused as our app grows including
* other features. Then starting to think of our app in a modular and small
* components becomes a good rule of thumb. And Here comes the 
* Intent - Model - View pattern. To get a hang of it let's refactor our last 
* BMI index code with it. */



const { label, input, h3, p, a, div, button, makeDOMDriver } = CycleDOM;

function intent(sources) {
  const weight$ = sources.DOM.select('.weight').events('input')
    .map(ev => ev.target.value);
  const height$ = sources.DOM.select('.height').events('input')
    .map(ev => ev.target.value);
  return { weight$, height$ }
  
}

function model (weight$, height$) {
  const state$ = Rx.Observable.combineLatest(
    weight$.startWith(70),
    height$.startWith(130),
    (weight, height) => {
      const heightInMeters = height * 0.01;
      const bmi = Math.round(weight /(heightInMeters * heightInMeters));
      
      return {bmi, weight, height};
    });
  return state$;
}

function view (state$) {
  return state$.map( state =>
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
}

function main(sources) {
  const { weight$, height$ } = intent(sources)
  const state$ = model(weight$, height$);
  const vtree$ = view(state$);
  
  return {
    DOM: vtree$
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};


Cycle.run(main, drivers);


/* By dividing our code into 3 parts (intent, model, view) and refactoring it. We can have abstraction as needed as our app grows in size.

[JS Bin](http://jsbin.com/gawuna/2/edit?js,output)

*/