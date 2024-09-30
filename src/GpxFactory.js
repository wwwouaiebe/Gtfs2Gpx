import PolylineEncoder from './PolylineEncoder.js';

class GpxFactory {

	#route;

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

		const routeNodes = new PolylineEncoder ( ).decode ( this.#route.nodes, [ 6, 6 ] );

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

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default GpxFactory;