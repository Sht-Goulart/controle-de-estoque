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

1.  No console do Firebase, no menu lateral, clique em **Firestore Database**.
2.  Clique em **Criar banco de dados**.
3.  Escolha o modo (Teste ou Produção).
4.  Selecione o local do servidor (ex: `southamerica-east1` para o Brasil).
5.  Clique em **Ativar**.

### 3. Configurar Regras de Segurança (IMPORTANTE)

Se você receber o erro **"permission-denied"**, ajuste as Regras:

1.  No Console do Firebase, vá em **Firestore Database** > aba **Regras**.
2.  Use estas regras para permitir acesso total durante o desenvolvimento:

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

## 🔍 Solução de Problemas Comuns

### "The database (default) does not exist"
Isso significa que você ainda não clicou no botão "Criar banco de dados" dentro da seção Firestore no Console do Firebase, ou o projeto selecionado no console é diferente do `projectId` no seu código.
- Verifique se o `projectId` no cabeçalho do aplicativo (no navegador) corresponde ao ID do projeto no seu console.
- Certifique-se de que o Firestore está no **"Modo Nativo"** (Native Mode), e não no modo Datastore.

### "Produtos não aparecem no banco, mas aparecem na aba de pedidos"
Isso acontece se o estado do React está sendo atualizado localmente mas a gravação no banco está falhando.
- Verifique o Console do Desenvolvedor no navegador (F12) para ver mensagens de erro detalhadas.
- Verifique se as Regras de Segurança foram publicadas com sucesso.

### "Firestore: Operation was rejected"
Geralmente indica que os dados não seguem as Regras de Segurança ou que as regras ainda não foram propagadas (pode levar até 1 minuto).

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
