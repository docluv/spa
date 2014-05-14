# SPAjs

SPAjs is a JavaScript library to manage routing and view transitions for 
single page web applications. You can read details about using SPAjs in 
the book [High Performance Single Page Web Applications] (http://www.amazon.com/gp/product/B00HUW2HLQ/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00HUW2HLQ&linkCode=as2&tag=extremewebwor-20).

SPAjs should be used in conjunction with (backpack)(https://github.com/docluv/backpack) which persist views and templates 
in localStorage. When (Mudbath)(https://github.com/docluv/mudbath) is complete
it can be used to persist markup in IndexDB.

Code examples are lifted from the code for the book (reference application)[https://github.com/docluv/movies],
(live demo)[http://movies.spawebbook.com].

To use spajs you simply create a new instance of the library, passing in a reference 
to backpack or a compatible library and any other settings you need to override:

var _spa = spa({
    "appContext": movie,
    "bp": bp,
    "defaultPage": "homeview",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "Modern Web Movies"
});

SPAjs takes care of everything from there. It is designed to manage hash fragment
URL changes used by single page web applications to trigger changes. 

An example view must have an id value because this is used to automatically map
the view's controller object. CSS classes should be applied to the view to style
the view and indicate it is the current view. Normally any new view will need the
current class applied, but there were some cases where this is not true so I show
it being added when a core site is being used (for more details on the concept of 
a 'core site' please refer to the book). SPAjs will automatically apply the default
current class when the view is transitioned into view.

<section id="movieView" 
class="content-pane @if (Html.HasEscapeFragment()){@:current} "
spa-title=" "
spa-transition="slide"
spa-route="movie\:id\:title">

{content goes here}

</section>

Additional properties are defined using spa- attributes. Originally I used data-
attributes as they are 'more correct', but with the proliferation of various libraries
like Angular using custom attribute indicators I thought I would follow suite. 
These attributes are used to drive the view's route, animation, title and other default
properties. 

Unlike most popular god frameworks routing is defined in one of these attributes.
I found maintaining routes in JavaScript to be extremely brittle over an application's
lifetime. 

A route typically contains at least one static phrase or what I call an anchor. It can
also contain optional parameters indicated by \:[parameter name]. SPAjs will parse
the hash fragment value to create a parameter object passed to the views controller's
onload function.

Controllers can define onload, beforeonload, afteronload, unload, beforeunload and afterunload
event handlers. Typically onload is the only callback used. When SPAjs transitions
to a new view it calls these methods, the onload methods when a view is requested,
the unload methods as it is being removed.

SPAjs passes the parameters object (represented by params below) to the onload function. 
This allows the controller to react accordingly. You can see how the route's ("movie\:id\:title")
id value is used to populate the view. The title is not used here because it is merely
decoration for SEO purposes.k

        onload: function (params) {

            if (!params || !params.id) {
                this.showError("No Movie Id Requested");
                return;
            }

            var that = this,
                md = that.movieData,
                mv = this.movieView;

            mv.isVisible = true;

            md.loadMovieDetails.call(md, params.id, function (movie) {

                if (!movie) {
                    return;
                }

                mv.renderMovieDetails.call(that, movie);

            });

        },

The unload methods should be used to destroy any references or clean up that should
not be defined after the view is removed. This is a best practice as you might need
to clean up references that might create memory leaks.

SPAjs is driven by configuration and just automatically manages your single page
application experience. As the developer you do not need to concern yourself with 
the libraries functions per se, just configuring your view.

Right now the animation process is coupled with the animate.css library. I am looking
to decouple that experience in the near future. When that happens you would inject
a library to manage animations. This will open SPAjs to work without key-frame animations.
It should just work without animations however I have not really tested the scenario
thoroughly at this point.

Unit tests: I honestly suck at unit testing :) I tend to test UI libraries by running
them through the browser looking for expectations. Much of SPAjs is based on experience
not simple functions pushing data around. I will add more unit tests over time.



