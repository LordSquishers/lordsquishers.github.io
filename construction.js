// pog
console.log('Construction initialized!');

let updateCharcoal = function (percent) {
    console.log('Displaying charcoal data: ' + percent)
    document.getElementById("charDisplay").innerHTML = "Charcoal Storage: " + percent + "% full"
};

exports.updateCharcoal = updateCharcoal;
