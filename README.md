# Republicar - Plataforma de Gestão de Repúblicas

Bem-vindo ao **Republicar**, uma plataforma centralizada para facilitar a gestão financeira e administrativa de repúblicas estudantis e moradias compartilhadas.

## 📋 Sobre o Projeto

O objetivo principal da plataforma é fornecer ferramentas para que donos de repúblicas possam gerenciar ocupantes, registrar despesas categorizadas e gerar relatórios para a divisão de custos de forma justa e transparente.

### Funcionalidades Principais

- **Gestão de Ocupantes**: Cadastro de moradores, controle de renda e histórico.
- **Controle de Despesas**: Lançamento de contas com categorização (ex: Fixas, Alimentação) e subcategorias.
- **Divisão de Contas Inteligente**:
  - **Igualitária**: Divisão simples pelo número de moradores.
  - **Proporcional à Renda**: Cálculo justo baseado na capacidade financeira de cada ocupante.
- **Dashboard Financeiro**: Visualização clara das despesas mensais e gráficos de distribuição.
- **Portal do Morador**: Acesso transparente para os ocupantes visualizarem seus débitos e relatórios.

## 🚀 Tecnologias

- **Frontend**: [Next.js](https://nextjs.org/) (React)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Linguagem**: TypeScript
- **Gerenciador de Pacotes**: pnpm
- **Containerização**: Docker

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 22 ou superior recomendada)
- [pnpm](https://pnpm.io/) (para gerenciamento de dependências)
- [Docker](https://www.docker.com/) (opcional, para rodar em container)

## 📦 Como Rodar o Projeto

### Instalação Local

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Republicar/republicar-front.git
    cd republicar-front
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```

4.  **Acesse a aplicação:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 🐳 Rodando com Docker

Você também pode rodar o projeto utilizando Docker, garantindo um ambiente isolado e consistente.

1.  **Construa a imagem:**
    ```bash
    docker build -t republicar-front .
    ```

2.  **Execute o container:**
    ```bash
    docker run -p 3000:3000 republicar-front
    ```

3.  **Acesse a aplicação:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 💻 Fluxo de Desenvolvimento (Development Workflow)

### Convenções de Commit

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/). Utilizamos o **Commitizen** para auxiliar na criação de mensagens de commit padronizadas.

Para realizar um commit, utilize um dos comandos abaixo:

```bash
pnpm commit
```
ou
```bash
git commit
```

Ambos abrirão um prompt interativo para guiá-lo no preenchimento da mensagem.

### Linting e Formatação

Utilizamos **Husky** e **lint-staged** para garantir a qualidade do código automaticamente antes de cada commit.

- **Pre-commit**: Executa `eslint` e `prettier` apenas nos arquivos modificados (staged).
- **Commit-msg**: Valida se a mensagem do commit segue o padrão convencional.

Caso encontre erros, o commit será abortado. Corrija os problemas apontados e tente novamente.
