/**
   * Decimal to DMS conversion
   */
  convertDMS = function(coordinate) {
    var coords;

    abscoordinate = Math.abs(coordinate);
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10);
    coordinateseconds /= 10;

    if( coordinatedegrees < 10 )
      coordinatedegrees = "0" + coordinatedegrees;

    if( coordinateminutes < 10 )
      coordinateminutes = "0" + coordinateminutes;

    if( coordinateseconds < 10 )
      coordinateseconds = "0" + coordinateseconds;

    coords = coordinatedegrees + "º";
    coords += coordinateminutes + "'";
    coords += coordinateseconds + "''";
    //coords[3] = this.getHemi(coordinate, type);

    return coords;
  };