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

    //----- RASTER
    {
        source: "dgct",
        name: "dgct:dgct_este_mosaicospot",
        group: "raster",
        visibility:false,
        tiled: true
    }, {
        source: "dgct",
        name: "dgct:dgct_prov_historicoparajes",
        group: "raster",
        visibility:false,
        tiled: true
    },

    //----- POLIGONOS
    
    {
        source: "ign",
        name: "sig250:continente",
        group: "ign",
        visibility:false,
        tiled: false
    }, {
        source: "dgct",
        name: "dgct:dgct_prov_parurbanas",
        group: "cartografia",
        visibility:false//,
        //tiled: false
    },  {
        source: "dgct",
        name: "dgct:dgct_prov_parrurales",
        group: "cartografia",
        visibility:false//,
        //tiled: false
    }, {
        source: "dec",
        name: "dec:dec_prov_censo2010",
        group: "estadistica",
        title:"Censo 2010 por Radio censal (sujeto a revisión)",
        visibility:false//,
        //fixed: true
    }, {
        source: "dec",
        name: "dec:dec_prov_censo2010xdpto",
        group: "estadistica",
        title:"Censo 2010 por Dpto. (sujeto a revisión)",
        visibility:false//,
        //fixed: true
    }, {
        source: "idef",
        name: "idef:reservas",
        group: "reservas",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_cuencashid",
        group: "hidrografia",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_lagembestbania",
        group: "hidrografia",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_sistbanialaest",
        group: "hidrografia",
        visibility:false,
        tiled: false
    }, {
        source: "ign",
        name: "sig250:age",
        group: "ign",
        visibility:false,
        tiled: false
    },


    //-----  LINEAS

    {
        source: "dgct",
        name: "dgct:cat_prov_manzanas",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dpv",
        name: "dpv:dpv_prov_redterciaria",
        group: "viasdecom",
        tiled: false
    }, {
        source: "dpv",
        name: "dpv:dpv_prov_rutasprov",
        group: "viasdecom",
        tiled: false
    }, {
        source: "dpv",
        name: "dpv:dpv_prov_rutasnac",
        group: "viasdecom",
        tiled: false
    }, {
        source: "dpv",
        name: "dpv:dpv_prov_distritosdpv",
        group: "viasdecom",
        visibility:false,
        tiled: false
    },  {
        source: "ign",
        name: "sig250:cam",
        group: "ign",
        visibility:false,
        tiled: false
    }, {
        source: "ign",
        name: "sig250:ffc",
        group: "ign",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_canalcorred",
        group: "hidrografia",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_riacharroy",
        group: "hidrografia",
        visibility:false,
        tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_riosppales",
        group: "hidrografia",
        visibility:false,
        tiled: false
    },


    //----- PUNTOS

    {
        source: "educ",
        name: "mce:mce_prov_escuelas",
        group: "educacion",
        title:"Unidades Educativas (sujeto a revisión)",
        visibility:false//,
        //fixed: true
    }, {
        source: "upca",
        name: "upca:upca_prov_redhidrom",
        group: "hidrografia",
        visibility:false//,
        //tiled: false
    }, {
        source: "upca",
        name: "upca:upca_prov_redpluviom",
        group: "hidrografia",
        visibility:false//,
        //tiled: false
    },
    {
        source: "ign",
        name: "sig250:cep",
        group: "ign",
        tiled: false
    },


    //----- LABELS

    {
        source: "dgct",
        name: "dgct:dgct_oeste_nombrescalles",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dgct",
        name: "dgct:dgct_centro_nombrescalles",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "dgct",
        name: "dgct:dgct_este_nombrescalles",
        group: "cartografia",
        visibility:false,
        tiled: false
    }, {
        source: "ign",
        name: "sig250:jad",
        group: "ign",
        tiled: false
    },


    //------ Raster

    //
    //
    //

    //------- Capas base
    {
        source: "ign",
        name: "sig250:lim",
        group: "background",
        fixed: true,
        selected: true,
        transparent:false
    }, {
        source: "ol",
        group: "background",
        fixed: true,
        type: "OpenLayers.Layer",
        args: ["En blanco", { visibility: false }]
    }
];