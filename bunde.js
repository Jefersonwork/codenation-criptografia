"use strict";

var resposta_api;

var request = function request() {
  axios.get("https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=6072dac7509e61ff97ae34d7d8c6fe58bb84dc3f").then(function (resp) {
    resposta_api = resp.data;
  }).then(function (resp) {
    compara();
  });
};

var alfabeto = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var frase_cifrada = [];
var frase_decifrada = [];

var compara = function compara() {
  var casas = resposta_api.numero_casas;

  for (var i = 0; i < resposta_api.cifrado.length; i++) {
    frase_cifrada.push(resposta_api.cifrado[i]);
  }

  frase_cifrada.map(function (letra) {
    var index = alfabeto.indexOf(letra);
    var append_letra = index - (casas - 1);

    if (letra === " ") {
      frase_decifrada.push(" ");
    } else if (letra === ".") {
      frase_decifrada.push(".");
    } else if (append_letra < 0) {
      frase_decifrada.push(alfabeto[append_letra + 25]);
    } else {
      frase_decifrada.push(alfabeto[append_letra - 1]);
    }
  });
  resposta_api.decifrado = frase_decifrada.join("");
  encrypt();
};

var encrypt = function encrypt() {
  var StringToSign = resposta_api.decifrado;
  var hash = CryptoJS.SHA1(StringToSign);
  var result = CryptoJS.enc.Hex.stringify(hash);
  resposta_api.resumo_criptografico = result;
  send();
};

request();

var send = function send() {
  var json = JSON.stringify(resposta_api);
  var data = new Blob([json], {
    type: "application/json"
  });
  var answer = new FormData();
  answer.append("answer", data);
  axios.post("https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=6072dac7509e61ff97ae34d7d8c6fe58bb84dc3f", answer, {
    header: {
      type: 'answer',
      name: 'answer',
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }).then(function (resp) {
    console.log("sucesso " + resp.data);
  })["catch"](function (resp) {
    console.log("error " + resp);
  });
};
