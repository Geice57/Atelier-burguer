<script>
  // Variável global para controlar o estado da leitura
    let lendo = false;
    let mensagemUtterance = null;

    // Seleciona os elementos do HTML
    const botaoOuvir = document.getElementById('btn-ouvir');
    const areaConteudo = document.getElementById('conteudo-principal');

    //Função principal de leitura//  
    function alternarLeitura() {
        // Se já estiver lendo, o clique no botão para a voz
    }
    // Se já estiver lendo, o clique no botão para a voz
    if (lendo) {window.speechSynthesis.cancel()};
    botaoOuvir.innerText = "🔊 Ouvir Conteúdo";
    botaoOuvir.setAttribute('aria-label', "Ouvir o conteúdo da página");
    lendo = false;
    return;
    }

    // Pega todo o texto visível de dentro da área principal
    const textoParaLer = areaConteudo.innerText;

    if (textoParaLer.trim() !== "") {
        // Cancela qualquer outra voz do navegador ativa
        window.speechSynthesis.cancel()};

    // Cria o objeto de fala
    mensagemUtterance = new SpeechSynthesisUtterance(textoParaLer);
    mensagemUtterance.lang = 'pt-BR'; // Define o idioma para Português do Brasil
    mensagemUtterance.rate = 1.1;     // Velocidade da fala um pouco mais natural

    // Evento disparado quando a voz termina de falar tudo
    mensagemUtterance.onend = function() {botaoOuvir.innerText = "🔊 Ouvir Conteúdo"};
    lendo = false;
      }

    // Altera o texto do botão para indicar que o usuário pode pausar
    botaoOuvir.innerText = "🛑 Parar Leitura";
    botaoOuvir.setAttribute('aria-label', "Parar a leitura do conteúdo");
    lendo = true;

    // Executa a voz nativa do navegador
    window.speechSynthesis.speak(mensagemUtterance);
    }


    // Adiciona o evento de clique ao botão
    botaoOuvir.addEventListener('click', alternarLeitura);
</script>;
