/*  ---CONFIGS---  (GeoExt.tree.LayerContainer --> Ext.tree.AsyncTreeNode)
allowChildren
allowDrag
allowDrop
checked
cls
disabled
draggable
editable
expandable
expanded
hidden
href
hrefTarget
icon
iconCls
id
isTarget
leaf
listeners
loader
qtip
qtipCfg
singleClickExpand
text
uiProvider
*/

var tree_groups = {

    "default": {
        title: "Capas adicionales",
        expanded: false
    },
    "cartografia": {
        title: "Cartografía Catastral",
        expanded: false//,  puede ser agregando esto a cada grupo ¿?¿?
        /*listeners: {
            'append': {fn: setearSlider, single: true}
        }*/
    },
    "educacion": {
        title: "Educación",
        expanded: false
    },
    "estadistica": {
        title: "Estadística y Censo",
        expanded: false
    },
    "hidrografia": {
        title: "Hidrografía",
        expanded: false
    },
    "reservas": {
        title: "Parques y Reservas",
        expanded: false
    },
    "viasdecom": {
        title: "Vías de Comunicación"//,
        //expanded: false
    },
    "raster": {
        title: "Capas Raster",
        expanded: false
    },
    "ign": {
        title: "Capas IGN (WMS)",
        expanded: false
    },

    "background": {
        title: "Capas base disponibles",
        exclusive: true
    }
};