import GpxButtonClickEL from './GpxButtonClickEL';

class DataLoader {

	#gtfsTree;

	#mainElement;

	#routeCounter = 0;

	async #fetchData ( fileName ) {
		let success = false;
		await fetch ( fileName )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );
				}
			)
			.then (
				jsonResponse => {

					// loading data
					this.#gtfsTree = jsonResponse;
					success = true;
				}
			)
			.catch (
				err => {
					console.error ( err );
				}
			);
		return success;

	}

	#displayRoute ( route, routeIndex, routeMasterIndex ) {
		let routeElement = document.createElement ( 'p' );
		routeElement.innerText = route.displayName;
		let gpxButton = document.createElement ( 'button' );
		gpxButton.innerText = 'Download gpx';
		gpxButton.dataset.routeMasterIndex = routeMasterIndex;
		gpxButton.dataset.routeIndex = routeIndex;
		gpxButton.addEventListener ( 'click', new GpxButtonClickEL ( ), false );
		routeElement.appendChild ( gpxButton );
		this.#mainElement.appendChild ( routeElement );
		this.#routeCounter ++;
	}

	#getRouteType ( routeType ) {
		return [ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ routeType ];
	}

	#displayRouteMaster ( routeMaster, routeMasterIndex ) {
		let routeMasterElement = document.createElement ( 'div' );
		let routeMasterHeader = document.createElement ( 'h2' );
		routeMasterHeader.innerText =
            this.#getRouteType ( routeMaster.routeMasterType ) + ' ' + routeMaster.routeMasterRef;
		routeMasterElement.appendChild ( routeMasterHeader );
		this.#mainElement.appendChild ( routeMasterElement );
		routeMaster.routes.forEach (
			route => {
				route.displayName = 'From ' + route.platforms[ 0 ].name + ' ( ' + route.platforms[ 0 ].id + ' ) ' +
		            'to ' + route.platforms[ route.platforms.length - 1 ].name + ' ( ' +
                    route.platforms[ route.platforms.length - 1 ].id + ' )';
			}
		);

		routeMaster.routes.sort (
			( first, second ) => first.displayName > second.displayName
		);

		routeMaster.routes.forEach (
			( route, routeIndex ) => this.#displayRoute ( route, routeIndex, routeMasterIndex )
		);
	}

	#displayData ( ) {
		this.#routeCounter = 0;
		this.#mainElement = document.getElementById ( 'gpx' );
		while ( this.#mainElement.firstChild ) {
			this.#mainElement.removeChild ( this.#mainElement.firstChild );
		}
		this.#gtfsTree.routesMaster.forEach (
			( routeMaster, routeMasterIndex ) => this.#displayRouteMaster ( routeMaster, routeMasterIndex )
		);
	}

	async loadData ( network ) {
		let fileName = '';
		switch ( network ) {
		case 'TECB' :
			fileName = '../json/gtfs-B.json';
			break;
		case 'TECC' :
			fileName = '../json/gtfs-C.json';
			break;
		case 'TECH' :
			fileName = '../json/gtfs-H.json';
			break;
		case 'TECL' :
			fileName = '../json/gtfs-L.json';
			break;
		case 'TECN' :
			fileName = '../json/gtfs-N.json';
			break;
		case 'TECX' :
			fileName = '../json/gtfs-N.json';
			break;
		case 'STIB' :
			fileName = '../json/gtfs-STIB-MIVB.json';
		default :
			break;
		}

		await this.#fetchData ( fileName );
		this.#displayData ( );
		console.info ( String ( this.#routeCounter ) + ' Routes found ' );
	}

	constructor ( ) {
		Object.freeze ( this );
	}

	getRouteInfo ( routeMasterIndex, routeIndex ) {
		let routeMaster = this.#gtfsTree.routesMaster [ routeMasterIndex ];
		return [
			this.#getRouteType ( routeMaster.routeMasterType ) + ' ' + routeMaster.routeMasterRef,
			routeMaster.routes [ routeIndex ]
		];
	}
}

const theDataLoader = new DataLoader ( );

export default theDataLoader;