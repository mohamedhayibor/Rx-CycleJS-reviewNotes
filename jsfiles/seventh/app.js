function main(Sources) {
  const click$ = Sources.DOM;
  const sinks = {
    DOM: click$
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


Cycle.run(main, drivers)

/* 
Drivers are pluggins that allow you to make effects and without effects 
nothing happens.


Instead of just returning a string, let's return an object that will allows us
to get more leverage


return an object that defines the properties of our element
Now our driver will receive an object stream. (for the time being though our object is not an element yet)

A way to go about it is to create a function that the object and reuturn a DOM element

function createElement(obj) {
    const element = document.createElement(obj.tagName)
    element.innerHTML = obj.children[0]
    return element;
  }

  Now we have to reset container innerHTML to an empty string otherwise a new header will be added to 
  the dom at every second


Now if we get other tags on our element we will have to revert to some type of recursion.


This puts us in a very powerful position where we don't have to worry about the nesting of tags anymore.

*/