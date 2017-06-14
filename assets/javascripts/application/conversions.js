function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code != 0 && !isNaN(code)) {
        str += String.fromCharCode(code);
      }
    }
    str = str.substr(2);
    return str;
}

function toUnifiedLengthLeft(strIn) {//for numbers
  var strOut = "";
  for (var i = 0; i < 64 - strIn.length; i++) {
    strOut += "0"
  }
  strOut += strIn;
  return strOut;
}

function countRows(strIn) {
  var rowsCount = 0;
  if (strIn.length%64 > 0)
    rowsCount = parseInt(strIn.length/64) + 1;
  else
    rowsCount = parseInt(strIn.length/64);
  return rowsCount;
}

function toUnifiedLengthRight(strIn) {//for strings
  var strOut = "";
  strOut += strIn;
  var rowsCount = countRows(strIn);
  for (var i = 0; i < rowsCount*64 - strIn.length; i++) {
    strOut += "0"
  }
  return strOut;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }

    return result
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function toHexString(byteArray) {
  return byteArray.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function bytesCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}