// === Texto dinâmico da aba HOME ===
const textoHome = `
  <h3><strong>Por Que a Coleta de Resíduos é Importante?</strong></h3>

<p>A coleta de resíduos é essencial para preservar o meio ambiente e a saúde pública. Quando os resíduos são descartados de forma correta, evitamos a contaminação do solo, da água e do ar. Além disso, a separação adequada dos materiais facilita os processos de reciclagem e reutilização, contribuindo para a redução do volume de lixo em aterros sanitários e diminuindo a extração de recursos naturais.</p>

<p>Essa prática promove uma economia mais sustentável e consciente, baseada no reaproveitamento de materiais e na redução de impactos ambientais.</p>

<h3><strong>Por Que Criamos Este Programa?</strong></h3>

<p>O programa <strong>Coleta Sustentável de Resíduos</strong> foi criado com o objetivo de incentivar práticas ecológicas e promover a educação ambiental entre os cidadãos. Acreditamos que pequenas ações podem gerar grandes transformações.</p>

<p>Utilizamos a tecnologia como uma aliada para tornar o processo de descarte mais acessível e eficiente, conectando as pessoas a pontos de coleta, informações e ferramentas que facilitem a participação ativa da população.</p>

<p>Em cidades como <strong>São Luís do Maranhão</strong>, onde ainda há uma quantidade limitada de pontos de coleta seletiva e pouca visibilidade sobre onde e como descartar corretamente os resíduos, esse tipo de iniciativa é ainda mais urgente. Nosso programa busca preencher essa lacuna, promovendo uma cidade mais limpa, sustentável e preparada para os desafios ambientais do presente e do futuro.</p>

<h3><strong>O Que Você Encontra Neste Site?</strong></h3>

<p>Neste site, você encontra informações claras e acessíveis sobre como realizar a coleta seletiva de forma correta, além de poder consultar os locais disponíveis para descarte e seus respectivos horários de funcionamento.</p>

<p>Também é possível solicitar a coleta de resíduos, registrar reclamações e realizar denúncias relacionadas ao descarte irregular. Tudo foi pensado para facilitar o acesso da população a práticas sustentáveis e contribuir para uma cidade mais limpa e consciente.</p>

<h3><strong>Público-Alvo e Objetivo do Programa</strong></h3>

<p>Este programa é voltado para todas as pessoas que desejam colaborar com a construção de uma cidade mais limpa, sustentável e ecológica. Seja você um cidadão comum, estudante, comerciante ou representante de uma instituição, sua participação é fundamental.</p>

<p>Ao descartar corretamente seus resíduos, você também apoia o trabalho dos catadores, valoriza a cadeia da reciclagem e contribui para o fortalecimento das indústrias que reutilizam materiais.</p>

<p><strong>Nosso principal objetivo</strong> é democratizar o acesso à informação e às ferramentas necessárias para o descarte correto de resíduos sólidos, promovendo educação ambiental, inclusão social e um sistema de coleta mais eficiente e acessível para todos.</p>
`;

document.addEventListener("DOMContentLoaded", () => {
  // Insere o texto na aba Home
  const textoContainer = document.getElementById("texto-home");
  if (textoContainer) {
    textoContainer.innerHTML = textoHome;
  }
  // Animação de letras no título com efeito
  const textoTitulo = "Coleta Sustentável de Resíduos";
  const titulo = document.getElementById("titulo-animado");

  if (titulo) {
    titulo.innerHTML = "";
    [...textoTitulo].forEach((letra, i) => {
      const span = document.createElement("span");
      span.innerHTML = letra === " " ? "&nbsp;" : letra;
      span.style.opacity = 0;
      span.style.transition = `opacity 0.2s ${i * 0.05}s ease-in-out`;
      titulo.appendChild(span);
    });

    setTimeout(() => {
      document.querySelectorAll("#titulo-animado span").forEach(span => {
        span.style.opacity = 1;
      });
    }, 100);
  }
  // Navegação por setas laterais
  const abas = ["home", "info", "pontos", "reclamacoes", "denuncias"];
  let abaAtual = 0;

  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(div => {
      div.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    abaAtual = abas.indexOf(tabId);
  }

  function atualizarAba(index) {
    abaAtual = (index + abas.length) % abas.length;
    showTab(abas[abaAtual]);
  }

  const btnEsquerda = document.getElementById("seta-esquerda");
  const btnDireita = document.getElementById("seta-direita");

  if (btnEsquerda && btnDireita) {
    btnDireita.addEventListener("click", () => atualizarAba(abaAtual + 1));
    btnEsquerda.addEventListener("click", () => atualizarAba(abaAtual - 1));
  }

  // Scroll reveal
  function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    const triggerBottom = window.innerHeight * 0.9;

    elements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Acessibilidade: contraste e modo leitura
  let contrasteAtivado = false;
  let leituraAtivada = false;

  window.aumentarContraste = function () {
    document.body.classList.toggle('contraste-alto');
    contrasteAtivado = !contrasteAtivado;
  };

  window.modoLeitura = function () {
    const imagens = document.querySelectorAll('img');
    imagens.forEach(img => {
      img.style.display = leituraAtivada ? 'block' : 'none';
    });
    leituraAtivada = !leituraAtivada;
  };
  // Expondo showTab globalmente se usado em HTML
  window.showTab = showTab;
});
