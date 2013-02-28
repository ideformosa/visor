var i = new Ext.Slider({
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
    });

var setearSlider = function (b) {
            b.on("click", function (a) {
                i.layer = a.layer;
                i.setValue(a.layer.opacity * 100);
                i.enable();
            });
        };