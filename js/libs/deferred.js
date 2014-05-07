;

//shim to abstract the jQuery Deferred object out of the libraries
function deferred(func){

    return $.Deferred(func);

};