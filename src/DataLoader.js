/*
Copyright - 2024 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import GpxButtonClickEL from './GpxButtonClickEL';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataLoader {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsTree;

	/**
	 * Coming soon
	 * @type {HTMLElement}
	 */

	#mainElement;

	/**
	 * Coming soon
	 * @type {Number}
	 */

	#routeCounter = 0;

	/**
	 * Coming soon
	 * @param {String} fileName Coming soon
	 */

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

	/**
	 * Coming soon
	 * @param {Object} route Coming soon
	 * @param {Number} routeIndex Coming soon
	 * @param {Number} routeMasterIndex Coming soon
	 */

	#displayRoute ( route, routeIndex, routeMasterIndex ) {
		let routeElement = document.createElement ( 'p' );
		let gpxButton = document.createElement ( 'button' );
		gpxButton.innerText = 'Download gpx';
		gpxButton.dataset.routeMasterIndex = routeMasterIndex;
		gpxButton.dataset.routeIndex = routeIndex;
		gpxButton.classList.add ( 'gpxButton' );
		gpxButton.addEventListener ( 'click', new GpxButtonClickEL ( ), false );
		routeElement.appendChild ( gpxButton );
		routeElement.appendChild ( document.createTextNode ( route.displayName ) );
		this.#mainElement.appendChild ( routeElement );
		this.#routeCounter ++;
	}

	/**
	 * Coming soon
	 * @param {Number} routeType Coming soon
	 * @returns {String} Coming soon
	 */

	#getRouteType ( routeType ) {
		return [ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ routeType ];
	}

	/**
	 * Coming soon
	 * @param {Object} routeMaster Coming soon
	 * @param {Number} routeMasterIndex Coming soon
	 */

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

	/**
	 * Coming soon
	 */

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

	/**
	 * Coming soon
	 * @param {String} network Coming soon
	 */

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

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Coming soon
	 * @param {Number} routeMasterIndex Coming soon
	 * @param {Number} routeIndex Coming soon
	 */

	getRouteInfo ( routeMasterIndex, routeIndex ) {
		let routeMaster = this.#gtfsTree.routesMaster [ routeMasterIndex ];
		return [
			this.#getRouteType ( routeMaster.routeMasterType ) + ' ' + routeMaster.routeMasterRef,
			routeMaster.routes [ routeIndex ]
		];
	}
}

/**
 * The one and only one object DataLoader
 */

const theDataLoader = new DataLoader ( );

export default theDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */