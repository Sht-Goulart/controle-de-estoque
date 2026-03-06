# Gerenciador de Estoque Dinâmico com Firebase

Este é um aplicativo de gerenciamento de estoque e pedidos construído com React, Vite e Firestore.

## 🚀 Como começar

### 1. Configurar o Firebase

Este aplicativo requer um projeto no Firebase. Siga estas etapas:

1.  Vá para o [Console do Firebase](https://console.firebase.google.com/).
2.  Crie um novo projeto (ex: `controle-de-estoque`).
3.  Adicione um aplicativo da web ao seu projeto.
4.  Copie as credenciais do Firebase (`apiKey`, `authDomain`, `projectId`, etc.).
5.  Abra o arquivo `src/firebase.js` no projeto e substitua os espaços reservados pelas suas credenciais reais.

### 2. Configurar o Banco de Dados Firestore

O erro **"The database (default) does not exist"** ocorre porque o banco de dados Firestore ainda não foi inicializado no seu projeto.

1.  No console do Firebase, no menu lateral, clique em **Firestore Database**.
2.  Clique em **Criar banco de dados**.
3.  Escolha o modo (Teste ou Produção).
4.  Selecione o local do servidor (ex: `southamerica-east1` para o Brasil).
5.  Clique em **Ativar**.

Se preferir fazer pelo Google Cloud Console, use este link: [Configuração do Firestore](https://console.cloud.google.com/datastore/setup).

### 3. Configurar Regras de Segurança (IMPORTANTE)

Se você não conseguir adicionar produtos ou pedidos (erro de "permissão negada"), você precisa ajustar as Regras de Segurança:

1.  No Console do Firebase, vá em **Firestore Database** > aba **Regras**.
2.  Para fins de teste e desenvolvimento inicial, você pode usar estas regras (permite leitura e escrita por qualquer pessoa por um tempo limitado):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3.  Clique em **Publicar**.
4.  *Nota: Para um aplicativo em produção, você deve restringir o acesso apenas a usuários autenticados.*

### 4. Estrutura do Banco de Dados

O aplicativo criará automaticamente as coleções `products` e `orders` assim que você começar a adicionar itens, mas você pode criá-las manualmente se desejar.

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Gerar o build para produção
npm run build
```

## ✨ Funcionalidades

- **Gerenciamento de Estoque:** Adicione, edite e exclua produtos com controle de quantidade.
- **Sistema de Pedidos:** Carrinho de compras dinâmico com seleção de produtos.
- **Baixa Automática:** O estoque é atualizado automaticamente via transações do Firestore ao confirmar um pedido.
- **Painel do Estoquista:** Visualização exclusiva para gerenciamento de status de entrega e pagamento.
- **Data de Pagamento:** Controle de quando os pedidos devem ser pagos.
