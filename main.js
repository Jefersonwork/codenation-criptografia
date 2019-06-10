var resposta_api;

const request = () => {
  axios.get("https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=6072dac7509e61ff97ae34d7d8c6fe58bb84dc3f")
  .then(resp => { resposta_api = resp.data })
  .then(resp => { compara() });
}

const alfabeto = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const frase_cifrada = [];
const frase_decifrada = [];

const compara = () => {
  let casas = resposta_api.numero_casas;

  for (var i = 0; i < resposta_api.cifrado.length; i++) {
    frase_cifrada.push(resposta_api.cifrado[i]);
  }

  frase_cifrada.map(letra => {
    let index = alfabeto.indexOf(letra);
    let append_letra = index - (casas - 1);
    
    if (letra === " ") {
      frase_decifrada.push(" ");
    } else if ( letra === ".") {
      frase_decifrada.push(".");
    }else if (append_letra < 0) {
      frase_decifrada.push(alfabeto[append_letra + 25]);
    } else {
      frase_decifrada.push(alfabeto[append_letra - 1]);
    }
  });
  
  resposta_api.decifrado = frase_decifrada.join("");
  encrypt();
}

const encrypt = () => {
  let StringToSign = resposta_api.decifrado;
  let hash = CryptoJS.SHA1(StringToSign);
  
  let result = CryptoJS.enc.Hex.stringify(hash);
  
  resposta_api.resumo_criptografico = result;
  send();
}
request();

const send = () => {
  const json = JSON.stringify(resposta_api);
  const data = new Blob([json], {
    type: "application/json"
  });
  const answer = new FormData();
  answer.append("answer", data);
  axios.post("https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=6072dac7509e61ff97ae34d7d8c6fe58bb84dc3f", answer,
    {
      header: {
        type: 'answer',
        name: 'answer',
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
  }).then(resp => { console.log("sucesso " + resp.data) })
  .catch(resp => {
    console.log("error " + resp)
  })
}

