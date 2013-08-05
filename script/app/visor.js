// Esto hace que los servidores carguen OK cuando reciben mucho trafico
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 10;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
Ext.BLANK_IMAGE_URL = 'img/s.gif';


// Para que recuerde las configuraciones mediante cookies
var cookieprovider = new Ext.state.CookieProvider({
   expires: new Date(new Date().getTime()+(1000*60*60*24*30)) //30 days
});
Ext.state.Manager.setProvider(cookieprovider);


var sololecturainterfaz = true; //inicialmente se inicia en sololectura a interfaz
	// Si el usuario es sololectura el privilegio efectivo en la interfaz se cambia ahora
	if (sololectura) {
		sololecturainterfaz = true;
	} else {
		sololecturainterfaz = false; // esta es la variable que puede cambiarse dinamicamente desde el cliente salvo que el tipo sea sololectura
	}

// Para que se vean los tooltip en el arbol de capas.
Ext.QuickTips.init();

function refrescarCapas() {
	// Capas WMS
	var capasWms = map.getLayersByClass('OpenLayers.Layer.WMS');
	for (var i = 0; i < capasWms.length; i++) {
		capasWms[i].redraw(1);
	}
	// Capas WFS
	var capasWfs = map.getLayersByClass('OpenLayers.Layer.Vector');
	for (var i = 0; i < capasWfs.length; i++) {
		capasWfs[i].refresh({force:true});
	}
}


// Barra de herramientas para la grilla
	var tbargrid = new Ext.Toolbar([]);

// este contenedor es para poder reventar el grid y rearmarlo cuando inicio la edicion o cambio de layer
	var contenedordegrid = new Ext.Panel({
		id: 'contenedordegrid',
		title: 'Este es un contenedor para contener al grid',
		header: false,
		//autoDestroy:false,
		width: 600,
		height: 170,
		tbar: tbargrid // en blanco. Se llena dependiendo del layer que se encuentre en edicion
	});


// VARIABLES GLOBALES
var editorTabPanel, arbolFiltros;

// Graticule con la grilla de meridianos y paralelos.
var graticule;

// Esta es la leyenda real
var legendPanel = new GeoExt.LegendPanel();

// De esta leyenda saco los layers vectoriales.
var cloneLegLayerStore = new GeoExt.data.LayerStore();
var cloneLegPanel = new GeoExt.LegendPanel({
	layerStore: cloneLegLayerStore
})


var mapPanel;
var model_suelos, model_integrado;
var map, toolbar, modeloseleccionado;
var layeractivo, tabPanel, escala, cajatextotopo;
var ventanaXY, ventanaMedicion;
//var visorGE, ventanaGE;
var visorcreado = false;
var listadelayersseleccionables = [];
var sugerenciasmostradas = false;
var arr_sugerencias = ["Puede cambiar el <b>orden de las capas</b><br><img src='./___mfclient/mfbase/ext/resources/images/default/tree/drop-between.gif'> arrastr&aacute;ndolas en el &aacute;rbol de capas.","<br>Si lo desea, puede cambiar<br>el  <b>Mapa de fondo</b><br>"];
var delaysugerencia = 45000;
var miSugerencia = arr_sugerencias[Math.floor(Math.random()*arr_sugerencias.length)];

var panelEdicion;
var eliminarVector;
var capaEnEdicion;
var comboCampaniasFiltros;

var subeFotos;


// Defino el estilo de los marcadores para el nomenclador
var iconsize = new OpenLayers.Size(40,40);
var offset = new OpenLayers.Pixel(-20, -20);
var icon = new OpenLayers.Icon('./img/telescopica.png', iconsize, offset);



/** Busqueda de lugares en el json de propietarios de campos
*/
function buscarPropietario(abuscar) {
		Ext.example.msg(msj[3], msj[4]);

		//var cadbusqtopo = Ext.getCmp('cajatextotopo').getValue();
		var cadbusqtopo = abuscar;

		var url_proxy = "http://" + el_host + lacarpeta + "/php/json/buscador.php?idusuario=" + usuario_logueado + "&busca=" + cadbusqtopo;
		//alert(url_proxy);
		var proxy = new Ext.data.HttpProxy({url:url_proxy});
		var reader = new Ext.data.JsonReader(
			{totalProperty:'totalresultados', root:'resultados'},
			[
				{name:'icono', type:'string'},
				{name:'origen', type:'string'},
				{name:'rank', type:'float'},
				{name:'denominacion', type:'string'},
				{name:'idusuario', type:'string'},
				{name:'descriptio', type:'string'},
				{name:'pais', type:'string'},
				{name:'bandera', type:'string'},
				{name:'lon', type:'float'},
				{name:'lat', type:'float'}
			]
		);
		// Almacen con los resulados de la busqueda
		var datosnomenclador = new Ext.data.Store({
			proxy: proxy,
			reader: reader
		});
		datosnomenclador.load();
		// Activo la pestania que contiene los resultados del nomenclador. Es por Id de cada pestania, sino no funciona !!!
		tabPanel.activate('3');
		Ext.getCmp('accordionNomenclador').expand();
		// Limpio el div del texto que tiene
		Ext.get('nomenclador').update('');
		// Agraga la descripcion del toponimos cuando se cliquea en el signomas
		var expansor = new Ext.grid.RowExpander({
			tpl: new Ext.Template(
				'<p style="font-family:Verdana"><img src="./images/flags/{bandera}" width="25"> Origen: {origen}<br>Detalles: {denominacion}<br>{descriptio}<br>Usuario: {idusuario}</p>'
			)
		});
		// Muestra en negrita el nombre del toponimo
		function negrita(val) {
			return '<b>' + val + '</b>';
		}
		// Carga la imagen del tipo de elemento buscado en la grilla de busqueda
		function dameimagen(val) {
			return '<img src=./images/buscador/' + val + '>';
		}
		// Grilla que contiene los resultados del nomenclador
		var grillanomenclador = new Ext.grid.GridPanel({
			store: datosnomenclador,
			columns: [
				expansor,
				{
					//id:'icono',
					//header: "i",
					width: 30,
					renderer: dameimagen,
					sortable: true,
					dataIndex: 'icono',
					tooltip:msj[5]
				},
				{
					id:'nom_prop',
					header: "Nombre",
					width: 100,
					renderer: negrita,
					sortable: true,
					dataIndex: 'denominacion',
					tooltip:msj[5]
				},
				{
					header: "Tipo",
					width: 75,
					sortable: true,
					autoextend: true,
					renderer: Ext.util.Format.uppercase,
					dataIndex: 'pais',
					tooltip:msj[5]
				}
			],
			autoExpandColumn: '3',
			autoHeight:true,
			autoScroll: true,
			plugins: expansor,
			height: 300,
			el: 'nomenclador'
		});
		grillanomenclador.render();
		grillanomenclador.expand();
		// Registro el evento click en la fila del nomenclador
		grillanomenclador.on('rowclick', function(grid, rowIndex, e) {
			var regsel = grillanomenclador.getSelectionModel().getSelected();
			var coordgeo = new OpenLayers.LonLat(regsel.get('lon'), regsel.get('lat'));
			var coorddestino = coordgeo.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
			marcadores.addMarker(new OpenLayers.Marker(coorddestino, icon));
			map.panTo(coorddestino);
		});
		// Registro el evento dobleclick en la fila del nomenclador
		grillanomenclador.on('rowdblclick', function(grid, rowIndex, e) {
			var regsel = grillanomenclador.getSelectionModel().getSelected();
			var coordgeo = new OpenLayers.LonLat(regsel.get('lon'),regsel.get('lat'));
			var coorddestino = coordgeo.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
			//var zoom = map.getZoomForResolution(OpenLayers.Util.getResolutionFromScale(regsel.get('escala')));
			var zoom = 14;
			map.setCenter(coorddestino, zoom);
			// contenido de la nube del popup
			var contenido = '<table style="border-style:none;font-size:0.9em;font-family:Verdana">' +
				'<tr><td><b>Origen: </b></td><td>' + regsel.get('origen') + '</td></tr>' +
				'<tr><td><b>Denominaci&oacute;n: </b></td><td>' + regsel.get('denominacion') + '</td></tr>' +
				'<tr><td><b>Usuario: </b></td><td>' + regsel.get('idusuario') + '</td></tr>' +
				'<tr><td><b>Longitud: </b></td><td>' + regsel.get('lon').toFixed(5) + '</td></tr>' +
				'<tr><td><b>Latitud: </b></td><td>' + regsel.get('lat').toFixed(5) + '</td></tr>' + '</table>';
			// popup nublado :)
			var nomenclaPopup = new OpenLayers.Popup.FramedCloud(
				"nomenclador_popup",
				coorddestino,
				null,
				contenido,
				null,
				true
			);
			map.addPopup(nomenclaPopup);
		});
}

/*
------------------------ESTA INCLUIDA EN EL INDEX.PHP dinamicamente------------------------

// Objeto de configuracion de las herramientas en la barra.
var toolbarConfigItems = {
	graticule: true,
	zoomIn: true,
	zoomOut: true,
	zoomFullExtent: true,
	history: true,
	pan: true,
	medirDistancia: true,
	medirSuperficie: true,
	wmsIdentify: true,
	irCoordenadas: true,
	nomenclador: true,
	impresion: true,
	logout: true,
	gearth: false,
	refresh: true,
	loading: true,
	sugerencias: true,
	remoteWms: true
};
*/


