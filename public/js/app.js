var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length;

function encode(num){
	var encoded = '';
	//initalize with empty string
	while(num){
		var remainder = num%base;
		num = Math.floor(num / base);
		encoded = alphabet[remainder].toString() + encoded;
		//adding encoded concats it into a string form instead of int
	}
	return encoded;
}

function decode(str){
	var decoded = 0;
	while(str){
		var index = alphabet.indexOf(str[0]);
		var power = str.length - 1;
		decoded += index * (Math.pow(base, power));
		str = str.substring(1);
	}
	return decoded;
}

module.exports.encode = encode;
module.exports.decode = decode;