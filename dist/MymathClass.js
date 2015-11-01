define(["require", "exports"], function (require, exports) {
    var Mymath = (function () {
        function Mymath() {
        }
        Mymath.add = function (x, y) { return x + y; };
        Mymath.subtract = function (x, y) { return x - y; };
        Mymath.multiply = function (x, y) { return x * y; };
        return Mymath;
    })();
    exports.Mymath = Mymath;
});