//The printProvider that connects us to the print service
/*
var printProvider1 = new GeoExt.data.PrintProvider({
    method: "POST", 
    capabilities: printCapabilities, // from the info.json script in the html
    customParams: {
        mapTitle: "Printing Demo"
    }
});

// Our print page. Stores scale, center and rotation and gives us a page extent feature that we can add to a layer.
var printPage = new GeoExt.data.PrintPage({
    printProvider: printProvider1
});

// A layer to display the print page extent
var pageLayer = new OpenLayers.Layer.Vector();
pageLayer.addFeatures(printPage.feature);

// The form with fields controlling the print output
var printFormPanel = new Ext.form.FormPanel({
    region: "center",
    id: "printFormPanel",
    width: 150,
    bodyStyle: "padding:5px",
    labelAlign: "top",
    defaults: {anchor: "100%"},
    items: [{
        xtype: "textarea",
        name: "comment",
        value: "",
        fieldLabel: "Comment",
        plugins: new GeoExt.plugins.PrintPageField({
            printPage: printPage
        })
    }, {
        xtype: "combo",
        store: printProvider1.layouts,
        displayField: "name",
        fieldLabel: "Layout",
        typeAhead: true,
        mode: "local",
        triggerAction: "all",
        plugins: new GeoExt.plugins.PrintProviderField({
            printProvider: printProvider1
        })
    }, {
        xtype: "combo",
        store: printProvider1.dpis,
        displayField: "name",
        fieldLabel: "Resolution",
        tpl: '<tpl for="."><div class="x-combo-list-item">{name} dpi</div></tpl>',
        typeAhead: true,
        mode: "local",
        triggerAction: "all",
        plugins: new GeoExt.plugins.PrintProviderField({
            printProvider: printProvider1
        }),
        // the plugin will work even if we modify a combo value
        setValue: function(v) {
            v = parseInt(v) + " dpi";
            Ext.form.ComboBox.prototype.setValue.apply(this, arguments);
        }
    }, {
        xtype: "combo",
        store: printProvider1.scales,
        displayField: "name",
        fieldLabel: "Scale",
        typeAhead: true,
        mode: "local",
        triggerAction: "all",
        plugins: new GeoExt.plugins.PrintPageField({
            printPage: printPage
        })
    }, {
        xtype: "textfield",
        name: "rotation",
        fieldLabel: "Rotation",
        plugins: new GeoExt.plugins.PrintPageField({
            printPage: printPage
        })
    }],
    buttons: [{
        text: "Create PDF",
        handler: function() {
            printProvider1.print(mapPanel, printPage);
        }
    }]
});

*/








/** WMS.GetFeatureInfo drill down con respuesta XML para la nueva herramienta i
*/
var ventanaDrillNuevo;
function featureDrillNuevo(x, y, capa) {
	//alert('Consultando la capa: '+capa+' en el punto x:'+x+' y:'+y);
	var nombredelacapactiva = capasDrilldownNuevo[capa].nombreCapa;
	if (nombredelacapactiva == "") {
		var alertar = "Error:<br><font color='red'>Debe seleccionar una capa de consulta</font>";
		Ext.example.msg('Modo identificar', alertar);
		return;
	}
	var objetolayersactivos = map.getLayersByName(nombredelacapactiva);
	var layeractivo = objetolayersactivos[0];
	if (!layeractivo.getVisibility()) {
		// la capa no esta visible, verifico que sea de las mostrarSiempre
		if (!capasDrilldownNuevo[capa].mostrarSiempre) {
			// no es de las mostrarSiempre
			return;
		}
	}
	if (layeractivo == undefined) {
		var alertar = "Error: <font color='red'>" + nombredelacapactiva + "</font> no es una selecci&oacute;n v&aacute;lida.";
		Ext.example.msg('Modo identificar', alertar);
		return;
	}
	var url = layeractivo.getFullRequestString({
			REQUEST : "GetFeatureInfo",
			EXCEPTIONS : "application/vnd.ogc.se_xml",
			BBOX : layeractivo.map.getExtent().toBBOX(),
			X : x,
			Y : y,
			//INFO_FORMAT: 'text/html',
			//INFO_FORMAT: 'text/plain',
			INFO_FORMAT : 'application/vnd.ogc.gml',
			QUERY_LAYERS : layeractivo.params.LAYERS,
			WIDTH : layeractivo.map.size.w,
			HEIGHT : layeractivo.map.size.h,
			FEATURE_COUNT : capasDrilldownNuevo[capa].featureCount
		}).replace('geoserver/gwc/service', 'geoserver');

	// Pruebo con los metodos de OpenLayers
	var format = new OpenLayers.Format.XML();
	var resp = null;
	OpenLayers.loadURL(url, null, null, loadSuccess, loadFailure);

	function loadSuccess(request) {
		resp = format.read(request.responseText);
		var store_temporal = new Ext.data.SimpleStore({
				fields : [{
						name : 'atributo'
					}, {
						name : 'valor',
						type : ''
					},
				]
			});
		var gridtabulador = new Ext.grid.GridPanel({
				title : (capasDrilldownNuevo[capa]['tituloTab'] == undefined ? nombredelacapactiva : capasDrilldownNuevo[capa]['tituloTab']), //nombredelacapactiva, // if no tiene tituloTab
				store : store_temporal, //asigna el store al grid
				columns : [{
						id : 'atributo',
						header : "Atributo",
						width : 150,
						sortable : true,
						dataIndex : 'atributo'
					}, {
						id : 'valor',
						header : "Valor",
						width : 150,
						sortable : true,
						dataIndex : 'valor'
					}
				],
				tbar : [], // para agregar el boton de export
				region : 'center',
				viewConfig: {
				    forceFit: true
				},
				//layout: 'fit',
				stripeRows : true,
				autoExpandColumn : 'valor',
				height : 150,
				width : 350
			});
		var consultandocapa = capasDrilldownNuevo[capa];
		var datosacargar = new Array();
		for (var j = 0; j < consultandocapa['atributos'].length; j++) {
			if (Ext.isChrome) {
				// Es Chrome, hay que quitar el namespace
				var elatributo = consultandocapa['atributos'][j].substring(consultandocapa['atributos'][j].indexOf(':') + 1);
			} else {
				var elatributo = consultandocapa['atributos'][j];
			}
			//alert(elatributo);


			for (var kk = 0; kk < resp.getElementsByTagName(elatributo).length; kk++) { // itero tantas veces como features haya obtenido
				if (resp.getElementsByTagName(elatributo)[kk] == undefined) {
					datosacargar.push([consultandocapa['alias'][j], 'N/D']);
				} else {
					// coloco o no el contador de features si es que el count es mayor a uno
					if (consultandocapa['featureCount'] > 1) {
						var numerador = '(' + kk + ') '
					} else {
						var numerador = '';
					}
					//alert('valor: ' + resp.getElementsByTagName(elatributo)[kk].childNodes[0].nodeValue); // Parece que falla esto. No hay nodeValue
					if (resp.getElementsByTagName(elatributo)[kk].childNodes[0] != undefined) {
						datosacargar.push([numerador + consultandocapa['alias'][j], resp.getElementsByTagName(elatributo)[kk].childNodes[0].nodeValue]);
					}
				}
			}

			if (typeof resp.getElementsByTagName(elatributo)[0] == 'undefined'){
				datosacargar[j] = [consultandocapa['alias'][j],'N/D'];
			} else {
				datosacargar[j] = [consultandocapa['alias'][j],resp.getElementsByTagName(elatributo)[0].childNodes[0].nodeValue];
			}
		}
		store_temporal.loadData(datosacargar);
		gridtabulador.store = store_temporal;

		//Create the Download button and add it to the top toolbar
		/*
		var exportButton = new Ext.ux.Exporter.Button({
		component: gridtabulador,
		text     : "Download as .xls"
		});

		gridtabulador.getTopToolbar().add(exportButton);


		 */

		setTimeout(function () {
			if (Ext.getCmp('tabs2Nuevo') !== undefined) {
				Ext.getCmp('tabs2Nuevo').add(gridtabulador);
				if (Ext.getCmp('tabs2Nuevo').getActiveTab() == null) {
					Ext.getCmp('tabs2Nuevo').setActiveTab(0); // si no hay tab seleccionado, selecciona el primero
				}
			}
		}, 1);
		//valoruno = resp.getElementsByTagName("ambiente:DIRECCION")[0].childNodes[0].nodeValue;
		//alert(valoruno);
	}
	function loadFailure(request) {
		//alert(request);
		//updateStatus("failed to load");
	}
	//OpenLayers.Event.stop(evento);
};



