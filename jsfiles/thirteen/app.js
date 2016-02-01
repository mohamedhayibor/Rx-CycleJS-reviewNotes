/**** Now how about http drivers and observables
***** Yes Cycle does have an HTTP driver
****************************************************
** the idea for this app is to make an http request,
to fetch a single piece of data from a REST server
and display it on our page (DOM)
******** As of the static page here's the code *********/

const {button, p, h4, a, h1, div, makeDOMDriver} = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver;

function main(sources) {
  return {
    DOM: Rx.Observable.of(
      div([
        button('.get-first', 'Get first user'),
        div('.user-details', [
          h1('.user-name', '(name)'),
          h4('.user-email', '(email)'),
          a('.user-website', {href: 'google.com'}, '(website)')
        ])
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);

/******************* Driver *********************************

Steps to accomplish:
1- button clicked (DOM read effects) - sources
2- request sent (http): HTTP write effect
3- response received HTTP read effect - sources
4- data display (DOM write effects)
-----------------------------------------------
We know that write effects are sinks
And read effects are coming from the sources

*/


/* Final Code */

const { label, h4, h1, p, a, div, button, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver;

function main(sources) {
  const clickAction$ = sources.DOM.select('.get-first').events('click');
  const request$ = clickAction$.map( () => {
    return {
      url: "http://jsonplaceholder.typicode.com/users/1",
      method: "GET"
    };
  });
  
  const response$$ = sources.HTTP.filter(response$ => response$.request.url === "http://jsonplaceholder.typicode.com/users/1");
  const response$ = response$$.switch();
  
  const firstUser$ = response$.map(response => response.body).startWith(null)
  
  return {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.get-first', 'make request'),
        firstUser === null ? null: div('.user-details',[
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', {href: firstUser.website}, firstUser.website)
        ])
      ])
    
    ),
    HTTP: request$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};


Cycle.run(main, drivers)


/* Sounds like a lot? It is and you will most likely get confused if you're not thinking about the request in a structural manner.
- The first step is outlining the four steps that are being taken,
- figure out which task come from where (read => sources, write => sinks)

So let's break it down:
first we're importing the CycleHTTPDriver with the script tag (see on JSBIN)
Then we are u

(we just want to fetch the data of the first user and display it on the DOM,
Notice that we're using the endpoint from jsonplaceholdertypicode to get the data of the first user.)

Explaining the reason why we are using the .switch() on response$$ would take several sentences and analogies so definitely watch the [vid](https://egghead.io/lessons/rxjs-using-the-http-driver): if you want to learn more.

[JS Bin](http://jsbin.com/cimuviz/1/edit?js,output)

[Js Bin wth comments](http://jsbin.com/fujoje/4/edit?js,output)

*/