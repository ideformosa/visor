Ext.onReady(function() {

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
        }, {
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
                    id: "layer_tree",
                    flex: 1
                }, {
                    title: "Leyenda",
                    id: "legend"
                }]
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
        }]
	},

	tools: [
        //---------- LAYER TREE ----------
        {
            ptype: "gxp_layertree",
            groups: tree_groups, // tree_groups.js
            outputConfig: {
                id: "tree",
                useArrows: true,
                autoScroll: true,
                animate: true,
                tbar: [],
                listeners: {
                   "append": setearSlider
                }
            },
            outputTarget: "layer_tree"
        },
        {
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
            addActionText: "Más...",
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
            extent: new OpenLayers.Bounds(-7335508.0601489,-3217522.8111938,-6058703.9398511,-2508187.1888062),
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
                width: 550,
                height: 350,
                draggable: true
            },
            showButtonText: true,
            buttonText:"Identificar",
            actionTarget: "map.tbar",
            toggleGroup: "tools"
        },{
            ptype: "gxp_measure",
            outputConfig: {
                width: 400,
                height: "auto"
            },
            showButtonText: true,
            actionTarget: "map.tbar",
            toggleGroup: "tools"
        }, {
            ptype: "gxp_queryform",
            featureManager: "featuremanager",
            actionTarget: ["map.tbar"],
            autoExpand: "south",
            outputConfig: {
                title: "Crear consulta",
                width: 340
            }
        }, {
            ptype: "gxp_print",
            printService: "http://idef.formosa.gob.ar/servicios/pdf/",
            includeLegend: true,
            showButtonText: true,
            actionTarget: "map.tbar"
        }, {
            actions: ["->"],
            actionTarget: "map.tbar"
        }, {
            actions: ["-"],
            actionTarget: "map.tbar"
        }, {
            actions:["<a href=\"http://idef.formosa.gob.ar/Contacto.html\" target=\"_blank\">Sugerencias / Inconvenientes...</a>"]
        },
        //---------  south grid --------------
        {
            // shared FeatureManager for feature editing, grid and querying
            ptype: "gxp_featuremanager",
            id: "featuremanager",
            autoLoadFeatures: true,
            maxFeatures: 30
        }, {
            ptype: "gxp_featuregrid",
            featureManager: "featuremanager",
            showTotalResults: true,
            //autoLoadFeature: false,
            alwaysDisplayOnMap: false,
            //displayMode: "selected",
            outputConfig: {
                id: "featuregrid",
                loadMask: true
            },
            outputTarget: "south"
        }
	],

    mapItems: [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        },{
            xtype: "gxp_scaleoverlay"
    }],
    
	defaultSourceType: "gxp_wmssource",

    sources: sources,

    map: {
        id: "mymap",
        //title: "Mapa",
        //projection: "EPSG:4326",
        projection: "EPSG:3857",
        //units: "degrees",
        //center: [-60, -24.7],
        center: [-6697106, -2862855],
        zoom: 7,
        numZoomLevels: 22,
        
        layers: layers  // layers.js
    }
});

app.mapPanel.map.addControl(
    new OpenLayers.Control.MousePosition({

        formatOutput: function(lonLat) {
            var markup = '<a target="_blank" ' +
                'href="http://spatialreference.org/ref/sr-org/7483/">' +
                'EPSG:3857</a> | ';

            point = lonLat.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));

            markup += convertDMS(point.lat) + "," + convertDMS(point.lon);
           return markup;
        }
    })
);

app.on("ready", function() {

    treeTbar = Ext.getCmp('layer_tree').items.items[0].toolbars[0];

    treeTbar.add(new Ext.Toolbar.Spacer({ width: 8 }));
    treeTbar.add(slider);
    treeTbar.doLayout();

    app.mapPanel.map.addControl(getOverviewControl());
});

});