// Herramientas.
function configToolbar (configObj) {

	var toolbarItems = [], action;

	if (configObj['graticule']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'graticule',
			enableToggle: false,
			tooltip: 'Red de meridianos/paralelos',
			handler: function() {
				(graticule.active) ? graticule.deactivate() : graticule.activate();
				return false;
			}
		});
		toolbarItems.push(action);
	}

	toolbarItems.push('-');

	if (configObj['zoomFullExtent']) {
		action = new Ext.Toolbar.Button({
			iconCls:'zoomfull',
			enableToggle: false,
			tooltip: msj[6],
			handler: function() {
				//map.setCenter(new OpenLayers.LonLat(-6922215.5529815,-4806955.8102606),4);
				map.zoomToExtent(extentProyecto900913); // Hago zoom al extent del proyecto
				return false;
			}
		});
		toolbarItems.push(action);
	}

	if (configObj['zoomIn']) {
		action = new GeoExt.Action({
			//text: 'Acercarse',
			control: new OpenLayers.Control.ZoomBox({out: false}),
			map: map,
			// button options
			iconCls: 'zoomin',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: msj[7],
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);
	}

	if (configObj['zoomOut']) {
		action = new GeoExt.Action({
			//text: 'Alejarse',
			control: new OpenLayers.Control.ZoomBox({out: true}),
			map: map,
			// button options
			iconCls: 'zoomout',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: msj[8],
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);
	}

	if (configObj['history']) {
		var navhist = new OpenLayers.Control.NavigationHistory();
		map.addControl(navhist);

		action = new GeoExt.Action({
			//text: "Vista previa",
			control: navhist.previous,
			toggleGroup: "tgroup",
			iconCls: 'back',
			enableToggle: false,
			tooltip: msj[20]
		});
		toolbarItems.push(action);

		action = new GeoExt.Action({
			//text: "next",
			control: navhist.next,
			toggleGroup: "tgroup",
			tooltip: msj[21],
			enableToggle: false,
			iconCls: 'next'
		});
		toolbarItems.push(action);
	}

	toolbarItems.push('-');

	if (configObj['pan']) {
		action = new GeoExt.Action({
			control: new OpenLayers.Control.DragPan(),
			map: map,
			// button options
			iconCls: 'pan',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: msj[9],
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);
	}

	toolbarItems.push('-');

	if (configObj['medirDistancia']) {
		action = new GeoExt.Action({
			control: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Path, opcionesMedicion
			),
			map: map,
			// button options
			iconCls: 'medirlinea',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: msj[15],
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);
	}

	if (configObj['medirSuperficie']) {
		action = new GeoExt.Action({
			control: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Polygon, opcionesMedicion
			),
			map: map,
			// button options
			iconCls: 'medirarea',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: msj[16],
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);
	}

	if (configObj['wmsIdentify']) {

	// drilldown
		drillInfoNuevo = new OpenLayers.Control();
		OpenLayers.Util.extend( drillInfoNuevo, {
			draw: function() {
				this.handler = new OpenLayers.Handler.Point(drillInfoNuevo,
					{"done": this.notice},
					{keyMask: OpenLayers.Handler.MOD_NONE}
				);
			},
			notice: function(punto) {
				var extent_delmapa = map.getExtent().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326')).toBBOX();
				//convierto las coordenadas del punto cliqueado, la api de geonames trabaja en epsg:4326.
				var puntog = punto.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
				// creo la ventana para los resultados
				if (ventanaDrillNuevo) {
					ventanaDrillNuevo.close();
				}
				// Panel con tabs para la info de las capas drill down
				tabs2Nuevo = new Ext.TabPanel({
					id:'tabs2Nuevo',
					//renderTo: document.body,
					activeTab: 0,
					//width:400,
					height:300,
					width:'auto',
					enableTabScroll:true,
					//resizeTabs:true,
					plain:true,
					//autoLoad:true,
					defaults:{autoScroll: true},
					items:[]
				});
				ventanaDrillNuevo = new Ext.Window({
					title: 'Consulta de atributos de mapa',
					width: 362,
					layout: 'fit',
					autoScroll: true,
					items: [tabs2Nuevo]
				});
				ventanaDrillNuevo.setPosition(mapPanel.x+100,mapPanel.y+100);
				ventanaDrillNuevo.show();
				// Llamadas sucesivas a getFeatureInfo con respuesta en XML (drilldown)
				var pixel = map.getPixelFromLonLat(new OpenLayers.LonLat(punto.x, punto.y).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")));
				var pixelx = pixel.x;
				var pixely = pixel.y;
					for (var i = 0; i < capasDrilldownNuevo.length; i++){ // tantas veces como capas se consulten
						featureDrillNuevo(pixelx,pixely,i); // Pasarle las coordenadas de imagen del punto cliqueado
					}
			}
		});
		action = new GeoExt.Action({
			map: map,
			control:drillInfoNuevo,
			// button options
			iconCls: 'identificar',
			toggleGroup: "tgroup",
			allowDepress: false,
			tooltip: 'Seleccione esta herramienta y haga click en un punto para obtener informaci&oacute;n de las capas.',
			// check item options
			group: "tgroup"
		});
		toolbarItems.push(action);

	}

	if (configObj['irCoordenadas']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'gotoxy',
			tooltip: msj[18],
			handler: function() {
				if (ventanaXY.isVisible()) {
					ventanaXY.hide();
				} else {
					ventanaXY.show();
				}
			}
		});
		toolbarItems.push(action);
	}

	if (configObj['ovMap']) {

		var overviewMap = new OpenLayers.Control.OverviewMap({
			div: Ext.get('overviewmap'),
			//layers: [new OpenLayers.Layer.OSM()],
			//size: new OpenLayers.Size(Ext.get('overviewmap').getWidth(),Ext.get('overviewmap').getHeight()),
			size: new OpenLayers.Size(220,300),
			mapOptions: {
				projection: 'EPSG:900913',
				units: 'm'
				//numZoomLevels: 1,
				//restrictedExtent: new OpenLayers.Bounds(-8190220,-7370993,-4033216,-2484892),
				//maxExtent: new OpenLayers.Bounds(-8190220,-7370993,-4033216,-2484892)
				//maxExtent: new OpenLayers.Bounds(-8296781,-7416226,-5870364,-2436201)
			}
		});
		
		
		
		
		// Ventana que contiene la vista aerea
		var ventanaOvmap = new Ext.Window({
			id: 'ventanaOvmap',
			title: 'Vista general',
			width: 220,
			height: 300,
			layout: 'fit',
			resizable: false,
			closeAction: 'hide',
			contentEl: 'overviewmap'
		});

		
		action = new Ext.Button({
			id: 'ovMap',
			iconCls: 'ovmap',
			tooltip: 'Vista general',
			handler: function() {
				if (Ext.getCmp('ventanaOvmap').isVisible()) {
					Ext.getCmp('ventanaOvmap').hide();
				} else {
					Ext.getCmp('ventanaOvmap').show();
				}
			}
		});
		toolbarItems.push(action);
		map.addControl(overviewMap);
		Ext.getCmp('ventanaOvmap').show();
	}
	
	if (configObj['remoteWms']) {
		action = new Ext.Toolbar.Button({
			id: 'remoteWmsLayersButton',
			iconCls: 'wmsexterno',
			tooltip: 'Agregar WMS externo',
			listeners: {
				click: openWinRemoteWmsLayers
			}
		});
		toolbarItems.push(action);
	}


	toolbarItems.push('-');

	if (configObj['nomenclador']) {
		// Busqueda en nomenclador. Campo de texto donde se escribe el nombre del lugar a buscar
		action = new Ext.form.TextField({
			id: 'cajatextotopo',
			width: 80,
			minLength: 3,
			allowBlank: true,
			emptyText: msj[28],
			blankText : msj[29],
			minLengthText: msj[29],
			listeners: {
				specialkey: function(cajatextotopo, event) {
					var abuscar = Ext.getCmp('cajatextotopo').getValue();
					if (abuscar != '' && cajatextotopo.isValid() && event.getKey() == 13) {
						buscarPropietario(abuscar);
					} else {
						Ext.example.msg(msj[30], msj[31]);
					}
				}
			}
		});
		toolbarItems.push(action);

		// Boton para la busqueda de lugares
		action = new Ext.Button({
			id:'botonbuscatopo',
			text:'Buscar',
			handler: function() {
				var abuscar = Ext.getCmp('cajatextotopo').getValue();
				if (abuscar != '' && cajatextotopo.isValid()) {
					buscarPropietario(abuscar);
				} else {
					Ext.example.msg(msj[30], msj[32]);
				}
			}
		});
		toolbarItems.push(action);
	}

	toolbarItems.push('-');

	if (configObj['impresion']) {
		// The printProvider that connects us to the print service
		var printProvider = new GeoExt.data.PrintProvider({
			method: "POST",
			capabilities: printCapabilities, // from the info.json script in the html
			customParams: {
				mapTitle: "\nSIT Santa Cruz",
				comment: ""
			}
		});
		
		// A verrrrr si podemos ponchar el gwc, LPQLP
	
		printProvider.on({
			'encodelayer' : function(provider, layer, encodedLayer){
				if (layer.CLASS_NAME == "OpenLayers.Layer.WMS") {
					encodedLayer.baseURL = layer.url.replace('/geoserver/gwc/service/wms','/geoserver/wms');
				} 
				return encodedLayer;
			}
		});
		
		
		
		
		// Our print page. Tells the PrintProvider about the scale and center of our page.
		printPage = new GeoExt.data.PrintPage({
			printProvider: printProvider
		});

		action = new Ext.Button({
			id:'botonparaimprimir',
			text:'',
			iconCls: 'print',
			tooltip: msj[33],
			handler: function() {
					// convenient way to fit the print page to the visible map area
					printPage.fit(mapPanel, true);

					// Elimino las capas vectoriales de la leyenda, xq plancha.
					/*
					var legLayers = legendPanel.layerStore;
					var cloneLegLayers = new Array();
					legLayers.each(function(record){
						var layerRec = record.get('layer');
						if (layerRec.CLASS_NAME == 'OpenLayers.Layer.WMS'){
							cloneLegLayers.push(record);
						}
					});
					cloneLegLayerStore.add(cloneLegLayers);

					// print the page, optionally including the legend
					printProvider.print(mapPanel, printPage, {legend: cloneLegPanel});
					*/
					printProvider.print(mapPanel, printPage);
			}
		});
		toolbarItems.push(action);

		toolbarItems.push('-');
	}


	if (configObj['refresh']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'refrescar',
			tooltip: 'Refrescar contenido del mapa',
			handler: refrescarCapas
		});
		toolbarItems.push(action);
	}

	toolbarItems.push('-');

	if (configObj['gearth']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'gearth',
			tooltip: msj[34],
			handler: function() {
				if (Ext.getCmp('ventana3d') && Ext.getCmp('ventana3d').isVisible()) {
					Ext.getCmp('ventana3d').hide();
				} else if (Ext.getCmp('ventana3d') && !Ext.getCmp('ventana3d').isVisible()) {
					Ext.getCmp('ventana3d').show();
				} else {
					new Ext.Window({
						title:  msj[35],
						id: 'ventana3d',
						closeAction: 'hide',
						width: map.getSize().w*0.8,
						height: map.getSize().h*0.8,
						shim: true,
						layout: 'fit',
						resizable: true,
						forceLayout: true,
						collapsible: true,
						closeAction: 'hide',
						contentEl: 'map3d_container',
						listeners: {
							'resize': function(win, width, height){
								Ext.get('map3d_container').setWidth(width);
								Ext.get('map3d_container').setHeight(height);
							}
						}
					}).show();
				}
			}
		});
		toolbarItems.push(action);
		toolbarItems.push('-');
	}
	
	
	if (configObj['catalogo']) {
		action = new Ext.Button({
			id: 'botonGeonetwork',
			iconCls: 'metadatos',
			tooltip: 'Abrir gestor de metadatos',
				handler: function(){
					if (Ext.getCmp('ventanaGeonetwork')) {
						Ext.getCmp('ventanaGeonetwork').destroy();
					} else {
						new Ext.Window({
							title: 'Gestor de metadatos',
							id: 'ventanaGeonetwork',
							maximizable: true,
							width: 800,
							height: 550,
							stateful : false,
							html: '<iframe src ="../geonetwork/" width="100%" height="100%"></iframe>'
						}).show();
					}
				}
		});
		toolbarItems.push(action);
	}
	
	if (configObj['tme']) {
		action = new Ext.Button({
			id: 'botonTme',
			iconCls: 'tme',
			tooltip: 'Abrir mapeo tem&aacute;tico',
			handler: function(){
				if (Ext.getCmp('ventanaTme') && Ext.getCmp('ventanaTme').isVisible()) {
					Ext.getCmp('ventanaTme').hide();
				} else if (Ext.getCmp('ventanaTme') && !Ext.getCmp('ventanaTme').isVisible()) {
					Ext.getCmp('ventanaTme').show();
				} else {
					new Ext.Window({
						title: 'TME',
						id: 'ventanaTme',
						maximizable: false,
						autoScroll: true,
						closeAction: 'hide',
						width: 416,
						height: 506,
						stateful : false,
						items: [TME.engine]
					}).show();
				}
			}
		});
		toolbarItems.push(action);
	}

	if (configObj['logout']) {
		action = new Ext.Button({
			id: 'logout',
			iconCls: 'logout',
			tooltip: 'Cerrar sesi&oacute;n',
				handler: function(){
					window.location='./php/login/logout.php';
				}
		});
		toolbarItems.push(action);
	}

	if (configObj['ctrlBienvenido']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'cliente',
			tooltip: 'Alternar ventana de bienvenida',
			handler: function() {
				if (Ext.getCmp('ventanaBienvenido').isVisible()) {
					Ext.getCmp('ventanaBienvenido').hide();
				} else {
					Ext.getCmp('ventanaBienvenido').show();
				}
			}
		});
		toolbarItems.push(action);
	}	

	if (configObj['panelAyuda']) {
		action = new Ext.Toolbar.Button({
			iconCls: 'ayuda',
			tooltip: 'Alternar panel de ayuda',
			handler: function() {
				if (Ext.getCmp('panelderecho').collapsed) {
					Ext.getCmp('panelderecho').expand();
				} else {
					Ext.getCmp('panelderecho').collapse();
				}
			}
		});
		toolbarItems.push(action);
	}		
	
	if (configObj['loading']) {
		toolbarItems.push('->'); // Alinear a la derecha
		toolbarItems.push(new Ext.Toolbar.Item({width:60,contentEl:'estadocarga'}));
	}


	return toolbarItems;
};

