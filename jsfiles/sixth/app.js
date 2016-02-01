function main(Sources) {
  const click$ = Sources.DOM;
  const sinks = {
    DOM: click$
      .startWith(null)
      .flatMapLatest( () => 
        Rx.Observable.timer(0, 1000).map( x => `Seconds elapsed ${x}`)
      ),
    Log: Rx.Observable.timer(0, 2000).map( i => 2 * i)
  }
  return sinks;
}

function DOMDriver(text$) {
  text$.subscribe(text => {
    const container = document.querySelector('#app')
    container.textContent = text;
  })
  const DOMSource = Rx.Observable.fromEvent(document, 'click');
  return DOMSource;
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

function run (mainFn, drivers) {
  const proxySources = {};
  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject()
  })
  const sinks = mainFn(proxySources)
  Object.keys(drivers).forEach( key => {
    const source = drivers[key](sinks[key])
    source.subscribe(x => proxySources[key].onNext(x))
  })
  
}

run(main, drivers)



/* We achieved the goal of making our run function general at this point
* Now Cycle has a run function and we can import it with a cdn,
* delete our run function and replace run(main, drivers) with
* Cycle.run(main, drivers)


*/
