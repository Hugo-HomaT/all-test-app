window.addEventListener( 'message', ( json ) => {
    try {
        if ( typeof json.data !== 'string' ) {
            // PG events always have a string payload, we can safely ignore the event if it's not the case.
            return;
        }
        const event = JSON.parse( json.data );

        switch ( event.name ) {
            case 'setPlaygroundOverrides':
                window.playgroundOverrides = JSON.parse( event.data );
                break;
            case 'setPlaygroundBundleOverrides':
                window.playgroundBundlesOverrides = JSON.parse( event.data );
                break;
            case 'setPlaygroundAssetOverrides':
                window.playgroundAssetOverrides = JSON.parse( event.data );

                window.dispatchEvent( new Event( 'luna:build' ) );
                window.dispatchEvent( new Event( 'luna:start' ) );
                window.dispatchEvent( new Event( 'playground:started' ) );

                break;
            default:
        }
    } catch ( ex ) {
        // noop
    }
} );