// Barra de herramientas del mapa. var mapToolbar = [];
/*
// Agrega las herramientas del toolsObj a toolbar disponibles en configObj. Esta bueno pero no agrega los controles al mapa, si a la barra.
function addItemsToToolbar(configObj, toolsObj, toolbar) {
	var k = {};
	for (var k in toolsObj) {
		if (configObj[k] === true) {
			toolbar.push(toolsObj[k]);
		}
	}
	return;
}
*/



/* recalcula los extent de las capas haciendo una consulta json y situa el mapa ahi.
*/
function irAExtentBBDD(layer) {
	//alert(idcampania);
	var reqExtents = new OpenLayers.Request.GET({
		url: 'http://' + el_host + lacarpeta + '/php/json/extents.php',
		params: {'layer':layer,'idusuario':usuario_logueado,'idcampania':idcampania},
		callback: callBackExtents
	});
	reqExtents.send();

	// Activo la pestania con la grilla de edicion
	if (Ext.getCmp('paneldeabajo').collapsed) {
		Ext.getCmp('paneldeabajo').expand();
	}
	switch(layer) {
		case 'v_establecimientos':
			editorTabPanel.setActiveTab('Des');
			break;
	}
}

/** Callback de la consulta de la cota. Con la respuesta json muestra en una ventana las coordenas del punto cliqueado y la cota.
*/
function callBackExtents(response) {
	// creo un objeto con la respuesta
	var jsonExtents = eval( '(' + response.responseText + ')' );
	var extentparair = new OpenLayers.Bounds(jsonExtents.left,jsonExtents.bottom,jsonExtents.right,jsonExtents.top);
	map.zoomToExtent(extentparair.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')));
}



/** Ventana con el Google Earth.
* Es necesario que el cliente tenga el plug-in para el GE. Solo Win y MacOS. var center: {OpenLayers.LonLat}
*/

/*
function crearVisorGE(center) {
	// visor de google earth
	visorcreado = true;
	visorGE = new Earth(
		map, 'map3d',
		{
			lonLat: center,
			altitude: 500,
			heading: 0,
			tilt: 45,
			range: 700
		}
	);
	// ext.window con el visor
	ventanaGE = new Ext.Window({
		title: msj[35],
		width: map.getSize().w*0.8,
		height: map.getSize().h*0.8,
		layout: 'fit',
		resizable: true,
		forceLayout: true,
		collapsible: true,
		closeAction: 'hide',
		contentEl: 'map3d_container'
	});
	// cuando cierro la ventana oculto la capa vectorial que tiene el ojo(obervador)-lineavisual-centro
	ventanaGE.on('hide', function() {
		visorGE.earthLayer.setVisibility(false);
	});
	ventanaGE.on('resize', function() {
		var anchog = ventanaGE.getInnerWidth();
		var altog = ventanaGE.getInnerHeight();
		Ext.get('map3d_container').setWidth(anchog);
		Ext.get('map3d_container').setHeight(altog);
	});
}
*/

/**	Busqueda de metadatos de capa
*/
function metadatos(strbuscar){
	Ext.MessageBox.confirm(
		msj[38], msj[39],
		function(btn, text){
			if (btn == 'yes'){
				var ventanaMetadatos = new Ext.Window({
					title: msj[40],
					width: 700,
					height: 550,
					//html: '<iframe src ="http://geointa.inta.gov.ar/geonetwork/srv/es/metadata.show?id=' + strbuscar + '&currTab=simple" width="100%" height="100%"></iframe>'
					html: '<iframe src ="http://rian.inta.gov.ar/catalogogeointa?id=' + strbuscar + '&currTab=simple" width="100%" height="100%"></iframe>'

					});
				ventanaMetadatos.show();
			}
		}
	);
}


/** Se ejecuta una vez hecho el viewport por Extjs
*/
function despuesLayoutExt() {

	// sube la capa de marcadores por sobre el resto para que se vea la telescopica.png
	var subo = map.layers.length;
	map.raiseLayer(marcadores, subo);

	//map.raiseLayer(pageLayer, subo+10);

	//tips
	if(toolbarConfigItems['sugerencias']){
		if (!sugerenciasmostradas) {
			//setTimeout("Ext.example.msg('Sugerencia', miSugerencia);",10000);
			setTimeout("mostrarsugerencia();",delaysugerencia);
			//Ext.example.msg('Sugerencia', miSugerencia);
			sugerenciasmostradas = true;
		}
	}

}


/*
 * Agrego las grillas de edicion al panel pestaniado de abajo
 * */
function agregarEditorGrid(capaAEditar) {

	editorTabPanel.add({id:'Des', title:'', items:eval('gridpanel_'+capaAEditar), layout: 'fit'});
	editorTabPanel.doLayout();
}



/** Convierte grados minutos segundos en grados decimales
*/
function gms2gd() {
	// Tomo g m s de longitud
	var xg = Ext.getCmp('ir_lon_g').getValue();
	var xm = Ext.getCmp('ir_lon_m').getValue();
	var xs = Ext.getCmp('ir_lon_s').getValue();
	var lalalon = (xg + xm/60 + xs/3600) * -1;
	// inserto lon
	Ext.getCmp('ir_lon').setValue(lalalon.toFixed(7));
	// Tomo g m s de latitud
	var yg = Ext.getCmp('ir_lat_g').getValue();
	var ym = Ext.getCmp('ir_lat_m').getValue();
	var ys = Ext.getCmp('ir_lat_s').getValue();
	var lalalat = (yg + ym/60 + ys/3600 ) * -1;
	// inserto lat
	Ext.getCmp('ir_lat').setValue(lalalat.toFixed(7));
}


/** Convierte grados decimales en grados minutos segundos
*/
function gd2gms() {
	// uso los valores positivos
	var lon = Ext.getCmp('ir_lon').getValue() * -1;
	var lat = Ext.getCmp('ir_lat').getValue() * -1;
	// longitud = x
	var gx = parseInt(lon);
	var mx = Math.floor( (lon - gx) * 60 );
	var sx = parseFloat( (lon - mx/60 - gx) * 3600 );
	// latitud = y
	var gy = parseInt(lat);
	var my = Math.floor( (lat - gy) * 60 );
	var sy = parseFloat( (lat - my/60 - gy) * 3600 );
	// inserto lon
	Ext.getCmp('ir_lon_g').setValue(gx);
	Ext.getCmp('ir_lon_m').setValue(mx);
	Ext.getCmp('ir_lon_s').setValue(sx.toFixed(2));
	// inserto lat
	Ext.getCmp('ir_lat_g').setValue(gy);
	Ext.getCmp('ir_lat_m').setValue(my);
	Ext.getCmp('ir_lat_s').setValue(sy.toFixed(2));
}


/** Para mostrar las Sugerencias
*/
var mostrarsugerencia = function() {
	new Ext.ux.window.MessageWindow({
		title: msj[41],
		autoDestroy: true,//default = true
        autoHeight: true,
		autoHide: true,//default = true
        bodyStyle: 'text-align:center',
        closable: false,
		help: false,//no help tool
		html: miSugerencia,
		iconCls:	'x-icon-error',
        pinState: 'pin',//pin null render pinned
        showFx: {
            duration: 0.50, //defaults to 1 second
            mode: 'standard',//null,'standard','custom',or default ghost
            useProxy: false //default is false to hide window instead
        },
        width: 250 //optional (can also set minWidth which = 200 by default)
	}).show(Ext.getDoc());
};


// Funciones traidas del editorwfs.js

function showMsg(title, msg){
    Ext.example.msg(title, msg, 'yes');
};

function showSuccessMsg(mensaje){
	Ext.example.msg("Operaci&oacute;n exitosa", mensaje, 'yes');
};

function showFailMsg(mensaje){
	Ext.MessageBox.show({
		title: 'Error',
		msg: mensaje,
		buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.ERROR
	});
};



/**
 * Le asigna el filtro a la capas luego de ser actualizado el filtro
 *
 * */
function asignarFiltros() {
	return false;
}




/**
 * Enmascara el panel de abajo para cuando no estas en edicion.
 * */
function habilitarPanelSur() {
	var el = Ext.getCmp('paneldeabajo').getEl();
	if (map.getScale() > escalaMinEdicion) {
		el.mask('Se activar&aacute; cuando se encuentre en escala de edici&oacute;n.');
	} else {
		el.unmask();
	}
}

/* Proyectos */
	/*
var readerdeproyectos = new Ext.data.JsonReader(
	{
		//totalProperty: 'totalresultados',
		root: 'data'
	},
	[
		{name:'idproyecto', type:'integer'},
		{name:'nombreproyecto', type:'string'}
	]
);
	*/
var storedeproyectos = new Ext.data.Store({
	url: el_proxy + "http://" + el_host + lacarpeta + "/php/services/proyectos.php",
	autoLoad: true,
	reader: new Ext.data.JsonReader(
		{
			totalProperty: 'totalresultados',
			root: 'data'
		},
		[
			{name:'idproyecto', type:'integer'},
			{name:'nombreproyecto', type:'string'}
		]
	)
});
//storedeproyectos.load();

		// Combo de proyectos
	var elegirProyecto = new Ext.form.ComboBox({
		id: 'elegirProyecto',
		store: storedeproyectos,
		mode: 'local',
		triggerAction: 'all',
		typeAhead: true,
		//value: idproyectoactivo,
		labelSeparator: '',
		valueField: 'idproyecto',
		displayField: 'nombreproyecto',
		//value: idproyectoactivo,
		emptyText: 'Seleccionar proyecto',
		listeners:{scope:this, 'select':function(){
			if (elegirProyecto.getValue() == '') {
				Ext.Msg.alert('Error', 'Debe seleccionar un proyecto.');
			} else {
				//alert(elegirProyecto.getValue());
				window.location="./?idp="+ elegirProyecto.getValue();
			}
		}}
	});





/** Inicializa el mapa
*/
function initMap() {
	// Proxy host
	OpenLayers.ProxyHost = el_proxy; // Definido en el index.html

	// Red de meridianos y paralelos
	graticule = new OpenLayers.Control.Graticule({
		autoActivate: false,
		labelFormat: 'dms',
		labelled: true,
		labelSymbolizer: {fontSize: "9px"}
	});

	// El mapa en Google Projection - spherical/web mercator
	map = new OpenLayers.Map($('center'), {
		projection: new OpenLayers.Projection('EPSG:900913'),
		displayProjection: new OpenLayers.Projection('EPSG:4326'),
		units: 'm',
		theme: null,
		numZoomLevels: 19,
		maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7),
		restrictedExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7),
		controls: [
			graticule,
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Navigation({zoomWheelEnabled:true, handleRightClicks:false}),
			new OpenLayers.Control.PanZoomBar()
		]
	});

	map.events.register('zoomend', '', habilitarPanelSur);

	map.events.register('moveend', '', function() {
		// recenter/resize page extent after pan/zoom
		//printPage.fit(this, {mode: "screen"});
		marcadores.clearMarkers();
	});

	map.Z_INDEX_BASE.Popup = 10000;

	// Agrego las capas de google.
	map.addLayers([marcadores, gcalles, ghibrido, gsatelite, osm, argenmap]);
	
	//map.addLayer(pageLayer);

