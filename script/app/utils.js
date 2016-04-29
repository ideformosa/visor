var idef = idef || {};

idef.utils = (function() {
  'use strict';

  /*
  * Decimal to DMS conversion
  */
  function convertDDtoDMS(coordinate) {
    var absCoord, coordDegrees, coordMinutes, tempCoordMinutes, coordSeconds,
      coords;

    absCoord = Math.abs(coordinate);
    coordDegrees = Math.floor(absCoord);
    coordMinutes = (absCoord - coordDegrees)/(1/60);
    tempCoordMinutes = coordMinutes;
    coordMinutes = Math.floor(coordMinutes);
    coordSeconds = (tempCoordMinutes - coordMinutes)/(1/60);
    coordSeconds =  Math.round(coordSeconds*10);
    coordSeconds /= 10;
    coordSeconds = Math.floor(coordSeconds);

    if( coordDegrees < 10 )
      coordDegrees = "0" + coordDegrees;

    if( coordMinutes < 10 )
      coordMinutes = "0" + coordMinutes;

    if( coordSeconds < 10 )
      coordSeconds = "0" + coordSeconds;

    coords = (coordinate < 0 ? "-" : "") + coordDegrees + "º";
    coords += coordMinutes + "'";
    coords += coordSeconds + "''";

    return coords;
  }

  return {
    dd2dms: convertDDtoDMS
  }
}());
