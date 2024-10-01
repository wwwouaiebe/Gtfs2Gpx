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

import PolylineEncoder from './PolylineEncoder.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GpxFactory {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#route;

	/**
	 * Coming soon
	 * @type {String}
	 */

	#routeMasterName;

	/**
	 * Coming soon...
	 * @type {String}
	 */

	#gpxString;

	/**
	The time stamp added in the gpx
	@type {String}
	*/

	#timeStamp;

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB0 ( ) { return '\n'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB1 ( ) { return '\n\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB2 ( ) { return '\n\t\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB3 ( ) { return '\n\t\t\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB4 ( ) { return '\n\t\t\t\t'; }

	/**
	Simple constant for polyline decompression
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #polylinePrecision ( ) { return 6; }

	/**
	Creates the header of the gpx file
	*/

	#addHeader ( ) {

		// header
		this.#gpxString = '<?xml version="1.0"?>' + GpxFactory.#TAB0;
		this.#gpxString += '<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
		'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
		'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" ' +
		'version="1.1" creator="TravelNotes">';
	}

	/**
	Creates the footer of the gpx file
	*/

	#addFooter ( ) {
		this.#gpxString += GpxFactory.#TAB0 + '</gpx>';
	}

	/**
	Replace the chars &, ', ", < and > with entities
	@param {String} text The text containing reserved chars
	@return {String} The text with reserved chars replaced by entities
	*/

	#replaceEntities ( text ) {
		return ( text.replaceAll ( '&', '&amp;' )
			.replaceAll ( /\u0027/g, '&apos;' )
			.replaceAll ( /"/g, '&quot;' )
			.replaceAll ( /</g, '&lt;' )
			.replaceAll ( />/g, '&gt;' )
		);
	}

	/**
	Add the waypoints to the gpx file
	*/

	#addWayPoints ( ) {
		this.#route.platforms.forEach (
			( currentPlatform, index ) => {
				this.#gpxString +=
					GpxFactory.#TAB1 + '<wpt lat="' +
					currentPlatform.lat +
					'" lon="' +
					currentPlatform.lon + '">' +
					GpxFactory.#TAB2 + this.#timeStamp +
					GpxFactory.#TAB2 + '<name>' +
					String ( index + 1 ) + ' - ' +
					this.#replaceEntities ( currentPlatform.name ) +
					' ( ' + this.#replaceEntities ( currentPlatform.id ) + ' ) ' +
					'</name>' +
					GpxFactory.#TAB1 + '</wpt>';
			}
		);
	}

	/**
	Add the track to the gpx file
	*/

	#addTrack ( ) {
		this.#gpxString += GpxFactory.#TAB1 + '<trk>';

		this.#gpxString += GpxFactory.#TAB2 + '<name>' +
			this.#replaceEntities ( this.#routeMasterName + ' - ' + String ( this.#route.shapePk ) ) +
			'</name>';
		this.#gpxString += GpxFactory.#TAB2 + '<trkseg>';

		const routeNodes = new PolylineEncoder ( ).decode (
			this.#route.nodes,
			[ GpxFactory.#polylinePrecision, GpxFactory.#polylinePrecision ]
		);

		routeNodes.forEach (
			routeNode => {
				this.#gpxString +=
                    GpxFactory.#TAB3 +
                    '<trkpt lat="' + routeNode [ 0 ] + '" lon="' + routeNode [ 1 ] + '">' +
                    GpxFactory.#TAB4 + this.#timeStamp +
                    GpxFactory.#TAB3 + '</trkpt>';
			}
		);

		this.#gpxString += GpxFactory.#TAB2 + '</trkseg>';
		this.#gpxString += GpxFactory.#TAB1 + '</trk>';
	}

	/**
	Save a string to a file
	@param {String} fileName The file name
	@param {String} fileContent The file content
	@param {?string} fileMimeType The mime type of the file. Default to 'text/plain'
	*/

	#saveFile ( fileName, fileContent, fileMimeType ) {
		try {
			const objURL =
				fileMimeType
					?
					window.URL.createObjectURL ( new File ( [ fileContent ], fileName, { type : fileMimeType } ) )
					:
					URL.createObjectURL ( fileContent );
			const element = document.createElement ( 'a' );
			element.setAttribute ( 'href', objURL );
			element.setAttribute ( 'download', fileName );
			element.click ( );
			window.URL.revokeObjectURL ( objURL );
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}

	/**
	Save the gpx string to a file
	*/

	#saveGpxToFile ( ) {
		let fileName = this.#routeMasterName + ' - from ' +
			this.#route.platforms [ 0 ].name + ' to ' +
			this.#route.platforms [ this.#route.platforms.length - 1 ].name +
			' - ' + String ( this.#route.shapePk ) + '.gpx';
		this.#saveFile ( fileName, this.#gpxString, 'application/xml' );
	}

	/**
	 * Coming soon
	 * @param {Array} routeInfo Coming soon
	 */

	buildGpx ( routeInfo ) {
		this.#routeMasterName = routeInfo [ 0 ];
		this.#route = routeInfo [ 1 ];
		this.#timeStamp = '<time>' + new Date ( ).toISOString ( ) + '</time>';
		this.#addHeader ( );

		this.#addWayPoints ( );
		this.#addTrack ( );
		this.#addFooter ( );
		this.#saveGpxToFile ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default GpxFactory;

/* --- End of file --------------------------------------------------------------------------------------------------------- */