/* comentario
var establecimientos = new OpenLayers.Layer.Vector("establecimientos", {
    //scales: oMap.getScales(8,10),
	//styleMap: style_establecimientos,
	projection: new OpenLayers.Projection('EPSG:900913'),
	//minScale: escalaMinEdicion,
	maxScale:1,
    //strategies: [new OpenLayers.Strategy.BBOX(), oSaveStrategy_establecimientos],
    strategies: [new OpenLayers.Strategy.BBOX()],
	//geometryType: "OpenLayers.Geometry.MultiPolygon",
    protocol: new OpenLayers.Protocol.WFS({
        version:       "1.1.0",
        url:           "http://desarrollo.zonageo.com.ar/geoserver/ows",
		typename: "solapa4v2:v_establecimientos",
        featureType:   "v_establecimientos",
        featureNS:     "http://desarrollo.zonageo.com.ar/",
        geometryName:  "the_geom"
        ,srsName: "EPSG:900913"
    })
});
map.addLayer(establecimientos);
*/



	// Agrego el resto de las capas. Esta funcion esta en layers.js
	addLayersToMap();

	// Coordenadas de mouse
	coordenadas = new OpenLayers.Control.MousePosition({
		element: $('mouseposition'),
		prefix:'<b>Geo WGS84</b>&nbsp;<b>Lon: </b>', separator:'&deg;&nbsp;<b>Lat: </b>', suffix: '&deg;', numDigits:5
	});
	map.addControl(coordenadas);

	// cordenadas en otra proyeccion
	coordenadasplanas = new OpenLayers.Control.MousePosition({
		element: $('mousepositionplanas'),
		prefix:'<b>&nbsp;&nbsp;GK WGS84 F2</b>&nbsp;<b>Y: </b>', separator:'m&nbsp;<b>X: </b>', suffix: 'm', displayProjection: new OpenLayers.Projection('EPSG:22182'), numDigits:0
		//prefix:'<b>Geo WGS84</b>&nbsp;<b>X: </b>', separator:'m&nbsp;<b>Y: </b>', suffix: 'm', numDigits:0
	});
	map.addControl(coordenadasplanas);
	//map.addControl(new OpenLayers.Control.MousePosition( {id: "utm_mouse", prefix: "UTM ", displayProjection: map.baseLayer.projection, numDigits: 0} ));
	
	
	// Gusanito de cargando...
	if(toolbarConfigItems['loading']){
		// Panel de 'cargando'
		var loadingpanel = new OpenLayers.Control.LoadingPanel({div: $('estadocarga')});
		map.addControl(loadingpanel);
	}


	/* Ir a coordenadas
	*/
	var ir_lon = new Ext.form.NumberField({
		id:'ir_lon',
		fieldLabel: msj[43],
		height: 20,
		width: 150,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: true,
		allowDecimals: true,
		decimalPrecision: 7,
		listeners: {change: gd2gms},
		blankText: msj[45],
		minValue: -75,
		maxValue: -52,
		value: -58.3652778
	});
	var ir_lat = new Ext.form.NumberField({
		id:'ir_lat',
		fieldLabel: msj[44],
		height: 20,
		width: 150,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: true,
		allowDecimals: true,
		decimalPrecision: 7,
		listeners: {change: gd2gms},
		blankText: msj[46],
		minValue: -57,
		maxValue: -21,
		value: -34.6205556
	});
	var ir_lon_g = new Ext.form.NumberField({
		id:'ir_lon_g',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: false,
		allowDecimals: false,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 52,
		maxValue: 75,
		value: 58
	});
	var ir_lon_m = new Ext.form.NumberField({
		id:'ir_lon_m',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: false,
		allowDecimals: true,
		decimalPrecision: 5,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 0,
		maxValue: 60,
		value: 21
	});
	var ir_lon_s = new Ext.form.NumberField({
		id:'ir_lon_s',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: true,
		allowDecimals: true,
		allowNegative: false,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 0,
		maxValue: 60,
		value: 55
	});
	var ir_lat_g = new Ext.form.NumberField({
		id:'ir_lat_g',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: false,
		allowDecimals: false,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 21,
		maxValue: 56,
		value: 34
	});
	var ir_lat_m = new Ext.form.NumberField({
		id:'ir_lat_m',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowNegative: false,
		allowDecimals: true,
		decimalPrecision: 5,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 0,
		maxValue: 60,
		value: 37
	});
	var ir_lat_s = new Ext.form.NumberField({
		id:'ir_lat_s',
		height: 20,
		width: 50,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: true,
		allowDecimals: true,
		allowNegative: false,
		listeners: {change: gms2gd},
		blankText: msj[47],
		minValue: 0,
		maxValue: 60,
		value: 14
	});

	// Boton que hace el zoom
	var irCoord = new Ext.Button({
		id: 'irCoord',
		text: 'IR',
		handler: function() {
			if (elegirEscala.getValue() == '') {
				Ext.Msg.alert(msj[48], msj[49]);
			} else {
				map.setCenter(
					new OpenLayers.LonLat(ir_lon.getValue(), ir_lat.getValue()).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')),
					map.getZoomForResolution(OpenLayers.Util.getResolutionFromScale(elegirEscala.getValue(), map.getUnits()))
				);
				if(conMiraIrCoordenadas) { // Agrego la mira al ir a coordenadas
					marcadores.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(ir_lon.getValue(), ir_lat.getValue()).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')), icon));
				}
			}
		}
	});

	// Combo con las escalas
	var elegirEscala = new Ext.form.ComboBox({
		store: new Ext.data.SimpleStore({
			fields: ['texto', 'valor'],
			data: [
				['Cerca', 13542],
				['Medio', 108336],
				['Lejos', 1733376]
			]
		}),
		id: 'elegirEscala',
		mode: 'local',
		selectOnFocus: true,
		forceSelection: true,
		triggerAction: 'all',
		labelSeparator: '',
		valueField: 'valor',
		displayField: 'texto',
		emptyText: msj[50]
	});

	// Formulario para ingresar las coordenadas
	var fomularioXY = new Ext.form.FormPanel({
		renderTo: 'ventanaxy',
		width: 250,
		frame: true,
		labelAlign: 'left',
		labelWidth: 55,
		items: [
			{html:'<b>Grados decimales</b>'},
			ir_lon,
			ir_lat,
			{html:'<b>Grados  minutos  segundos</b>'},
			{
				layout: 'column',
				items: [
					{
						columnWidth: .25,
						html: '<span style="font-size:12px">Lon W :</span>'
					},
					{
						columnWidth: .25,
						items: ir_lon_g
					},
					{
						columnWidth: .25,
						items: ir_lon_m
					},
					{
						columnWidth: .25,
						items: ir_lon_s
					}
				]
			},
			{
				layout: 'column',
				items: [
					{
						columnWidth: .25,
						html: '<span style="font-size:12px">Lat S :</span>'
					},
					{
						columnWidth: .25,
						items: ir_lat_g
					},
					{
						columnWidth: .25,
						items: ir_lat_m
					},
					{
						columnWidth: .25,
						items: ir_lat_s
					}
				]
			},
			{html:'<b>Nivel de acercamiento</b>'},
			elegirEscala
		],
		buttons: [ irCoord ]
	});

	// Ventana con el formulario
	ventanaXY = new Ext.Window({
		title: msj[51],
		width: 265,
		//height: 22,
		layout: 'fit',
		resizable: true,
		closeAction: 'hide',
		contentEl: 'ventanaxy'
	});


	// Campo numerico para el denominador de la escala
	var denominadorEsc = new Ext.form.NumberField({
		id: 'denominadorEsc',
		height: 18,
		width: 60,
		readOnly: false,
		enableKeyEvents: true,
		allowBlank: false,
		allowDecimals: false,
		allowNegative: false,
		blankText: msj[52],
		listeners: {
			specialkey: function(denominadorEsc, event) {
				// si apretaste la tecla enter, hace zoom a la escala ingresada
				if (denominadorEsc.isValid() && event.getKey() == 13) {
					var escala = denominadorEsc.getValue();
					if (escala > 0 && escala <= 27734017) {
						map.zoomToScale(escala);
					} else {
						map.zoomToScale(27734017);
					}
				}
			}
		}
	});
	// se actualiza el valor de la escala cuando se hace zoom
	map.events.register('zoomend', denominadorEsc,
		function() {denominadorEsc.setValue(Math.round(map.getScale()));}
	);

	var barraInferior= [
		new Ext.Toolbar.Item('mouseposition'),
		new Ext.Toolbar.Item('mousepositionplanas'),
		'<b>  |  Mapa de fondo:</b>',
		/*
		 new Ext.Toolbar.Button({
			text: 'Callejero',
			tooltip: 'Red vial',
			handler: function() {map.setBaseLayer(gcalles);}
		}),
		new Ext.Toolbar.Button({
			text: 'Satelital',
			tooltip: 'Im&aacute;genes satelitales',
			handler: function() {map.setBaseLayer(gsatelite);}
		}),
		new Ext.Toolbar.Button({
			text: 'Hibrido',
			tooltip: 'Im&aacute;genes satelitales + red vial',
			handler: function() {map.setBaseLayer(ghibrido);}
		}),
		new Ext.Toolbar.Button({
			text: 'OSM',
			tooltip: 'Open Street Map',
			handler: function() {map.setBaseLayer(osm);}
		}),
		*/ 
		{
		    text: 'Seleccione fondo',                      
		    menu: {
		        xtype: 'menu',                          
		        items: [{
		                text: 'OSM',
		                //iconCls: 'edit'
		    			tooltip: 'Open Street Map',
		    			handler: function() {map.setBaseLayer(osm);}
		            },{
		                text: 'Argenmap (IGN)',
		                //iconCls: 'edit'
		    			tooltip: 'Argenmap (IGN)',
		    			handler: function() {map.setBaseLayer(argenmap);}
		            }, {
		                text: 'Google',
		                menu: {
		                    xtype: 'menu',
		                    items: [
		                      {
		            			text: 'Satelital',
		            			tooltip: 'Im&aacute;genes satelitales',
		            			handler: function() {map.setBaseLayer(gsatelite);}
		                      },{
		            			text: 'Hibrido',
		            			tooltip: 'Im&aacute;genes satelitales + red vial',
		            			handler: function() {map.setBaseLayer(ghibrido);}
		            		  },{
		            			text: 'Callejero',
		            			tooltip: 'Red vial',
		            			handler: function() {map.setBaseLayer(gcalles);}
		            		  }
		                    ]
		                }
		            }]                          
		    }
		},
		'<b>  |  Escala </b>1:',
		denominadorEsc
	];



