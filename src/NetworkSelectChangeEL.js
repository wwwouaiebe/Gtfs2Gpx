import theDataLoader from './DataLoader.js';

class NetworkSelectChangeEL {

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( changeEvent ) {
		theDataLoader.loadData ( changeEvent.target.value );
	}
}

export default NetworkSelectChangeEL;