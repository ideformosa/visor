//Ext.onReady(function() {

GeoExt.Lang.set("es");

//new Ext.Button({id: "loginbutton"});

var app = new gxp.Viewer({  //IDEF.Visor({

    //authStatus: 401, //{{status}},

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
                    id: "layer_tree",
                    //border: false,
                    flex: 1
                }, {
                    title: "Leyenda",
                    id: "legend"
                }/*, {
                    title: "Fuentes",
                    id: "fuentes"
                }*/]
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
                //bbar: ["Opacidad: ", i]//,
                listeners: {
                 //   "insert": setearSlider,
                   "append": setearSlider
                   //"click": setearSlider
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
        /*{
            xtype: "gx_opacityslider",
            outputConfig: {
                id: "op_slider",
                width: 120,
                decimalPrecision: 1,
                increment: 10,
                value: 50,
                //disabled: true,
                layer: null //,
                listeners: {
                    change: function (a, b) {
                        this.layer.setOpacity(b / 100);
                    }
                }
            },
            outputTarget: "tree.tbar"
        },*/
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
                width: 550, //"auto",
                height: 350,
                draggable: true
            },
            showButtonText: true,
            buttonText:"Identificar",
            //text: "Identificar",
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
            actionTarget: ["map.tbar"], //["featuregrid.bbar", "tree.contextMenu"],
            //appendActions: false,
            autoExpand: "south",
            //outputTarget: "south",
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
        }, /*{
            actions: ["loginbutton"],
            actionTarget: "map.tbar"
        },*/ {
            actions: ["-"],
            actionTarget: "map.tbar"
        }, {
            actions:["<a href=\"http://idef.formosa.gob.ar/Contacto.html\" target=\"_blank\">Sugerencias / Inconvenientes...</a>"]
        },

        /*{
            ptype: "cgxp_login",
            actionTarget: 'map.tbar',
            //toggleGroup: "maptools",
            loginURL: "login",
            logoutURL: "logout",
            extraHtml: "Hey, want a <b>login</b>? You can <a href='some_url'>register here</a>.<br />How cool is that?"
        },*/


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
            alwaysDisplayOnMap: false, //ver******
            //displayMode: "selected",
            outputConfig: {
                id: "featuregrid",
                loadMask: true
            },
            outputTarget: "south"
        }
        /*,{
            xtype:"gxp_querypanel",
            map:"mymap",
            outputTarget: "query"
        }*/
	],

    mapItems: [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100//,
            /*plugins: new GeoExt.ZoomSliderTip({
                template: this.zoomSliderText
            })*/
        },{
            xtype: "gxp_scaleoverlay"
    }],

    /*mapPlugins: {
        ptype:"gxp_loadingindicator",
        loadingMapMessage:"Cargando mapa..."
    },*/
    
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

        /*prefix: '<a target="_blank" ' +
            'href="http://spatialreference.org/ref/epsg/4326/">' +
            'EPSG:4326</a> coordinates: ',
        separator: ' | ',
        numDigits: 3 ,
        emptyString: 'Mouse is not over map.'*/
    })
);

app.on("ready", function() {

    treeTbar = Ext.getCmp('layer_tree').items.items[0].toolbars[0];

    treeTbar.add(new Ext.Toolbar.Spacer({ width: 8 }));
    treeTbar.add(slider);
    treeTbar.doLayout();

    //this.portal.items.items[1].items.items[0].items.items[0].toolbars[0].doLayout();
    //Ext.getCmp('layer_tree').items.items[0].toolbars[0].add(slider);
    app.mapPanel.map.addControl(getOverviewControl());

    //alert(app.mapPanel.map.getExtent());

    /*
    var datapoint = new OpenLayers.LonLat(-60, -24.7);
    var proj_1 = new OpenLayers.Projection("EPSG:4326");
    var proj_2 = new OpenLayers.Projection("EPSG:900913");
    datapoint.transform(proj_1, proj_2);

    app.mapPanel.map.setCenter(datapoint, 7);
    */

    /*gsat = new OpenLayers.Layer.Google("Google Imagery", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 22,
        transitionEffect: "resize"
    });*/

    /*var gsat = new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: G_SATELLITE_MAP, numZoomLevels: 22}
            );*/

    /*var gsat = new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            );

    app.mapPanel.map.addLayer(gsat); */
});

//});