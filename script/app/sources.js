var IDEF_BASE_URL = 'https://idef.formosa.gob.ar';

var sources = {
  dec: {
    url: IDEF_BASE_URL + '/servicios/dec/wms?',
    title: 'Dirección de Estadística y Censo',
    version: '1.1.1'
  },
  dgct: {
    url: IDEF_BASE_URL + '/proxy/https://sit.formosa.gob.ar/WMSServer?',
    title: 'Dirección General del Catastro Territorial',
    version: '1.1.1'
  },
  dpv: {
    url: IDEF_BASE_URL + '/dpv/servicios/dpv/wms?',
    title: 'Dirección Provincial de Vialidad',
    version: '1.1.1'
  },
  mce: {
    url: IDEF_BASE_URL + '/mce/servicios/MCE/wms?',
    title: 'Ministerio de Cultura y Educación',
    version: '1.1.1'
  },
  mdh: {
    url: IDEF_BASE_URL + '/mdh/servicios/mdh/wms?',
    title: 'Ministerio de Desarrollo Humano',
    version: '1.1.1'
  },
  mpa: {
    url: IDEF_BASE_URL + '/servicios/mpa/wms?',
    title: 'Ministerio de la Producción y Ambiente',
    version: '1.1.1'
  },
  upca: {
    url: IDEF_BASE_URL + '/servicios/upca/wms?',
    title: 'Unidad Provincial Coordinadora del Agua',
    version: '1.1.1'
  },
  upsti: {
    url: IDEF_BASE_URL + '/servicios/upsti/wms?',
    title: 'Unidad Provincial de Sistemas y Tecnologías de Información',
    version: '1.1.1'
  },
  ign: {
    url: IDEF_BASE_URL + '/proxy/https://wms.ign.gob.ar/geoserver/wms?',
    title: 'Instituto Geográfico Nacional',
    version: '1.1.1'
  },
  ol: {
    ptype: 'gxp_olsource'
  },
  // google: {
  //     ptype: "gxp_googlesource"
  // },
  osm: {
    ptype: 'gxp_osmsource'
  },
  mapquest: {
    ptype: 'gxp_mapquestsource'
  },
  mapbox: {
    ptype: 'gxp_mapboxsource'
  },
  csw: {
    ptype: 'gxp_cataloguesource',
    url: IDEF_BASE_URL + '/metadatos/srv/es/csw',
    title: 'Catálogo'
  }
};
