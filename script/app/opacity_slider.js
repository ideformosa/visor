/*var i = new Ext.Slider({
        width: 120,
        decimalPrecision: 1,
        increment: 10,
        value: 50,
        disabled: true,
        layer: null,
        listeners: {
            change: function (a, b) {
                this.layer.setOpacity(b / 100);
            }
        }
    });*/

// b: tree
// a: node
var setearSlider = function (b) {
            b.on("click", function (a) {
                //Ext.getCmp('op_slider').layer = a.layer;
                //i.layer = a.layer;
                //i.setValue(a.layer.opacity * 100);
                //i.enable();

                slider.setLayer(a.layer);
            });
        };


var slider = new GeoExt.LayerOpacitySlider({
    width: 80,
    layer: null,
    aggressive: true,
    inverse: true,
    plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Transparencia: {opacity}%</div>'})
});


// prueba 1: agregando "i" en tbar:[] agrega el slider en el 1er lugar.
// prueba 2: evento "afterrender" del tree, agrego el slider con add() o insert(index,comp) --> lo agrega al inicio
// prueba 3: en app.tools agrego xtype: slider y outputTarget: tree.tbar --> genera una ventanita vacia