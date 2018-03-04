var toAscii = function(hex) {
  var str = '',
      i = 0,
      l = hex.length;
  if (hex.substring(0, 2) === '0x') {
      i = 2;
  }
  for (; i < l; i+=2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) continue; // this is added
      str += String.fromCharCode(code);
  }
  return str;
};

module.exports = {
  toAscii: toAscii
}
