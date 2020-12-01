// pog
console.log('Construction initialized!');

fs.readFile('char.txt', function (err, data) {
   if (err) {
      return console.error(err);
   }
   document.getElementById('charDisplay').innerHTML = data.toString();
});
