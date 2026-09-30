/* =========================================================
   ACESSIBILIDADE - ATELIER BURGUER
   Compatível com as páginas do projeto.
   ========================================================= */

(function () {
    "use strict";

    const STORAGE = {
        contraste: "ab_acess_contraste",
        textoGrande: "ab_acess_texto",
        espacamento: "ab_acess_espacamento",
        visual: "ab_acess_visual"
    };

    function criarInterface() {
        if (document.getElementById("acessibilidade")) return;

      

        const barra = document.createElement("div");
        barra.id = "acessibilidade";
        barra.className = "acessibilidade-barra";
        barra.setAttribute("role", "toolbar");
        barra.setAttribute("aria-label", "Ferramentas de acessibilidade");

        barra.innerHTML = `
            <button type="button" id="btnAcess" aria-expanded="false"
                aria-controls="painelAcess">♿ Acessibilidade</button>
            <button type="button" id="btnLer" aria-label="Ler todo o conteúdo da página">🔊 Ler página</button>
            <button type="button" id="btnParar" aria-label="Parar a leitura">⏹ Parar</button>
        `;
        document.body.appendChild(barra);

        const painel = document.createElement("section");
        painel.id = "painelAcess";
        painel.className = "acessibilidade-painel";
        painel.hidden = true;
        painel.setAttribute("aria-label", "Opções de acessibilidade");
        painel.innerHTML = `
            <h2>♿ Acessibilidade</h2>
            <p>Use estas opções para facilitar a navegação. As alterações ficam salvas neste navegador.</p>
            <button type="button" id="btnContraste">◐ Alto contraste</button>
            <button type="button" id="btnTexto">A+ Aumentar texto</button>
            <button type="button" id="btnEspaco">↔ Aumentar espaçamento</button>
            <button type="button" id="btnVisual">👁 Modo visual para pessoas surdas</button>
            <button type="button" id="btnFoco">⌨ Explicar navegação pelo teclado</button>
            <div id="statusAcess" class="acessibilidade-status" role="status" aria-live="polite">
                Acessibilidade pronta.
            </div>
        `;
        document.body.appendChild(painel);

        const visual = document.createElement("div");
        visual.id = "sinalVisual";
        visual.className = "acessibilidade-sinal-visual";
        visual.setAttribute("role", "status");
        visual.setAttribute("aria-live", "assertive");
        visual.textContent = "Modo visual ativado. As mensagens importantes também serão apresentadas na tela.";
        document.body.appendChild(visual);

        document.getElementById("btnAcess").addEventListener("click", () => {
            const aberto = !painel.hidden;
            painel.hidden = aberto;
            document.getElementById("btnAcess").setAttribute("aria-expanded", String(!aberto));
            if (!aberto) document.getElementById("btnContraste").focus();
        });

        document.getElementById("btnLer").addEventListener("click", lerPagina);
        document.getElementById("btnParar").addEventListener("click", pararLeitura);
        document.getElementById("btnContraste").addEventListener("click", alternarContraste);
        document.getElementById("btnTexto").addEventListener("click", alternarTexto);
        document.getElementById("btnEspaco").addEventListener("click", alternarEspacamento);
        document.getElementById("btnVisual").addEventListener("click", alternarModoVisual);
        document.getElementById("btnFoco").addEventListener("click", explicarTeclado);

        carregarPreferencias();
        melhorarSemantica();
        observarMensagens();
    }

    function obterTextoDaPagina() {
        const clone = document.body.cloneNode(true);

        clone.querySelectorAll(
            "#acessibilidade, #painelAcess, #sinalVisual, script, style, noscript"
        ).forEach(el => el.remove());

        // Textos de botões e links também entram na leitura.
        const texto = clone.innerText
            .replace(/\s+/g, " ")
            .replace(/(🔊|⏹|♿|◐|A\+|↔|👁|⌨)/g, "")
            .trim();

        return texto;
    }

    function lerPagina() {
        if (!("speechSynthesis" in window)) {
            mostrarStatus("Seu navegador não oferece leitura de voz.");
            return;
        }

        pararLeitura();

        const texto = obterTextoDaPagina();
        if (!texto) {
            mostrarStatus("Não encontrei conteúdo para ler nesta página.");
            return;
        }

        const fala = new SpeechSynthesisUtterance(texto);
        fala.lang = "pt-BR";
        fala.rate = 0.9;
        fala.pitch = 1;

        fala.onstart = () => mostrarStatus("Leitura iniciada.");
        fala.onend = () => mostrarStatus("Leitura concluída.");
        fala.onerror = () => mostrarStatus("Não foi possível concluir a leitura.");

        window.speechSynthesis.speak(fala);
    }

    function pararLeitura() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            mostrarStatus("Leitura interrompida.");
        }
    }

    function alternarContraste() {
        document.body.classList.toggle("alto-contraste");
        const ativo = document.body.classList.contains("alto-contraste");
        localStorage.setItem(STORAGE.contraste, ativo);
        mostrarStatus(ativo ? "Alto contraste ativado." : "Alto contraste desativado.");
    }

    function alternarTexto() {
        document.body.classList.toggle("texto-grande");
        const ativo = document.body.classList.contains("texto-grande");
        localStorage.setItem(STORAGE.textoGrande, ativo);
        mostrarStatus(ativo ? "Texto aumentado." : "Tamanho normal restaurado.");
    }

    function alternarEspacamento() {
        document.body.classList.toggle("espacamento");
        const ativo = document.body.classList.contains("espacamento");
        localStorage.setItem(STORAGE.espacamento, ativo);
        mostrarStatus(ativo ? "Espaçamento aumentado." : "Espaçamento normal restaurado.");
    }

    function alternarModoVisual() {
        document.body.classList.toggle("modo-visual");
        const ativo = document.body.classList.contains("modo-visual");
        localStorage.setItem(STORAGE.visual, ativo);
        mostrarStatus(
            ativo
                ? "Modo visual ativado. Informações importantes serão mostradas visualmente."
                : "Modo visual desativado."
        );
    }

    function explicarTeclado() {
        mostrarStatus("Use Tab para avançar, Shift + Tab para voltar e Enter ou Espaço para ativar botões e links.");
    }

    function mostrarStatus(mensagem) {
        const status = document.getElementById("statusAcess");
        if (status) status.textContent = mensagem;

        const sinal = document.getElementById("sinalVisual");
        if (sinal && document.body.classList.contains("modo-visual")) {
            sinal.textContent = mensagem;
            sinal.style.display = "block";
            clearTimeout(window._abSinalTimer);
            window._abSinalTimer = setTimeout(() => {
                sinal.style.display = "";
            }, 5000);
        }
    }

    function carregarPreferencias() {
        if (localStorage.getItem(STORAGE.contraste) === "true")
            document.body.classList.add("alto-contraste");
        if (localStorage.getItem(STORAGE.textoGrande) === "true")
            document.body.classList.add("texto-grande");
        if (localStorage.getItem(STORAGE.espacamento) === "true")
            document.body.classList.add("espacamento");
        if (localStorage.getItem(STORAGE.visual) === "true")
            document.body.classList.add("modo-visual");
    }

    function melhorarSemantica() {
        const main = document.querySelector("main");
        if (main && !main.id) main.id = "conteudo-principal";

        // Conecta labels aos campos que possuem IDs.
        document.querySelectorAll("label").forEach(label => {
            const texto = label.textContent.trim();
            const forId = label.getAttribute("for");
            if (!forId && texto) {
                const campo = label.nextElementSibling;
                if (campo && campo.id) label.setAttribute("for", campo.id);
            }
        });

        // Campos sem label explícito recebem uma descrição acessível.
        document.querySelectorAll("input, textarea, select").forEach(campo => {
            if (!campo.getAttribute("aria-label") && !campo.getAttribute("aria-labelledby")) {
                const id = campo.id;
                const label = id ? document.querySelector(`label[for="${id}"]`) : null;
                if (label) {
                    campo.setAttribute("aria-label", label.textContent.trim());
                } else if (campo.placeholder) {
                    campo.setAttribute("aria-label", campo.placeholder);
                }
            }
        });

        // Botões e links com apenas emoji passam a ter nome acessível.
        document.querySelectorAll("button, a").forEach(el => {
            const texto = el.textContent.replace(/\s+/g, " ").trim();
            if (!el.getAttribute("aria-label") && texto) {
                el.setAttribute("aria-label", texto);
            }
        });

        // Imagens sem alt recebem descrição genérica segura.
        document.querySelectorAll("img").forEach(img => {
            if (!img.hasAttribute("alt")) img.setAttribute("alt", "Imagem do Atelier Burguer");
        });
    }

    function observarMensagens() {
        // Mostra visualmente mensagens dinâmicas importantes no modo para surdos.
        const alvos = document.querySelectorAll(
            "#mensagemStatus, #mensagemAdmin, #total, #totalFinal, #listaCarrinho"
        );

        if (!alvos.length || !window.MutationObserver) return;

        const observer = new MutationObserver(() => {
            if (!document.body.classList.contains("modo-visual")) return;
            const mensagens = [];
            alvos.forEach(el => {
                const t = el.innerText && el.innerText.trim();
                if (t) mensagens.push(t);
            });
            if (mensagens.length) mostrarStatus(mensagens[mensagens.length - 1]);
        });

        alvos.forEach(alvo => observer.observe(alvo, {
            childList: true,
            subtree: true,
            characterData: true
        }));
    }

    // Atalhos de teclado:
    // Alt + A = abre/fecha acessibilidade
    // Alt + L = lê a página
    // Esc = para a leitura e fecha o painel
    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key.toLowerCase() === "a") {
            event.preventDefault();
            document.getElementById("btnAcess")?.click();
        }
        if (event.altKey && event.key.toLowerCase() === "l") {
            event.preventDefault();
            lerPagina();
        }
        if (event.key === "Escape") {
            pararLeitura();
            const painel = document.getElementById("painelAcess");
            if (painel && !painel.hidden) {
                painel.hidden = true;
                document.getElementById("btnAcess")?.setAttribute("aria-expanded", "false");
            }
        }
    });

    // Reforço para leitores de tela: idioma e título.
    document.documentElement.lang = "pt-BR";

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", criarInterface);
    } else {
        criarInterface();
    }
})();