// FORMULARIO PARA OPCIONES
	var checkSololectura = new Ext.form.Checkbox({
        //applyTo: 'local-states',
		fieldLabel: 'S&oacute;lo lectura',
		helpText: 'Tilde esta opci&oacute;n para operar sin guardar datos.<br>(Autom&aacute;ticamente activado si su usuario es de s&oacute;lo lectura.)',
		checked: sololecturainterfaz,
		disabled: sololectura,
		handler: function(){
			sololecturainterfaz = this.getValue()
		}
	});

	// store para tiempos de autoguardado( data local SIN JSON )
	var storeAutosave =  new Ext.data.SimpleStore({
			fields: ['segundos', 'descripcion'],
			data: [
				[0, 'Sin autoguardado'],
				[300, '5 minutos'],
				[600, '10 minutos'],
				[1200, '20 minutos'],
				[1800, '30 minutos'],
				[3600, '1 hora']
			]
	});

	var comboAutosave = new Ext.form.ComboBox({
		id: 'comboAutosave',
		store: storeAutosave,
		valueField: 'segundos',
		helpText: 'Espacio de tiempo que transcurrir&aacute; entre operaciones de autoguardado.',
		displayField: 'descripcion',
		width: 90,
		forceSelection: true,
		allowBlank:false,
		mode: 'local',
		triggerAction: 'all',
		fieldLabel: 'Autosalvar cada',
		value: 0,
		disabled: true,//sololectura,
		listeners: {
					select: function(combo, record, index){
						alert(record.data.valueField);
					}
				}
	});


	var fomularioOpciones = new Ext.form.FormPanel({
		//renderTo: 'ventanaxy',
		//width: 200,
		frame: true,
		labelAlign: 'right',
		labelWidth: 120,
		items: [
			checkSololectura, comboAutosave
		],
		buttons: [botonReporte]
	});




	// Panel con pestanias para edicion en grilla
	editorTabPanel = new Ext.TabPanel({
		region: 'center',
		id: 'editorTabPanel',
		height: 200,
		activeTab: 0,
		tabPosition: 'bottom',
		autoScroll: true,
		border: false,
		items: []
	});

/*
	// Formulario para exportar
	var storeCapaExportar =  new Ext.data.SimpleStore({
			fields: ['layer', 'descripcion'],
			data: [
				['v_establecimientos', 'Establecimientos'],
				['v_genotipos', 'Genotipos'],
				['v_macroambientes', 'Macroambientes'],
				['v_microambientes', 'Microambientes'],
				['v_planesdesiembra', 'Planes de siembra'],
				['v_puntosdemuestreo', 'Puntos de muestreo'],
				['v_unidadesdedecision_4326', 'Unidades de decisi&oacute;n']
			]
	});

	var storeFormatoExportar =  new Ext.data.SimpleStore({
			fields: ['formato', 'descripcion'],
			data: [
				['SHAPEFILE', 'ShapeFile'],
				['KMLKMZ', 'KML (Google Earth)']
			]
	});

	var comboCapaExportar = new Ext.form.ComboBox({
		id: 'comboCapaExportar',
		store: storeCapaExportar,
		valueField: 'layer',
		helpText: 'Capa a exportar.',
		displayField: 'descripcion',
		width: 120,
		forceSelection: true,
		allowBlank:false,
		mode: 'local',
		triggerAction: 'all',
		fieldLabel: 'Capa',
		emptyText: 'Seleccione...',
		value: ''
	});

	var comboFormatoExportar = new Ext.form.ComboBox({
		id: 'comboFormatoExportar',
		store: storeFormatoExportar,
		valueField: 'formato',
		helpText: 'Formato para exportaci&oacute;n.',
		displayField: 'descripcion',
		width: 120,
		forceSelection: true,
		allowBlank:false,
		mode: 'local',
		triggerAction: 'all',
		fieldLabel: 'Formato',
		emptyText: 'Seleccione...',
		value: ''
	});

	var formularioExportar = new Ext.form.FormPanel({
		//renderTo: 'ventanaxy',
		//width: 200,
		frame: true,
		labelAlign: 'right',
		labelWidth: 80,
		items: [
			comboCapaExportar, comboFormatoExportar
		],
		buttons: [
			new Ext.Button({
				id:'botonexportar',
				text:'Exportar',
				//iconCls: 'guardar',
				//autoWidth: false,
				//width: 100,
				tooltip: 'Exportar capa en el formato seleccionado',
				handler: function(){
					if(formularioExportar.getForm().isValid()){
						var laurldexportacion = '';
						if (Ext.getCmp('comboFormatoExportar').getValue() == 'SHAPEFILE') {
							laurldexportacion = 'http://' + geo_host + '/geoserver/wfs?request=GetFeature&version=1.0.0&typeName='+ espaciodenombres + ':' + Ext.getCmp('comboCapaExportar').getValue() + '&srs=EPSG:4326&outputFormat=SHAPE-ZIP&CQL_FILTER='+filtroWmsPorUsuario;
						}
						if (Ext.getCmp('comboFormatoExportar').getValue() == 'KMLKMZ') {
							laurldexportacion = 'http://' + geo_host + '/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers='+ espaciodenombres +':' + Ext.getCmp('comboCapaExportar').getValue() + '&styles=&bbox=-74,-55,-54,-21&width=490&height=512&srs=EPSG:4326&format=application/vnd.google-earth.kml+xml&CQL_FILTER='+filtroWmsPorUsuario;
						}
						//alert(laurldexportacion);
						window.open(laurldexportacion);
					}
				}
			})
		]
	});

*/



	// Arbol de filtros

