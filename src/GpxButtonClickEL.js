
import theDataLoader from './DataLoader.js';
import GpxFactory from './GpxFactory.js';

class GpxButtonClickEL {

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( clickEvent ) {
		let routeInfo = theDataLoader.getRouteInfo (
			clickEvent.target.dataset.routeMasterIndex,
			clickEvent.target.dataset.routeIndex
		);
		new GpxFactory ( ).buildGpx ( routeInfo );
	}
}

export default GpxButtonClickEL;