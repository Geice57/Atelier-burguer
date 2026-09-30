// ===============================
// CADASTRO
// ===============================

function cadastrar() {

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let telefone = document.getElementById("telefone").value;

    // Verifica se todos os campos foram preenchidos
    if (nome === "" || email === "" || telefone === "") {

        alert("Preencha todos os campos!");

        return;
    }
    // Salva os dados do cliente
    localStorage.setItem("nome", nome);
    localStorage.setItem("email", email);
    localStorage.setItem("telefone", telefone);

    alert("Cadastro realizado com sucesso! 🎉");
    // Depois do cadastro, vai para o LOGIN
    window.location.href = "index.html";
}
// ===============================
// LOGIN
// ===============================
function login() {
    // Pega os dados digitados no login
    let email = document.getElementById("loginEmail").value;
    let telefone =  document.getElementById("loginTelefone").value;
    // Pega os dados salvos no cadastro
    let emailCadastrado =
    localStorage.getItem("email");
    let telefoneCadastrado =
     localStorage.getItem("telefone");

    // Verifica se os campos foram preenchidos
    if (email === "" || telefone === "") {

        alert("Preencha o e-mail e o telefone!");

        return;
    }


    // Compara os dados
    if (
        email === emailCadastrado &&
        telefone === telefoneCadastrado
    ) {

        // Salva que o cliente fez login
        localStorage.setItem(
            "logado",
            "true"
        );


        alert(
            "Login realizado com sucesso! 🎉"
        );


        // Vai para o antigo INDEX
        // que agora se chama inicio.html
        window.location.href =
            "inicio.html";

    } else {

        alert(
            "E-mail ou telefone incorretos!"
        );

    }
}


// ===============================
// ADICIONAR PRODUTO AO CARRINHO
// ===============================

function adicionarCarrinho(nome, preco) {

    // Pega o carrinho salvo
    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    // Adiciona o produto
    carrinho.push({
        nome: nome,
        preco: Number(preco)
    });

    // Salva o carrinho
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    alert(nome + " foi adicionado ao carrinho! 🛒");
}


// ===============================
// MOSTRAR CARRINHO
// ===============================

function mostrarCarrinho() {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    let lista =
        document.getElementById("listaCarrinho");

    let totalElemento =
        document.getElementById("total");


    // Verifica se os elementos existem
    if (!lista || !totalElemento) {
        return;
    }


    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {

        lista.innerHTML =
            "<p>Seu carrinho está vazio. 🛒</p>";

        totalElemento.innerText =
            "Total: R$ 0,00";

        return;
    }


    lista.innerHTML = "";

    let total = 0;


    // Mostra cada produto
    carrinho.forEach(function(produto, indice) {

        lista.innerHTML += `
            <div class="item-carrinho">

                <h3>${produto.nome}</h3>

                <p>
                    R$ ${Number(produto.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <button onclick="removerProduto(${indice})">
                    ❌ Remover
                </button>

            </div>
        `;

        total += Number(produto.preco);

    });


    // Mostra o total
    totalElemento.innerText =
        "Total: R$ " +
        total.toFixed(2).replace(".", ",");
}


// ===============================
// REMOVER PRODUTO
// ===============================

function removerProduto(indice) {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    // Remove o produto
    carrinho.splice(indice, 1);


    // Salva novamente
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // Atualiza a tela
    mostrarCarrinho();
}


// ===============================
// MOSTRAR RESUMO DO PAGAMENTO
// ===============================

function mostrarResumoPagamento() {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    let subtotal = 0;


    // Soma o preço dos produtos
    carrinho.forEach(function(produto) {

        subtotal += Number(produto.preco);

    });


    // Taxa fixa de entrega
    let taxaEntrega = 5;


    // Calcula o total final
    let totalFinal =
        subtotal + taxaEntrega;


    // Mostra o subtotal
    let subtotalElemento =
        document.getElementById("subtotal");


    if (subtotalElemento) {

        subtotalElemento.innerText =
            "Subtotal: R$ " +
            subtotal.toFixed(2).replace(".", ",");

    }


    // Mostra o total final
    let totalElemento =
        document.getElementById("totalFinal");


    if (totalElemento) {

        totalElemento.innerText =
            "Total: R$ " +
            totalFinal.toFixed(2).replace(".", ",");

    }
}


// ===============================
// FINALIZAR PEDIDO
// ===============================

function finalizarPedido() {

    // Pega os dados do endereço
    let rua =
        document.getElementById("rua").value;

    let numero =
        document.getElementById("numero").value;

    let bairro =
        document.getElementById("bairro").value;

    let complemento =
        document.getElementById("complemento").value;


    // Verifica o endereço
    if (
        rua === "" ||
        numero === "" ||
        bairro === ""
    ) {

        alert(
            "Preencha a rua, número e bairro!"
        );

        return;
    }


    // Verifica a forma de pagamento
    let pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    if (!pagamento) {

        alert(
            "Escolha uma forma de pagamento!"
        );

        return;
    }


    // Pega o carrinho
    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    // Calcula o subtotal
    let subtotal = 0;


    carrinho.forEach(function(produto) {

        subtotal += Number(produto.preco);

    });


    // Taxa de entrega
    let taxaEntrega = 5;


    // Calcula o total final
    let totalFinal =
        subtotal + taxaEntrega;


    // ===============================
    // SALVAR ENDEREÇO
    // ===============================

    localStorage.setItem(
        "rua",
        rua
    );

    localStorage.setItem(
        "numero",
        numero
    );

    localStorage.setItem(
        "bairro",
        bairro
    );

    localStorage.setItem(
        "complemento",
        complemento
    );


    // ===============================
    // SALVAR VALORES
    // ===============================

    localStorage.setItem(
        "subtotal",
        subtotal
    );

    localStorage.setItem(
        "taxaEntrega",
        taxaEntrega
    );

    localStorage.setItem(
        "totalFinal",
        totalFinal
    );


    // ===============================
    // SALVAR PAGAMENTO
    // ===============================

    localStorage.setItem(
        "pagamento",
        pagamento.value
    );


    // ===============================
    // STATUS INICIAL DO PEDIDO
    // ===============================

    localStorage.setItem(
        "statusPedido",
        "recebido"
    );


    // ===============================
    // IR PARA CONFIRMAÇÃO
    // ===============================

    window.location.href =
        "confirmacao.html";
}
