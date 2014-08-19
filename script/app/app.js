//Ext.onReady(function() {
GeoExt.Lang.set("es");

// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;


slider = new GeoExt.LayerOpacitySlider({
    width: 120,
    layer: null,
    aggressive: true,
    inverse: true,
    plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>{opacity}%</div>'})
});


var app = new gxp.Viewer({

    proxy: "/visor/script/proxy.php?url=",

	portalConfig: {
		layout: "border",

		items: [{
            id: "centerpanel",
            xtype: "panel",
            layout: "fit",
            region: "center",
            items: ["mymap"],
            title: "I D E F - Infraestructura de Datos Espaciales de Formosa"
        }, {
            id: "westcontainer",
            region: "west",
            xtype: "panel",
            layout: "accordion",
            width: 275,
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
                bbar: ["Transparencia:&nbsp;&nbsp;", slider]
                /*listeners: {
                   "click": clickHandler
                }*/
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
            //addActionText: "Más...",
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
        }, {
            ptype: "gxp_queryform",
            featureManager: "featuremanager",
            autoExpand: "south",
            outputConfig: {
                title: "Crear consulta",
                width: 340
            },
            actionTarget: "tree.tbar",
            queryActionText: "Buscar",
            queryByLocationText: "Buscar en la extensión actual del mapa"
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
            ptype: "gxp_googlegeocoder",
            outputTarget: "map.tbar",
            outputConfig: {
                emptyText: "Buscar un lugar ..."
            }
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
            buttonText:"Info puntual",
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
            ptype: "gxp_print",
            printService: "http://idef.formosa.gob.ar/servicios/pdf/",
            includeLegend: true,
            showButtonText: true,
            actionTarget: "map.tbar"
        }, {
            actions: ["->"],
            actionTarget: "map.tbar"
        }, {
            actions:["<a href=\"http://idef.formosa.gob.ar/Contacto.html\" target=\"_blank\">Contáctenos...</a>"]
        }, {
            actions: ["-"],
            actionTarget: "map.tbar"
        }, {
            actions:["<a href=\"https://github.com/ideformosa/visor\" target=\"_blank\">GitHub</a>"]
        },

        //---------  south grid --------------
        {
            // shared FeatureManager for feature editing, grid and querying
            ptype: "gxp_featuremanager",
            id: "featuremanager",
            //autoLoadFeatures: true,
            paging: false,
            maxFeatures: 30
        }, {
            ptype: "gxp_featuregrid",
            featureManager: "featuremanager",
            showTotalResults: true,
            //autoLoadFeature: false,
            //alwaysDisplayOnMap: true,
            selectOnMap: true,
            outputConfig: {
                id: "featuregrid"
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

	defaultSourceType: "gxp_wmscsource",

    sources: sources,

    map: {
        id: "mymap",
        //projection: "EPSG:4326",
        projection: "EPSG:3857",
        //units: "degrees",
        //center: [-60, -24.7],
        center: [-6697106, -2862855],
        zoom: 7,
        numZoomLevels: 20, //Para coincidir con los niveles de capas de Google
        zoomDuration: 10, //To match Google’s zoom animation better with OpenLayers animated zooming

        layers: layers  // layers.js
    }
});

    
btnMetadatos = new Ext.Button({
    text: 'Metadatos',
    tooltip: 'Acceso a metadatos de la capa',
    icon: './theme/info-new-window.png',
    disabled: true,
    handler: function(baseItem, e){
        if (Ext.getCmp('ventanaMetadatos')) {
            Ext.getCmp('ventanaMetadatos').destroy();
        }
        new Ext.Window({
            title: 'Metadatos de la capa',
            id: 'ventanaMetadatos',
            maximizable: true,
            width: 800,
            height: 550,
            stateful : false,
            html: '<iframe src ="' + app.selectedLayer.data.metadataURLs[0].href +
                '" width="100%" height="100%"></iframe>'
        }).show();
    }
});

app.mapPanel.map.addControl(getOverviewControl());

app.mapPanel.map.addControl(new OpenLayers.Control.Permalink());

app.mapPanel.map.addControl(
    new OpenLayers.Control.MousePosition({

        formatOutput: function(lonLat) {
            markup = '<a target="_blank" ' +
                'href="http://spatialreference.org/ref/sr-org/7483/">' +
                'EPSG:3857</a> | ';

            point = lonLat.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));

            markup += convertDMS(point.lat) + "," + convertDMS(point.lon);
           return markup;
        }
    })
);

app.on("ready", function() {

    tree = Ext.getCmp('tree');
    tree.on("click", function (node, e) {
        if (node.isLeaf()) {

            slider.setLayer(node.layer);

            if (app.selectedLayer.data.metadataURLs[0]){
                btnMetadatos.enable();
            } else {
                btnMetadatos.disable();
            }
        }
    });

    treeTbar = Ext.getCmp('layer_tree').items.items[0].toolbars[0];
    treeTbar.add(btnMetadatos);
    treeTbar.doLayout();

    fgrid = Ext.getCmp('featuregrid');
    fgridBbar = fgrid.toolbars[0];
    fgridBbar.add(
        {
            iconCls: "gxp-icon-zoom-to",
            ref: "../zoomToPageButton",
            text: "Zoom a resultados",
            tooltip: "Acercar mapa a la extensión de los resultados",
            handler: function() {
                app.mapPanel.map.zoomToExtent(fgrid.store.layer.getDataExtent());
            }
        }
    );

    fgridBbar.items.items[1].toggle(); //boton Mostrar en mapa: on
});

//});