# TechSolutions
# TechSolutions – Sistema de Gestão de Equipamentos

Repositório contendo:
- **Backend**: API desenvolvida em **C#/.NET 9** com **SQLite** e **Entity Framework Core**.
- **Frontend**: Aplicação React (a ser implementada).

O objetivo é gerenciar equipamentos eletrônicos, seu status e histórico de ações, com autenticação simples de usuários.  
O código segue padrões em **inglês** para variáveis, classes e métodos, mas as mensagens de retorno para o usuário (em especial na API de login e cadastro) estão em **português**.

---

## 📂 Estrutura do projeto

TECHSOLUTIONS.API/
├─ backend/ # API .NET 9
│ ├─ Controllers/
│ ├─ Data/
│ ├─ DTOs/
│ ├─ Models/
│ ├─ Properties/
│ ├─ appsettings.json
│ └─ Program.cs
└─ frontend/ # React (a ser desenvolvido)


---

## 🚀 Backend – .NET 9 + EF Core + SQLite

- **Banco de Dados**: SQLite (`techsolutions.db`)
- **ORM**: Entity Framework Core
- **Documentação**: Swagger UI ativado
- **Seed de Dados**:
  - Usuário admin (`admin@test.com` / `123`)
  - Equipamentos de exemplo com histórico

### ▶️ Como rodar localmente

1. Abra o terminal na pasta backend/
2. Execute:
bash
dotnet restore
dotnet tool update --global dotnet-ef

dotnet ef migrations add InitialCreate
dotnet ef database update

dotnet run


### 🛜 Acesse no navegador:
http://localhost:5112/swagger

### 🔑 Endpoints principais
Login – POST /api/User/login
{
  "email": "admin@test.com",
  "password": "123"
}

Resposta esperada:
{
  "mensagem": "Login realizado com sucesso.",
  "id": 1,
  "nome": "Admin",
  "email": "admin@test.com"
}

Cadastro – POST /api/User/register
{
  "name": "João da Silva",
  "email": "joao@test.com",
  "password": "123"
}

Obter por ID – GET /api/User/{id}

GET /api/Equipment – Lista todos

GET /api/Equipment/{id} – Detalhes + histórico

POST /api/Equipment – Cria novo equipamento

PUT /api/Equipment/{id} – Atualiza

DELETE /api/Equipment/{id} – Remove

POST /api/Equipment/{id}/actions – Registra ação no histórico

GET /api/Equipment/{id}/history – Lista ações

PATCH /api/Equipment/{id}/status/{status} – Altera status
Status possíveis: 0=Available, 1=InMaintenance, 2=Transferred, 3=Discarded

📌 Observações
A API não possui autenticação JWT, apenas login simples para teste.

