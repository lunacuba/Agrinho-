# 🌾 Programa Agrinho - Desafio Agro-Tech 🌱

Este é um projeto web interativo desenvolvido para o **Programa Agrinho 2026**. O objetivo da aplicação é conscientizar jovens e produtores sobre a importância da sustentabilidade no campo, mostrando que é possível alcançar um equilíbrio perfeito entre alta produtividade agrícola e a preservação do meio ambiente.

---

## 🎮 Funcionalidades e Níveis

O site está dividido em 3 dinâmicas interativas:

### 1. Nível 1: Classificação de Práticas (Arrasta e Solta)
* O usuário deve organizar cartões de ações agrícolas entre **Práticas Sustentáveis** (ex: Plantio Direto, Controle Biológico) e **Práticas Ruins** (ex: Queimadas, Excesso de Agrotóxicos).
* Fornece feedback visual imediato para ensinar as escolhas corretas.

### 2. Nível 2: Fazenda Visual (Exploração)
* Um mapa interativo da fazenda onde o usuário clica em pontos estratégicos para descobrir e desbloquear tecnologias ecológicas inovadoras (Painéis Solares, Drones, Sensores de Solo, Irrigação Inteligente e Biodigestores).
* Conta com uma barra de progresso em tempo real.

### 3. Nível 3: O Simulador de Ecocultivo 🏆
* Um simulador completo onde o usuário define o tamanho da sua propriedade, o tipo de semente, o preparo do solo, o sistema de irrigação e a proteção contra pragas.
* **Eventos Aleatórios:** Ataques de pragas podem acontecer no meio da simulação, exigindo tomadas de decisão rápidas!
* **Painel de Resultados:** Exibe o cálculo do Lucro (R$), sacas colhidas (sc) e a porcentagem de preservação do Ambiente.
* **Foto de Satélite Dinâmica:** O mapa altera as cores e os elementos de acordo com a saúde ecológica da fazenda.
* **Base de Dados (Mural de Líderes):** Permite salvar o resultado final diretamente no navegador (`LocalStorage`) criando um ranking dinâmico com os melhores produtores.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web puras (Vanilla Architecture), sem a necessidade de instalar frameworks externos:

* **HTML5:** Estruturação semântica de toda a aplicação, formulários e modais.
* **CSS3:** Estilização moderna com variáveis (`:root`), layouts responsivos (Flexbox e Grid), animações de nuvens flutuantes e paleta de cores baseada na identidade do Programa Agrinho.
* **JavaScript (ES6):** Toda a lógica do simulador de negócios, manipulação de eventos de Arrasta e Solta (Drag and Drop API), controle de modais e persistência de dados local.

---

## 📂 Estrutura do Projeto

O código está modularizado e organizado em 3 arquivos principais lincados entre si:

```bash
📂 agrinho-agro-tech/
├── 📄 index.html      # Estrutura e conteúdo da página
├── 📄 style.css       # Estilização, cores e animações
├── 📄 script.js      # Lógica dos jogos, simulador e banco de dados
└── 📄 README.md       # Documentação do projeto (Este arquivo)
