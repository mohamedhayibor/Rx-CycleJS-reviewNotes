const {h, h1, span, makeDOMDriver} = CycleDOM;

function main(Sources) {
  const mouseover$ = Sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest( () =>
         Rx.Observable.timer(0, 1000)
            .map( x => h1({style: {background:'red'}},[ span([`Seconds Elapsed ${x}`]) ]))
      ),
    Log: Rx.Observable.timer(0, 2000).map( i => 2 * i)
  }
  return sinks;
}


function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver
};

Cycle.run(main, drivers);










/* How about if we wanted to import all the drivers:

Well Cycle DOM can help us in that regard,

it uses the virtual dom Underneath to avoid expensive recreation
of the DOM

*/