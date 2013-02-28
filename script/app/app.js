//Ext.onReady(function() {

GeoExt.Lang.set("es");

var app = new gxp.Viewer({

    proxy: "/viewer/script/proxy.php?url=",
    
	portalConfig: {
		layout: "border",

		items: [{
            id: "centerpanel",
            xtype: "panel",
            layout: "fit",
            region: "center",
            items: ["mymap"]
        },
        /*{
            id: "northtbar",
            xtype: "toolbar",
            region: "north",
            items: []
        },*/
        {
            id: "westcontainer",
            region: "west",
            xtype: "panel",
            layout: "accordion",
            width: 250,
            //border: false,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            header: false,
            //hideCollapseTool: true,
            defaults: {
                width: "100%",
                layout: "fit"
            },
            items: [{
                    title: "Capas",
                    id: "layers_tree",
                    //border: false,
                    flex: 1
                }, {
                    title: "Leyenda",
                    id: "legend"
                }, {
                    title: "Fuentes",
                    id: "fuentes"
                }]
            //}]
        }, {
                // container for the FeatureGrid
                region: "south",
                xtype: "panel",
                id: "south",
                height: 150,
                border: false,
                split: true,
                collapsible: true,
                collapseMode: "mini",
                collapsed: true,
                //hideCollapseTool: true,
                //header: false,
                title:"Atributos",
                layout: "fit"
        } /*,{context
            id: "eastcontainer",
            xtype: "container",
            //xtype: "gxp_querypanel",
            layout: "vbox",
            region: "east",
            width: 200,
            collapsible: true,
            defaults: {
                width: "100%",
                layout: "fit"
            },
            //map: "map"
            items: [{
                id:"query",
                title:"query"
            }]
        }*/
        ]
	},

	tools: [
        //---------- tabs ----------
        {
            ptype: "gxp_layertree",
            groups: tree_groups, // tree_groups.js
            outputConfig: {
                id: "tree",
                useArrows: true,
                autoScroll: true,
                animate: true,
                tbar: [],
                bbar: ["Opacidad: ", i]//,
                /*listeners: {
                    "insert": setearSlider,
                    "append": setearSlider
                }*/
            },
            outputTarget: "layers_tree"
        }, {
            ptype: "gxp_legend",
            outputTarget: "legend",
            outputConfig: {
                header: false,
                autoScroll: true
            }
        },
        //------- tree.tbar --------
        {
            ptype: "gxp_addlayers",
            actionTarget: "tree.tbar"
        }, {
            ptype: "gxp_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gxp_zoomtolayerextent",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gxp_layerproperties",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        },
        //------- map.tbar ---------
        {
            ptype: "gxp_navigationhistory",
            actionTarget: "map.tbar"
        }, {
            ptype: 'gxp_navigation',
            actionTarget: "map.tbar",
            toggleGroup: "mapnav"
        }, {
            actions: ["-"],
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_zoomtoextent",
            actionTarget: "map.tbar",
            extent: new OpenLayers.Bounds(-63, -27.2, -57, -22.2),
            tooltip: "Ver extensión inicial"
        },{
            ptype: "gxp_zoom",
            showZoomBoxAction: true,
            actionTarget: "map.tbar",
            toggleGroup: "mapnav"
        }, {
            actions: ["-"],
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_wmsgetfeatureinfo",
            //format: "grid",
            outputConfig: {
                width: 500, //"auto",
                height: 400,
                draggable: true
            },
            showButtonText: true,
            actionTarget: "map.tbar",
            toggleGroup: "mapnav"
        },{
            ptype: "gxp_measure",
            outputConfig: {
                width: 400,
                height: "auto"
            },
            showButtonText: true,
            actionTarget: "map.tbar",
            toggleGroup: "mapnav"
        }, {
            ptype: "gxp_print",
            printService: "http://idef.formosa.gob.ar/servicios/pdf/",
            includeLegend: true,
            showButtonText: true,
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_queryform",
            featureManager: "featuremanager",
            outputConfig: {
                title: "Query",
                width: 320
            },
            actionTarget: ["map.tbar"], //["featuregrid.bbar", "tree.contextMenu"],
            appendActions: false
        }, {
            actions: ["->"],
            actionTarget: "map.tbar"
        }, {
            actions: ["loginbutton"],
            actionTarget: "map.tbar"
        },
        //---------  south grid --------------
        {
            // shared FeatureManager for feature editing, grid and querying
            ptype: "gxp_featuremanager",
            id: "featuremanager",
            maxFeatures: 20
        }, {
            ptype: "gxp_featuregrid",
            featureManager: "featuremanager",
            outputConfig: {
                id: "featuregrid"
            },
            outputTarget: "south"
        }
        
        /*,{
            xtype:"gxp_querypanel",
            map:"mymap",
            outputTarget: "query"
        }*/
	],

    mapPlugins: {
        ptype:"gxp_loadingindicator",
        loadingMapMessage:"Cargando mapa..."
    },
    
	defaultSourceType: "gxp_wmssource",

    sources: sources,

    map: {
        id: "mymap",
        //title: "Mapa",
        projection: "EPSG:4326",
        units: "degrees",
        center: [-60, -24.7],
        zoom: 7,
        //stateId: "map",
        //prettyStateKeys: true,
        //extent: new OpenLayers.Bounds(-63, -28, -57, -22),
        //extent: [-63, -28, -57, -22],

        layers: layers,  // layers.js

        items: [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        },{
            xtype: "gxp_scaleoverlay"
        }]
    }
});

app.mapPanel.map.addControl(
    new OpenLayers.Control.MousePosition({

        formatOutput: function(lonLat) {
           var markup = convertDMS(lonLat.lat);
           markup += "," + convertDMS(lonLat.lon);
           return markup;
        }

        /*prefix: '<a target="_blank" ' +
            'href="http://spatialreference.org/ref/epsg/4326/">' +
            'EPSG:4326</a> coordinates: ',
        separator: ' | ',
        numDigits: 3 ,
        emptyString: 'Mouse is not over map.'*/
    })
);

/*app.mapPanel.map.events.register("mousemove", app.mapPanel.map, function(e) {
    var position = this.events.getMousePosition(e);
    OpenLayers.Util.getElement("coords").innerHTML = position;
});*/


//});
