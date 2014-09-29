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
        source: "osm",
        name: "mapnik"
    }, {
        source: "ign",
        name: "IGN:limite_politico_administrativo_lim",
        title: "IGN: Límite Político Administrativo",
        group: "background",
        fixed: true,
        visibility: false
    }, {
        source: "google",
        name: "ROADMAP",
        title: "Google Streets",
        group: "background",
        visibility: false
    }, {
        source: "google",
        name: "HYBRID",
        title: "Google Hybrid",
        group: "background",
        visibility: false
    }, {
        source: "google",
        name: "SATELLITE",
        title: "Google Satellite",
        group: "background",
        MAX_ZOOM_LEVEL: 21,
        visibility: false
    }, {
        source: "ol",
        group: "background",
        fixed: true,
        type: "OpenLayers.Layer",
        args: ["En blanco", { visibility: false }]
    },

    //----- RASTER
    {
        source: "dgct",
        name: "dgct_prov_historicoparajes",
        group: "raster",
        visibility:false
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
        name: "dgct_prov_parurbanas",
        group: "cartografia",
        visibility:false
    },  {
        source: "dgct",
        name: "dgct_prov_parrurales",
        group: "cartografia",
        visibility:false
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
        source: "dgct",
        name: "prov_circunscripciones",
        group: "cartografia",
        visibility:false
    }, {
        source: "dgct",
        name: "cat_prov_manzanas",
        group: "cartografia",
        visibility:false
    }, {
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
        name: "IGN:red_vial",
        group: "ign",
        visibility:false
    }, {
        source: "ign",
        name: "IGN:red_ferroviaria",
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
        name: "IGN:localidad",
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
        name: "dgct_oeste_nombrescalles",
        group: "cartografia",
        visibility:false
    }, {
        source: "dgct",
        name: "dgct_centro_nombrescalles",
        group: "cartografia",
        visibility:false
    }, {
        source: "dgct",
        name: "dgct_este_nombrescalles",
        group: "cartografia",
        visibility:false
    }
];