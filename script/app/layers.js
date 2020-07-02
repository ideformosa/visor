/*
Valid config options for all layer sources:

    source: String referencing a source from sources
    name: String - the name from the source’s store (only for sources that maintain a store)
    visibility: Boolean - initial layer visibility
    opacity: Number - initial layer.opacity
    group: String - group for the layer when the viewer also uses a gxp.plugins.LayerTree. Set this to “background” to make the layer a base layer
    fixed: Boolean - Set to true to prevent the layer from being removed by a gxp.plugins.RemoveLayer tool and from being dragged in a gxp.plugins.LayerTree
    selected: Boolean - Set to true to mark the layer selected
*/
var layers = [
  //------- Capas base
  {
    group: "background",
    source: "ol",
    type: "OpenLayers.Layer.XYZ",
    args: [
      "CartoDB Positron",
      "http://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png",
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }
    ]
  },
  {
    group: "background",
    source: "ol",
    type: "OpenLayers.Layer.XYZ",
    args: [
      "CartoDB Dark Matter",
      "http://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png",
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }
    ],
    visibility: false
  },
  // {
  //   group: "background",
  //   source: "ol",
  //   type: "OpenLayers.Layer.XYZ",
  //   args: [
  //     "Google Roadmap",
  //     "https://mt0.google.com/vt/lyrs=r&x=${x}&y=${y}&z=${z}",
  //     {
  //       attribution: "Powered by Google"
  //     }
  //   ],
  //   visibility: false
  // },
  // {
  //   group: "background",
  //   source: "ol",
  //   type: "OpenLayers.Layer.XYZ",
  //   args: [
  //     "Google Hybrid",
  //     "https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}",
  //     {
  //       attribution: "Powered by Google"
  //     }
  //   ],
  //   visibility: false
  // },
  // {
  //   group: "background",
  //   source: "ol",
  //   type: "OpenLayers.Layer.XYZ",
  //   args: [
  //     "Google Satellite",
  //     "https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x=${x}&y=${y}&z=${z}",
  //     { attribution: "Powered by Google" }
  //   ],
  //   visibility: false
  // },
  // {
  //   group: "background",
  //   source: "mapquest",
  //   name: "osm",
  //   visibility: false
  // },
  {
    group: "background",
    source: "osm",
    name: "mapnik",
    visibility: false
  },
  {
    group: "background",
    source: "ign",
    name: "ign:departamento",
    title: "IGN: Departamentos",
    fixed: true,
    visibility: false
  },
  {
    group: "background",
    source: "ol",
    type: "OpenLayers.Layer",
    args: ["En blanco"],
    fixed: true,
    visibility: false
  },

  //----- RASTER
  {
    source: "dgct",
    name: "HistoricoParajes",
    title: "Histórico Parajes",
    group: "raster",
    visibility: false,
    tiled: false
  },
  {
    source: "dpv",
    name: "dpv_prov_satelital",
    group: "raster",
    visibility: false
  },
  {
    source: "dpv",
    name: "dpv_aybal_rasterhd",
    group: "raster",
    visibility: false
  },
  {
    source: "dpv",
    name: "dpv_pilco_rasterhd",
    group: "raster",
    visibility: false
  },
  {
    source: "dpv",
    name: "dpv_lomitas_rasterhd",
    group: "raster",
    visibility: false
  },
  //----- POLIGONOS
  {
    source: "dgct",
    name: "ParcelasRurales",
    title: "Parcelas Rurales",
    group: "cartografia",
    visibility: false,
    tiled: false
  },
  {
    source: "dgct",
    name: "ParcelasUrbanas",
    title: "Parcelas Urbanas",
    group: "cartografia",
    visibility: false,
    tiled: false
  },
  {
    source: "dgct",
    name: "Circunscripciones",
    group: "cartografia",
    visibility: false,
    tiled: false
  },
  {
    source: "dgct",
    name: "Ejidos",
    title: "Ejidos Municipales",
    group: "cartografia",
    visibility: false,
    tiled: false
  },
  {
    source: "dgct",
    name: "Manzanas",
    group: "cartografia",
    visibility: false,
    tiled: false
  },
  {
    source: "dec",
    name: "censo2010_xradio",
    group: "estadistica",
    title: "Censo 2010 por Radio censal (sujeto a revisión)",
    visibility: false
  },
  {
    source: "dec",
    name: "censo2010_xdpto",
    group: "estadistica",
    title: "Censo 2010 por Dpto. (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mpa",
    name: "reservas",
    group: "reservas",
    visibility: false
  },
  {
    source: "upca",
    name: "cuencas_hidricas",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upca",
    name: "lagu_embal_est_baniado",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upca",
    name: "sist_baniado_estrella",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_delzonales",
    group: "educacion",
    title: "Delegaciones Zonales",
    visibility: false
  },
  //-----  LINEAS
  {
    source: "dpv",
    name: "dpv_prov_redterciaria",
    group: "viasdecom",
    visibility: false
  },
  {
    source: "dpv",
    name: "dpv_prov_rutasprov",
    group: "viasdecom"
  },
  {
    source: "dpv",
    name: "dpv_prov_rutasnac",
    group: "viasdecom"
  },
  {
    source: "dpv",
    name: "dpv_prov_distritosdpv",
    group: "viasdecom",
    visibility: false
  },
  {
    source: "ign",
    name: "ign:lineas_de_transporte_ferroviario_AN010",
    group: "ign",
    visibility: false
  },
  {
    source: "upca",
    name: "canales_correderas",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upca",
    name: "riachos_arroyos",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upca",
    name: "rios_principales",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upsti",
    name: "tendido-fibra",
    group: "comunicacion",
    visibility: false
  },
  //----- PUNTOS
  {
    source: "mce",
    name: "mce_fp",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_permanente",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_especial",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_superior",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_secundario",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_primario",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "mce",
    name: "mce_inicial",
    group: "educacion",
    // title:"Unidades Educativas (sujeto a revisión)",
    visibility: false
  },
  {
    source: "upca",
    name: "red_hidrometrica",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "upca",
    name: "red_pluviometrica",
    group: "hidrografia",
    visibility: false
  },
  {
    source: "ign",
    name: "ign:puntos_de_asentamientos_y_edificios_localidad",
    group: "ign",
    title: "Localidades",
    visibility: false
  },
  {
    source: "upsti",
    name: "puntos-conectados",
    group: "comunicacion",
    visibility: false
  },
  //----- LABELS
  {
    source: "dgct",
    name: "Calles",
    group: "cartografia",
    tiled: false,
    visibility: false
  }
];
