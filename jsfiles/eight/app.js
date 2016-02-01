function main(Sources) {
  const mouseover$ = Sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest( () => 
        Rx.Observable.timer(0, 1000)
          .map( x => {
            return {
              tagName: 'h1',
              children: [
                {
                  tagName: 'SPAN',
                  children: [
                    `Seconds Elapsed ${x}`
                  ]
                }
              ]
            };
      })
      ),
    Log: Rx.Observable.timer(0, 2000).map( i => 2 * i)
  }
  return sinks;
}

function DOMDriver(obj$) {
  function createElement(obj) {
    const element = document.createElement(obj.tagName)
    obj.children
      .filter(c => typeof c=== 'object' )
      .map(createElement)
      .forEach( i => element.appendChild(i))
    obj.children
      .filter(c => typeof c === 'string')
      .forEach(c => element.innerHTML += c)
    return element;
  }
  
  obj$.subscribe(obj => {
    const container = document.querySelector('#app')
    container.innerHTML = '';
    const element = createElement(obj);
    container.appendChild(element);
  })
  const DOMSource = {
    selectEvents: function (tagName, eventType) {
      return Rx.Observable.fromEvent(document, eventType)
        .filter(ev => ev.target.tagName === tagName.toUpperCase())
    }
  }
  return DOMSource;
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}


Cycle.run(main, drivers)


/* Sounds too generic? it does However we can specify the actual changing (behaviors)
let's say if we wanted to reset the timer on hover instead.
That's a logic issue and therefore will have to update our main function

=> we'll have to also update our DOMSource with the function selectEvents
which takes a tagname and an eventType 
=> Then returns an observable
=> Then we want to make sure to filter the event to match 



*/