////////////////////
// Generada dinamicamente
// var dataArbolFiltros = esta en el index
arbolFiltros = new Ext.tree.TreePanel({
//disabled:true,
autoScroll: true,
    animate: true,
    enableDD: false,
    containerScroll: true,
	rootVisible: false,
	useArrows: true,
         loader:new Ext.tree.TreeLoader()
		 //,autoHeight:true
		 ,autoScroll: true
        //,width:200
        //,height:400
        //,renderTo:Ext.getBody()
		,listeners: {
			click: function(node){
				//alert('Cliente: ' + node.attributes.filterData.C +' Empresa: ' + node.attributes.filterData.E + ' Sector: ' + node.attributes.filterData.S + ' Usuario: ' + node.attributes.filterData.U);
////
				if (node.attributes.canFilter){ // Tiene privilegios para efectuar el filtrado en este nodo

				if (node.attributes.filterData.U!=null){
					var reqExtents = new OpenLayers.Request.GET({
						url: 'http://' + el_host + lacarpeta + '/php/json/extents.php',
						params: {'layer':'v_establecimientos','idusuario':node.attributes.filterData.U,'idcampania':idcampania},
						callback: callBackExtents
					});
					reqExtents.send();
				}

				Ext.Ajax.request({
						url: './php/json/filtrosWmsWfs.php',
						method:'POST',
						params: {
							idusuario: usuario_logueado,
							idcampania: idcampania,
							c:node.attributes.filterData.C,
							e:node.attributes.filterData.E,
							s:node.attributes.filterData.S,
							u:node.attributes.filterData.U
						},
						success: function(result) {
							var jsonResult = Ext.util.JSON.decode(result.responseText);
							//idcampania = jsonResult['nuevoidcampania'];
							filtroWmsPorUsuario = jsonResult['filtroWms'];
							filtroWfsPorUsuario = eval((jsonResult['filtroWfs']).replace('"', ''));
							asignarFiltros();
							refrescarCapas();
						},
						failure: function(result){
							var r = Ext.util.JSON.decode(result.responseText);
							Ext.MessageBox.show({
									title: 'Error al efectuar el proceso de filtrado',
									msg: r.mensaje,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
							});
						}
					});
					} else {
					// no tiene privilegios para filtrar en este nodo
					showMsg('Error','No dispone de privilegios para filtar en este nodo. Intente con un nodo de menor jerarq&iacute;a');
					}


////
			}
		}

        ,root:new Ext.tree.AsyncTreeNode({
             expanded:true
            ,leaf:false
            ,text:'Click en un nodo para filtrar'
            ,children:dataArbolFiltros
        })
    });



	// Panel con pestanias
	tabPanel = new Ext.TabPanel({
		region: 'center',
		id: 'west-center',
		height: 200,
		activeTab: 0,
		tabPosition: 'top',
		autoScroll: true,
		border: false,
		items: [
			{
				id:'0',
				title:'Inicio',
				xtype: 'panel',
				renderTo: 'proyectos',
				headerAsText: false,
				header: false,
				margins: '0 0 0 0',
				defaults: {
					hideMode:'offsets'
				},
				//layout: 'accordion',
				items: [
		            {
						id:'elpaneldeproyectos',
			            title: 'Proyectos',
						autoScroll: true,
						border: false,
						frame: false,
						items: [
							elegirProyecto,
							{
								xtype: 'panel',
								//layout: 'accordion',
								defaults: { hideMode:'offsets'},
								items:[{
									//region:'center',
									id:'arbol',
									title: 'Capas del proyecto',
									autoScroll: true,
									height: Ext.get('divarbol').getHeight()-120,
									//autoHeight: true,
									contentEl: 'divarbol',
									border: false,
									frame: false
									}]
							}
							/*
							 ,{
								region:'south',
								xtype: 'panel',
								id:'about',
								title: 'Vista general',
								items: [{
									autoHeight: true,
									//height: 100,
									contentEl: 'overviewmap',
									border: false,
									frame: false
								}],
								listeners: {'render': {fn: addOverview, single: true}}
							}
							*/
						]
			        }
		        ]
			},
			{
				id:'1',
				title: 'Leyenda',
	            bodyStyle: 'padding: 3px;',
	            border: false,
				autoScroll: true,
				items: [legendPanel]
			},
			{ 	// esto es el panel de impresion. Esta aca para que se ajuste verticalmente. Sino queda de alto fijo y lo definimos afuera
				id: '3',
				title:'Herramientas',
				xtype: 'panel',
				renderTo: 'impresion',
				headerAsText: false,
				layout: 'accordion',
				margins: '0 0 0 5',
				split: true,
				border: false,
				frame: false,
				defaults: {
					collapsed: true
				},
				layoutConfig: {
					animate: true,
					activeOnTop: false,
					titleCollapse: true
				},
				items: [
		            {
			            title: 'Opciones',
			            bodyStyle: 'padding: 7px;',
			            border: false,
						items: [fomularioOpciones]
		            },
					/*
					{
			            title: 'Exportar',
			            bodyStyle: 'padding: 7px;',
			            border: false,
						items: [formularioExportar]
		            },
					*/
					{
		            	id:'accordionNomenclador',
		            	title:'B&uacute;squeda',
						contentEl:'nomenclador',
						autoScroll:true
		            }
		            /*,
					{
			            title: 'Filtros',
						id: 'accordionfiltros',
					    bodyStyle: 'padding: 7px;',
			            border: false,
						autoScroll:true,
						items: [arbolFiltros]
		            },{
		            	title: 'Impresion',
		            	id: 'accordionPrint',
		            	border: false,
						autoScroll:true,
						items: Ext.getCmp('printFormPanel'),
						listeners: {
							expand: function() {
								pageLayer.addFeatures(printPage.feature);
							}
						}
		            }*/
		            /*,
					{
			            //xtype: 'print-simple',
			            title:  'Mapas tem&aacute;ticos',
						id: 'accordionTematicos',
			            bodyStyle: 'padding: 7px;',
			            border: false,
						autoScroll: true,
						items: [TME.engine]
		            },
					{
			            title: 'Subir documentos',
						id: 'accordionsubir',
					    bodyStyle: 'padding: 7px;',
			            border: false,
						autoScroll:true,
						items: [formSubirFotos]
		            }
					*/
				]
			}
		]
	});

	// Panel con el mapa
	mapPanel = new GeoExt.MapPanel({
		title: "Mapa editable con grilla",
		header: false,
		region: 'center',
		//layout: 'fit',
		border: false,
		margins: '0 0 0 5',
		map: map,
		//tbar: toolbar,
		tbar: configToolbar(toolbarConfigItems),
		bbar: barraInferior,
		listeners: {afterlayout: despuesLayoutExt}/*,
		items: [{
			xtype: 'gx_zoomslider',
			aggressive: true,
			vertical: true,
			height:200,
			x:10,
			y:20,
			plugins: new GeoExt.ZoomSliderTip()
		}]*/
	});

