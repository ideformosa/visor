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
            {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}
        ],
        fixed: true
    }, {
        group: "background",
        source: "ol",
        type: "OpenLayers.Layer.XYZ",
        args: [
            "CartoDB Dark Matter",
            "http://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png",
             {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}
        ],
        fixed: true,
        visibility: false
    }, {
        group: "background",
        source: "google",
        name: "ROADMAP",
        visibility: false
    }, {
        group: "background",
        source: "google",
        name: "HYBRID",
        visibility: false
    }, {
        group: "background",
        source: "google",
        name: "SATELLITE",
        MAX_ZOOM_LEVEL: 21,
        visibility: false
    }, {
        group: "background",
        source: "mapquest",
        name: "osm",
        visibility: false
    }, {
        group: "background",
        source: "osm",
        name: "mapnik",
        visibility: false
    }, {
        group: "background",
        source: "ign",
        name: "ideign:LIMITE_POLITICO_ADMINISTRATIVO",
        title: "IGN: Límite Político Administrativo",
        fixed: true,
        visibility: false
    }, {
        group: "background",
        source: "ol",
        type: "OpenLayers.Layer",
        args: [ "En blanco" ],
        fixed: true,
        visibility: false
    },

    //----- RASTER
    {
        source: "dgct",
        name: "0",
        group: "raster",
        visibility:false,
        tiled: false
    }, {
        source: "dpv",
        name: "dpv_prov_satelital",
        group: "raster",
        visibility:false
    }, {
        source: "dpv",
        name: "dpv_aybal_rasterhd",
        group: "raster",
        visibility:false
    }, {
        source: "dpv",
        name: "dpv_pilco_rasterhd",
        group: "raster",
        visibility:false
    }, {
        source: "dpv",
        name: "dpv_lomitas_rasterhd",
        group: "raster",
        visibility:false
    },
    //----- POLIGONOS
    {
        source: "dgct",
        name: "2",
        group: "cartografia",
        visibility:false,
        tiled: false
    },  {
        source: "dgct",
        name: "3",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dgct",
        name: "4",
        group: "cartografia",
        visibility:false,
        tiled: false
    },  {
        source: "dgct",
        name: "5",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dgct",
        name: "6",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dec",
        name: "dec_prov_censo2010",
        group: "estadistica",
        title:"Censo 2010 por Radio censal (sujeto a revisión)",
        visibility:false
    }, {
        source: "dec",
        name: "dec_prov_censo2010xdpto",
        group: "estadistica",
        title:"Censo 2010 por Dpto. (sujeto a revisión)",
        visibility:false
    }, {
        source: "mpa",
        name: "prov_reservas",
        group: "reservas",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_cuencashid",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_lagembestbania",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_sistbanialaest",
        group: "hidrografia",
        visibility:false
    }, {
        source: "mce",
        name: "mce_delzonales",
        group: "educacion",
        title:"Delegaciones Zonales",
        visibility:false
    },
    //-----  LINEAS
    {
        source: "dpv",
        name: "dpv_prov_redterciaria",
        group: "viasdecom",
        visibility:false

    }, {
        source: "dpv",
        name: "dpv_prov_rutasprov",
        group: "viasdecom"
    }, {
        source: "dpv",
        name: "dpv_prov_rutasnac",
        group: "viasdecom"
    }, {
        source: "dpv",
        name: "dpv_prov_distritosdpv",
        group: "viasdecom",
        visibility:false
    },  {
        source: "ign",
        name: "ideign:red_vial",
        group: "ign",
        visibility:false
    }, {
        source: "ign",
        name: "ideign:RED_FERROVIARIA",
        group: "ign",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_canalcorred",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_riacharroy",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_riosppales",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upsti",
        name: "tendido-fibra",
        group: "comunicacion",
        visibility:false
    },
    //----- PUNTOS
    {
        source: "mce",
        name: "mce_fp",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_permanente",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_especial",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_superior",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_secundario",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_primario",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "mce",
        name: "mce_inicial",
        group: "educacion",
        // title:"Unidades Educativas (sujeto a revisión)",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_redhidrom",
        group: "hidrografia",
        visibility:false
    }, {
        source: "upca",
        name: "upca_prov_redpluviom",
        group: "hidrografia",
        visibility:false
    }, {
        source: "ign",
        name: "ideign:localidades",
        group: "ign",
        visibility: false
    },  {
        source: "upsti",
        name: "puntos-conectados",
        group: "comunicacion",
        visibility:false
    },
    //----- LABELS
    {
        source: "dgct",
        name: "1",
        group: "cartografia",
        tiled: false,
        visibility:false
    }
];
