
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

        // Returns the 
        var _updateDisplayHelper = function( display, newVal, context ) {
            var elem = context.querySelector( ".ce-" + display );
            if ( elem ) {
                elem.innerText = newVal;
            }
        };

        return function(){

            var today = new Date,
                now = +today,

                // new Date( year, month, day, hours, minutes, seconds, milliseconds )
                countdownDate = new Date(
                    // YEAR
                    ( this.getAttribute( "year" ) || today.getFullYear() ),
                    // MONTH -- range: 0-11
                    ( ( this.getAttribute( "month" ) - 1 ) || today.getUTCMonth() ),
                    // DAY -- range: 0-30
                    ( this.getAttribute( "day" ) || 0 ),
                    // HOUR -- range: 0-23
                    ( this.getAttribute( "hour" ) || 0 ),
                    // MINUTE -- range: 0-59
                    ( this.getAttribute( "minute" ) || 0 )
                ),
                then = +countdownDate;

            if ( now > then ) {
                // Handle redirect
                var destination = this.getAttribute( "redirect_href" );

                if ( destination ) {
                    // Go!
                    window.location.replace( destination );
                }

            } else {
                // Update displays

                var duration = ( then - now );

                // Update days display
                newVal = Math.floor( duration / _DAY );
                _updateDisplayHelper( "days", newVal, this );
                duration -= ( newVal * _DAY );

                // Update hours display
                newVal = Math.floor( duration / _HOUR );
                _updateDisplayHelper( "hours", newVal, this );
                duration -= ( newVal * _HOUR );

                // Update minutes display
                newVal = Math.floor( duration / _MINUTE );
                _updateDisplayHelper( "minutes", newVal, this );
                duration -= ( newVal * _MINUTE );

                // Update seconds display
                newVal = Math.floor( duration / _SECOND );
                _updateDisplayHelper( "seconds", newVal, this );
                duration -= ( newVal * _SECOND );
            }
        };
    }();


    // Fires when an instance of the element is created
    element.createdCallback = function(){
        this.updateDisplay();
        this.startCountdown();
        var classes = this.getAttribute( "class" ) || "";
        this.setAttribute( "class", classes + " countdown" );
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
