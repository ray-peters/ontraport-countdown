
( function(){
    
    var element = Object.create( HTMLElement.prototype );

    element._active = false;

    element.isActive = function(){
        return this._active;
    };

    element.startCountdown = function(){
        this._active = true;

        var poller = function( elem ) {
            return function(){
                if ( elem.isActive() ) {
                    elem.updateDisplay();
                    setTimeout( poller, 1000 );
                }
            };
        }( this );

        poller();
    };  

    element.stopCountdown = function(){
        this._active = false;
    };

    element.updateDisplay = function(){
        // CONSTANTS
        var _SECOND = 1000,
            _MINUTE = _SECOND * 60,
            _HOUR = _MINUTE * 60,
            _DAY = _HOUR * 24;

        return function(){

            var day = this.getAttribute( "day" ),
                month = this.getAttribute( "month" ),
                year = this.getAttribute( "year" ),

                today = new Date,
                now = +today,

                // new Date( year, month, day, hours, minutes, seconds, milliseconds )
                countdownDate = new Date(
                    // YEAR
                    ( year || today.getFullYear() ),
                    // MONTH
                    ( month - 1 ) || today.getUTCMonth(),
                    // DAY
                    ( day || 0 )
                ),
                
                then = +countdownDate;


            if ( now > then ) {
                console.log( "redirect!!!" );
            } else {
                var duration = ( then - now ),
                    elem, newVal;

                // Update days display
                elem = this.querySelector( ".ce-days" );

                if ( elem ) {
                    newVal = Math.floor( duration / _DAY );
                    elem.innerText = newVal;
                    duration -= ( newVal * _DAY );
                }
                
                // Update hours display
                elem = this.querySelector( ".ce-hours" );

                if ( elem ) {
                    newVal = Math.floor( duration / _HOUR );
                    elem.innerText = newVal;
                    duration -= ( newVal * _HOUR );
                }

                // Update minutes display
                elem = this.querySelector( ".ce-minutes" );

                if ( elem ) {
                    newVal = Math.floor( duration / _MINUTE );
                    elem.innerText = newVal;
                    duration -= ( newVal * _MINUTE );
                }

                // Update seconds display
                elem = this.querySelector( ".ce-seconds" );

                if ( elem ) {
                    newVal = Math.floor( duration / _SECOND );
                    elem.innerText = newVal;
                    duration -= ( newVal * _SECOND );
                }
            }
        };
    }();


    // Fires when an instance of the element is created
    element.createdCallback = function(){
        this.updateDisplay();
        this.startCountdown();
    };
    
    // Fires when an instance was inserted into the document
    element.attachedCallback = function(){};
    
    // Fires when an instance was removed from the document
    element.detachedCallback = function(){
        this._active = false;
    };
    
    // Fires when an attribute was added, removed, or updated
    element.attributeChangedCallback = function( attr, oldVal, newVal ) {};
    

    // Registers custom element
    document.registerElement( 'ontraport-countdown', {
        'prototype': element
    } );
}() );
