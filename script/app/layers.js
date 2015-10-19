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
        source: "ign",
        name: "ideign:LIMITE_POLITICO_ADMINISTRATIVO",
        title: "IGN: Límite Político Administrativo",
        group: "background",
        fixed: true
    }, {
        source: "ol",
        group: "background",
        fixed: true,
        type: "OpenLayers.Layer.XYZ",
        args: [
            "CartoDB Dark Matter", 
            "http://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png",
             {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}
        ],
        visibility: false
    }, {
        source: "ol",
        group: "background",
        fixed: true,
        type: "OpenLayers.Layer.XYZ",
        args: [
            "CartoDB Positron", 
            "http://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png",
            {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}
        ],
        visibility: false
    }, {
        source: "google",
        name: "ROADMAP",
        group: "background"
    }, {
        source: "google",
        name: "HYBRID",
        group: "background"
    }, {
        source: "google",
        name: "SATELLITE",
        group: "background",
        MAX_ZOOM_LEVEL: 21
    }, {
        source: "mapquest",
        name: "osm"
    }, {
        source: "osm",
        name: "mapnik",
        visibility: false
    }, {
        source: "ol",
        group: "background",
        fixed: true,
        type: "OpenLayers.Layer",
        args: ["En blanco"],
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
        name: "mce_prov_delzonales",
        group: "educacion",
        title:"Delegaciones Zonales",
        visibility:false
    },
    //-----  LINEAS
    {
        source: "dpv",
        name: "dpv_prov_redterciaria",
        group: "viasdecom"
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
    },
    //----- PUNTOS
    {
        source: "mce",
        name: "mce_prov_escuelas",
        group: "educacion",
        title:"Unidades Educativas (sujeto a revisión)",
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
    }, {
        source: "mdh",
        name: "prov_centrossalud",
        group: "salud",
        visibility:false
    },
    //----- LABELS
    {
        source: "dgct",
        name: "1",
        group: "cartografia",
        visibility:false,
        tiled: false
    }
];