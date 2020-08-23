// Each element in the lists represents a different KOH concentration.
// The first value is a and the second is b in the following exponential equation:
// rate = a * exp(b * temperature) 

var si100Params = {20:[1.14841169, 0.05380941],
                   25:[1.11669074, 0.0537997 ],
                   30:[1.06355582, 0.05366365],
                   35:[0.94618416, 0.05393288],
                   40:[0.82590772, 0.0541723 ],
                   45:[0.70513615, 0.05407911],
                   50:[0.59237235, 0.05396245],
                   55:[0.47217685, 0.05404856],
                   60:[0.33815615, 0.05461262]};

var si110Params = {20:[1.74307835, 0.05424069],
                   25:[1.64149062, 0.05456073],
                   30:[1.55576454, 0.05446794],
                   35:[1.47684319, 0.05431875],
                   40:[1.30315911, 0.05436177],
                   45:[1.09097436, 0.05467834],
                   50:[0.88819885, 0.05431859],
                   55:[0.68558588, 0.05456556],
                   60:[0.55017811, 0.05403184]};

var sio2Params = {20:[0.61932724, 0.07571817],
                  25:[0.60257424, 0.07826088],
                  30:[0.65843023, 0.07973229],
                  35:[0.75957035, 0.07838994],
                  40:[0.9532963 , 0.07528702],
                  45:[1.27034857, 0.07190373],
                  50:[1.38564764, 0.06991053],
                  55:[1.02666233, 0.07147684],
                  60:[0.61204953, 0.07493948]}

function calculateRate() {
    // first determine what material we want to etch
    if (document.getElementById('si_100').checked) {
        var material = 'si_100';
    } else if (document.getElementById('si_110').checked) {
        var material = 'si_110';
    } else {
        var material = 'si_o2';
    }
    // check if we're dealing with a saturated IPA solution
    if (document.getElementById('ipa').checked) {
        var ipa = true
    } else {
        var ipa = false
    }
    // save selected KOH concentration and etch temperature
    var concentration = document.getElementById('conc_sel').value;
    var temperature = document.getElementById('temp_sel').value;
    
    // calculate rate
    if (material == 'si_100') {
        var a = si100Params[concentration][0];
        var b = si100Params[concentration][1];
        var units = ' microns/hour';
    } else if (material == 'si_110') {
        var a = si110Params[concentration][0];
        var b = si110Params[concentration][1];
        var units = ' microns/hour';
    } else {
        var a = sio2Params[concentration][0];
        var b = sio2Params[concentration][1];
        var units = ' nanometers/hour';
    }
    if (ipa == true) {
        var mod = 0.8;
    } else {
        var mod = 1;
    }
    var rate = (mod*(a * Math.exp(b * temperature))).toFixed(2);
    document.getElementById('rate').innerHTML = rate + units;
}

function displayIpaWarning() {
    // check if we're dealing with a saturated IPA solution
    if (document.getElementById('ipa').checked) {
        document.getElementById('ipa_warning').innerHTML = "WARNING: This is only an approximation that can be made for 100 Si and even at that, the accuracy is not high. We strongly recommend reading related literature before performing a saturated IPA etch process. Here is a good starting point:<br><br>Rola, K.P., Zubel, I. Impact of alcohol additives concentration on etch rate and surface morphology of (100) and (110) Si substrates etched in KOH solutions. Microsyst Technol 19, 635–643 (2013). https://doi.org/10.1007/s00542-012-1675-x"
    } else {
        document.getElementById('ipa_warning').innerHTML = "";
    }
}

function displayKohWarning() {
    // check if we're dealing with a saturated IPA solution
    if (document.getElementById('conc_sel').value == "20") {
        document.getElementById('koh_warning').innerHTML = "WARNING: KOH concentrations below 30% have been found to yield rough etches."
    } else if (document.getElementById('conc_sel').value == "25") {
        document.getElementById('koh_warning').innerHTML = "WARNING: KOH concentrations below 30% have been found to yield rough etches.";
    } else {
        document.getElementById('koh_warning').innerHTML = "";
    }
}

// we take specific gravities for KOH from Perry's Chemical Engineer's Handbook,
// version 8
var specificGravity = {
    20:1.1884,
    25:1.2387,
    30:1.2905,
    35:1.3440,
    40:1.3991,
    45:1.4558
};

function calculateDilution() {
    var concentration = document.getElementById('conc_des').value;
    var finalVolume = document.getElementById('vol').value;
    var sg = specificGravity[concentration];
    var sgKOH = specificGravity[45];
    var kohVolume = Math.round(finalVolume * sg * concentration / (sgKOH * 45));
    document.getElementById('dilute').innerHTML = 'Add DI water to ' + kohVolume + ' mL of 45 wt. % KOH to reach ' + finalVolume + ' mL total volume.'
}
