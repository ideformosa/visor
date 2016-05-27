/*jshint multistr: true */
GeoExt.Lang.set("es");
// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

var idef = idef || {};

idef.visor = (function () {
  'use strict';

  var _app;

  function init() {
    initApp();
    _addExtraControls();
    _bindHandlers();
  }

  function initApp() {
    _app = new gxp.Viewer({

      proxy: "/cgi-bin/proxy.cgi?url=",

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
          title: "Atributos",
          layout: "fit"
        }]
      },

    	tools: [
        //--------- layer_tree ---------
        {
          ptype: "gxp_layertree",
          groups: tree_groups, // tree_groups.js
          outputConfig: {
            id: "tree",
            useArrows: true,
            autoScroll: true,
            animate: true,
            tbar: [],
            bbar: [
              "Transparencia:&nbsp;&nbsp;",
              {
                xtype: "gx_opacityslider",
                id: 'transp_slider',
                width: 120,
                layer: null,
                aggressive: true,
                inverse: true,
                plugins: new GeoExt.LayerOpacitySliderTip({
                  template: '<div>{opacity}%</div>'
                })
              }
            ]
          },
          outputTarget: "layer_tree"
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
          //addActionText: "Más...",
          actionTarget: "tree.tbar",
          search: {selectedSource: "csw"},
          findActionMenuText: "Buscar Capas...",
          searchText: "Buscar capas en el Catálogo"
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
          queryActionTip: "Busque datos dentro de los atributos de la capa.",
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
          extent: new OpenLayers.Bounds(-7335508.0601489,-3217522.8111938,
            -6058703.9398511,-2508187.1888062),
          tooltip: "Ver extensión inicial"
        }, {
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
          buttonText: "Info puntual",
          actionTarget: "map.tbar",
          toggleGroup: "tools"
        }, {
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
          actions: ["<a href=\"http://idef.formosa.gob.ar/?q=contact\" \
            target=\"_blank\">Contáctenos...</a>"]
        }, {
          actions: ["-"],
          actionTarget: "map.tbar"
        }, {
          actions: ["<a href=\"https://github.com/ideformosa/visor\" \
            target=\"_blank\">GitHub</a>"]
        },
        //------- south grid ------------
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
          outputConfig: { id: "featuregrid" },
          outputTarget: "south"
        }
      ],

      mapItems: [{
        xtype: "gx_zoomslider",
        vertical: true,
        height: 100
      }, {
        xtype: "gxp_scaleoverlay"
      }],

      mapPlugins: {
        ptype: "gxp_loadingindicator",
        onlyShowOnFirstLoad: true,
        loadingMapMessage: "Cargando mapa..."
      },

      defaultSourceType: "gxp_wmscsource",

      sources: sources,  // sources.js

      map: {
        id: "mymap",
        //projection: "EPSG:4326",
        projection: "EPSG:3857",
        //units: "degrees",
        //center: [-60, -24.7],
        center: [-6697106, -2862855],
        zoom: 7,
        numZoomLevels: 20, //Para coincidir con los niveles de capas de Google
        zoomDuration: 10, //To match Google’s zoom animation
        layers: layers  // layers.js
      }
    });
  }

  // agrega controles que no incorpora gxp
  function _addExtraControls() {
    var capaOverview, overview, mousePosition;
    var map = _app.mapPanel.map;

    // capa para minimap
    capaOverview = new OpenLayers.Layer.OSM(
      "OSM",
      ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
      "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
      "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]
    );

    // minimap
    overview = new OpenLayers.Control.OverviewMap({
      mapOptions: { projection: new OpenLayers.Projection("EPSG:3857") },
      maximizeTitle: 'Mostrar mapa de referencia',
      minimizeTitle: 'Ocultar mapa de referencia',
      layers: [ capaOverview ]
    });

    // coordenadas en el mapa
    mousePosition = new OpenLayers.Control.MousePosition({
      formatOutput: function (lonLat) {
        var markup, point;

        markup = '<a target="_blank" ' +
          'href="http://spatialreference.org/ref/sr-org/7483/">' +
          'EPSG:3857</a> | ';

        point = lonLat.transform(new OpenLayers.Projection("EPSG:3857"),
          new OpenLayers.Projection("EPSG:4326"));

        markup += idef.utils.dd2dms(point.lat) + "," +
          idef.utils.dd2dms(point.lon);

        return markup;
      }
    });

    // agregar controles al mapa
    map.addControl(overview);
    map.addControl(mousePosition);
    map.addControl(new OpenLayers.Control.Permalink());

    _app.on("ready", function() {
      var treeTbar, fgridBbar;

      treeTbar = Ext.getCmp('tree').getTopToolbar();
      treeTbar.addButton({
        id: 'btn-metadatos',
        text: 'Metadatos',
        tooltip: 'Vea más información acerca de la capa seleccionada (fechas, ' +
          'responsable, info. de contacto, escalas, SRS, etc.)',
        icon: './theme/info-new-window.png',
        disabled: true
      });
      treeTbar.doLayout();

      fgridBbar = Ext.getCmp('featuregrid').getBottomToolbar();
      fgridBbar.addButton({
        iconCls: "gxp-icon-zoom-to",
        ref: "../zoomToPageButton",
        text: "Zoom a resultados",
        tooltip: "Acercar mapa a los resultados",
        handler: function() {
          map.zoomToExtent(
            Ext.getCmp('featuregrid').store.layer.getDataExtent()
          );
        }
      });

      //boton Mostrar en mapa: on
      fgridBbar.items.items[1].toggle();
    });
  }

  // agregar handlers
  function _bindHandlers() {
    _app.on("ready", function() {
      var tree, slider, btnMetadatos;

      tree = Ext.getCmp('tree');
      slider = Ext.getCmp('transp_slider');
      btnMetadatos = Ext.getCmp('btn-metadatos');

      // extiende el evento click
      tree.on("click", function (node, e) {
        if (node.isLeaf()) {
          //setear transparencia
          slider.setLayer(node.layer);

          // disponibilidad metadatos
          if (_app.selectedLayer.data.metadataURLs &&
            _app.selectedLayer.data.metadataURLs[0]){
              btnMetadatos.enable();
          } else {
              btnMetadatos.disable();
          }
        }
      });

      btnMetadatos.on('click', function(button, e) {
        if (Ext.getCmp('ventanaMetadatos'))
          Ext.getCmp('ventanaMetadatos').destroy();

        new Ext.Window({
          id: 'ventanaMetadatos',
          title: 'Metadatos de la capa',
          maximizable: true,
          width: 800,
          height: 550,
          stateful : false,
          html: '<iframe src ="' + _app.selectedLayer.data.metadataURLs[0].href +
            '" width="100%" height="100%"></iframe>'
        }).show();
      });
    });
  }

  return {
    init: init
  };
}());
