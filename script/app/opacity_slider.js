var slider = new GeoExt.LayerOpacitySlider({
    width: 80,
    layer: null,
    aggressive: true,
    inverse: true,
    plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Transparencia: {opacity}%</div>'})
});

// b: tree
// a: node
var setearSlider = function (b) {
            b.on("click", function (a) {
                slider.setLayer(a.layer);
            });
        };