/*
var menuContextual = new Ext.menu.Menu('mainContext');
menuContextual.add(
	new Ext.menu.CheckItem({text: 'Aujourd ggg hui'}),
	new Ext.menu.CheckItem({text: 'Toutes dates'})
);

function mostrarMenuContextual( node ){
        //  alert ( "menuShow\n" + node.ui.getEl() );
            menuContextual.show(node.ui.getEl());
        }
*/

	// Funcion para agregar al arbol el plugin on mouseover de un layer
	var ventanaDeCapa = new Ext.Window();
	var NodeMouseoverPlugin = Ext.extend(Object, {
		init: function(tree) {
			if (!tree.rendered) {
				tree.on('render', function() {this.init(tree)}, this);
				return;
			}
			this.tree = tree;
			tree.body.on('mouseover', this.onTreeMouseover, this, {delegate: 'div.x-tree-node-el'});
			tree.body.on('mouseout', this.onTreeMouseout, this, {delegate: 'div.x-tree-node-el'});
		},
		onTreeMouseover: function(e, t) {
			// Let's get the node...
			var nodeEl = Ext.get(t);
			if (!nodeEl) {
				return;
			}
			// Get the node id..
			var nodeId = nodeEl.getAttributeNS('ext', 'tree-node-id');
			if (!nodeId) {
				return;
			}
			
			if ((!map.getLayersByName(this.tree.getNodeById(nodeId).attributes['text']).length>0) || ((map.getLayersByName(this.tree.getNodeById(nodeId).attributes['text'])[0].masinfo).length<1)) {
				return;
			}
			//alert(nodeId);
			// do whatever you need here.. In my case, I update the status bar.
			//bbar.setStatus({ text: this.tree.getNodeById(nodeId).attributes['statusBarDescription'] });
			// FUNCIONAAAAA ! alert(this.tree.getNodeById(nodeId).attributes['text']);
			ventanaDeCapa = new Ext.Window({
			x: 270,
			y: 30,
			title: this.tree.getNodeById(nodeId).attributes['text'],
			//width: 250,
			html: map.getLayersByName(this.tree.getNodeById(nodeId).attributes['text'])[0] ? map.getLayersByName(this.tree.getNodeById(nodeId).attributes['text'])[0].masinfo : null
				
		});
			if (ventanaDeCapa) {
				ventanaDeCapa.show();
			}
		},
		onTreeMouseout: function(e, t) {
			if (ventanaDeCapa) {
				ventanaDeCapa.close();
			}
			this.tree.fireEvent('mouseout', this.tree, e);
		}
	});	
	
	
	
	arbol = new Ext.tree.TreePanel({
        renderTo: "divarbol",
		id: 'arbolCapas',
		rootVisible: false,
		root: {
            nodeType: "async",
            children: model_integrado,
			expanded: true
        },
        enableDD: true,
		containerScroll: true,
		autoScroll: true,
		listeners: {
			'checkchange': function(node, checked) {
				if (!node.isLeaf()) {
					node.expand();
					node.eachChild( function(n) {
						n.getUI().toggleCheck(checked);
						n.layer.setVisibility(checked);
					});
				}
			},
			'contextmenu': function (node) {
				if (node.isLeaf()) {
					new Ext.menu.Menu({
						id: 'arbolCapasContextMenu',
						items: [{
							xtype: 'menuitem',
							iconCls: 'drawPolygon',
							text: 'Descargar esta capa en GeoTIFF',
							handler: function(baseItem, e){
									new Ext.Window({
										title: 'Informaci&oacute;n de descarga',
										id: 'ventanaDescargaDeCapa',
										maximizable: false,
										width: 350,
										height: 150,
										stateful : false,
										// 900913 html: 'Descargar la capa <a href="http://spm.sitsantacruz.gob.ar/geoserver/sit/wms?service=WMS&version=1.1.0&request=GetMap&layers=' + node.layer.params.LAYERS + '&styles=&bbox=' + map.getExtent() + '&width=' + map.size.w + '&height=' + map.size.h + '&srs=EPSG:900913&format=image%2Fgeotiff" target"_blank">' + node.layer.name + '</a> como geoTiff'
										//html: 'Descargar la capa <a href="http://spm.sitsantacruz.gob.ar/geoserver/sit/wms?service=WMS&version=1.1.0&request=GetMap&layers=' + node.layer.params.LAYERS + '&styles=&bbox=' + map.getExtent().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326')) + '&width=' + map.size.w + '&height=' + map.size.h + '&srs=EPSG:4326&transparent=true&format=image%2Fgeotiff" target"_blank">' + node.layer.name + '</a> como geoTiff'
										html: '<html><head><style type="text/css">.arial {	font-family: Arial; font-size:100%; background-color:#F0E9D3;}.arial font {	text-align: justify;}body {	margin-left: 1px;	margin-top: 1px;	margin-right: 1px;	margin-bottom: 1px; background-color:#F0E9D3;}.arial {	font-family: Arial;}</style></head><body class="arial" bgcolor="#F0E9D3" leftmargin="1" topmargin="1" marginwidth="1" marginheight="1"><table width="100%" height="100%" bgcolor="#F0E9D3"><tr><td><p align="justify" class="arial"><strong>Descargar la capa <a href="http://spm.sitsantacruz.gob.ar/geoserver/sit/wms?service=WMS&version=1.1.0&request=GetMap&layers=' + node.layer.params.LAYERS + '&styles=&bbox=' + map.getExtent().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326')) + '&width=' + map.size.w + '&height=' + map.size.h + '&srs=EPSG:4326&transparent=true&format=image%2Fgeotiff" target"_blank">' + node.layer.name + '</a> como geoTiff:</strong></p><table cellspacing="0" cellpadding="0"  bgcolor="#F0E9D3">    <td width="446"><p class="arial">Esta    herramienta nos permite descargar a nuestra PC, una imagen georeferenciada de    la capa seleccionada y activa, en la extensi&oacute;n (zoom) visible en la ventana    principal, que podremos utilizar en un cliente SIG de escritorio como base de    otro proyecto. La misma no se descarga con los atributos (tablas) propios,    s&oacute;lo la georeferenciaci&oacute;n.</p></td></table><p align="justify" class="arial">&nbsp;</p></td></tr></table></body></html>'
									}).show();
							}
						},{
							xtype: 'menuitem',
							iconCls: 'metadatos',
							text: 'Acceder a metadatos de la capa',
							handler: function(baseItem, e){
								if (Ext.getCmp('ventanaMetadatosDeCapa')) {
									Ext.getCmp('ventanaMetadatosDeCapa').destroy();
								}
								//map.zoomToExtent(node.layer.metadatos);
								if (node.layer.metadatos!=''){
									new Ext.Window({
										title: 'Informaci&oacute;n de metadatos',
										id: 'ventanaMetadatosDeCapa',
										maximizable: true,
										width: 800,
										height: 550,
										stateful : false,
										html: '<iframe src ="' + node.layer.metadatos + '" width="100%" height="100%"></iframe>'
									}).show();
								} else {
									Ext.example.msg('Error', 'No se hallaron metadatos para esta capa');
								}
							}
						},
						{
							xtype: 'menuitem',
							iconCls: 'lupa',
							text: 'Ver toda la capa',
							handler: function(baseItem, e){
									//map.zoomToExtent(node.layer.bboxMercator);
									map.zoomToExtent(new OpenLayers.Bounds(node.layer.leftbound,node.layer.bottombound,node.layer.rightbound,node.layer.topbound).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')));
							}
						},
						{
							xtype: "gx_opacityslider",
							id: 'opacitySlider',
							layer: node.layer,
							vertical: false,
							aggresive: true,
							width: 150,
							x: 10,
							y: 10,
							plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacidad: {opacity}%</div>'}),
							listeners: {
								changecomplete: function(slider, newValue, thumb ){
									Ext.getCmp('arbolCapasContextMenu').destroy();
								}
							}
						}]
					}).show(node.ui.getAnchor());
				}
			}
		},
		plugins: [
			new NodeMouseoverPlugin()
		]
	});
/*
	arbol.on('contextmenu', function (node) {
		var menu = new Ext.menu.Menu({
			id: 'arbolCapasContextMenu',
			items: [{
				xtype: 'menutextitem',
				text: 'Zoom a la capa',
				listeners: {
					click: function(baseItem, e){
						map.zoomToExtent(node.layer.bboxMercator);
					}
				}
			},{
				xtype: "gx_opacityslider",
				id: 'opacitySlider',
				layer: node.layer,
				vertical: false,
				aggresive: true,
				width: 150,
				x: 10,
				y: 10,
				plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacidad: {opacity}%</div>'}),
				listeners: {
					changecomplete: function(slider, newValue, thumb ){
						Ext.getCmp('arbolCapasContextMenu').destroy();
					}
				}
			}]
		});
		menu.show(node.ui.getAnchor());
	}, this);*/


	// El viewport de Ext.js
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[
			{
                region: 'north',
                id: 'north-panel',
                title: 'SIT Santa Cruz',
				header: false, // esto oculta la barrita superior que dice SIT (el title)
                //split: true,
                //width: 255,
				                height: 38,

                //minSize: 175,
                maxSize: 35,
				size: 35,
                collapsible: true,
				//collapsed: true,
                collapseMode: "mini",
                margins: '0 0 0 0',
				//layout: 'border',
				xtype: 'panel',
				html: '<iframe src ="/pizarra/banner.htm" width="100%" height="100%"></iframe>'
				//, items: tabPanel
			},			{
                region: 'west',
                id: 'west-panel',
                title: 'SIT',
				header: false, // esto oculta la barrita superior que dice SIT (el title)
                split: true,
                width: 255,
                minSize: 175,
                maxSize: 450,
                collapsible: true,
				collapsed: true,
                collapseMode: "mini",
                margins: '0 0 0 0',
				layout: 'border',
				items: tabPanel
			},
			{
				region: 'center',
				id: 'center-panel',
				layout: 'border',
				//border: false,
				items: mapPanel
			},
			{
                region: 'south',
				id: 'paneldeabajo',
				stateful: false, // para siempre comience con los paneles en su estado original, sin recordar
                split: true,
                height: 175,
                minSize: 175,
                maxSize: 275,
                collapsible: true,
				collapsed: true,
				layout: 'fit',
				autoScroll: true,
                collapseMode: "mini",
                title: 'Edici&oacute;n extendida de atributos',
				header: false, // esto oculta la barrita superior que edicion extendida de atributos (el title)
                margins: '0 0 0 0',
				xtype: 'panel',
				tbar: editingToolbar,
				items: [editorGridPanel]
			},
			{
                region: 'east',
				id: 'panelderecho',
				stateful: false, // para siempre comience con los paneles en su estado original, sin recordar
                split: true,
                width: 335,
                minSize: 335,
                maxSize: 500,
                collapsible: true,
				collapsed: true,
				layout: 'fit',
				autoScroll: true,
                collapseMode: "mini",
                title: 'Edici&oacute;n de lalala',
				header: false, // esto oculta la barrita superior que edicion extendida de atributos (el title)
                margins: '0 0 0 0',
				html: '<iframe src ="/pizarra/panelderecho.htm" width="100%" height="100%"></iframe>'
			}
		]
    });
	//Ext.getCmp('paneldeabajo').add(gridpanel_inicial);
	viewport.doLayout();


	// Expande el panel lateral para ajusar bien el mapa
	Ext.getCmp('west-panel').expand();


	//Ext.get('loading').fadeOut({remove:true});
	Ext.get('loading').fadeOut();
	var e = document.getElementById('loading');
	e.removeChild(e.childNodes[0]);

	map.setBaseLayer(gcalles);
	/*
	// Centro el mapa en Argentina
	var centro = new OpenLayers.LonLat(-6682509.032320213, -3985104.882285535);
	map.setCenter(centro, 5);
	*/


	// para que ya exista la intancia de gearth tme pistol
	/*
	if (configObj['gearth'] && !Ext.isIE){
		crearVisorGE(map.getCenter());
		ventanaGE.show();
		visorGE.earthLayer.setVisibility(false);
		ventanaGE.hide();
	}*/


	//hago zoom al extent del proyecto
	map.zoomToExtent(extentProyecto900913);
	map.setBaseLayer(ghibrido);
	//map.setBaseLayer(osm);
	
	//seteo el idproyecto en el combo
		setTimeout("elegirProyecto.setValue(idproyectoactivo);",1500);

		
	new Ext.Window({
							title: 'Bienvenido',
							id: 'ventanaBienvenido',
							maximizable: true,
							width: 800,
							height: 580,
							stateful : false,
							closeAction: 'hide',
							html: '<iframe src ="/pizarra/bienvenida.htm" width="100%" height="100%"></iframe>'
						}).show();	
		
		
		
} // Fin del INIT MAP
