function h (tagName, children) {
  return {
    tagName: tagName,
    children: children
  }
}

function h1(children) {
  return {
    tagName: 'H1',
    children: children
  };
}

function span(children) {
  return {
    tagName: 'SPAN',
    children: children
  };
}


function main(Sources) {
  const mouseover$ = Sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest( () => 
        Rx.Observable.timer(0, 1000)
          .map( x => 
              h1([
                  span([`Seconds Elapsed ${x}`])
              ])
          )
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









/* To make our job earsier when creating dom elements we can create a function that return our desired outcome


the h is introduced because of the existence of a similar function in Cycle dom
called hyperScript which is an alternative to a template language.

Utilizing the tag function now we can simply get the templating like in Jade in a fast and easy way.

*/