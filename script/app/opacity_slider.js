var slider = new GeoExt.LayerOpacitySlider({
    width: 70,
    layer: null,
    aggressive: true,
    inverse: true,
    plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Transparencia: {opacity}%</div>'})
});

var setearSlider = function (tree) {
    tree.on("click", function (node) {
    	if (node.isLeaf()) {
            slider.setLayer(node.layer);

            if (app.selectedLayer.data.metadataURLs[0]){
            	btnMetadatos.enable();
            } else {
            	btnMetadatos.disable();
            };
        };
    });
};