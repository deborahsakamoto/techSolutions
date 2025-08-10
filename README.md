# Tech Solutions - Controle de Equipamentos

Sistema para **cadastro, gerenciamento e histórico de ações** em equipamentos eletrônicos.  
Desenvolvido com **.NET 9 + SQLite** no back-end e **React + Material UI** no front-end.

---

## 📌 Funcionalidades
- Cadastro de equipamentos (nome, série, status, local, etc.).
- Alteração de status (Disponível, Em manutenção, Transferido, Descartado).
- Registro de ações no histórico do equipamento (com data, autor e observações).
- Edição e exclusão de equipamentos.
- Login de usuário.
- API documentada com **Swagger**.

---

## 🔗 Endpoints da API

### **Equipamentos**
| Método  | Endpoint                              | Descrição |
|---------|---------------------------------------|-----------|
| GET     | `/Equipments`                         | Lista todos os equipamentos. |
| GET     | `/Equipments/{id}`                    | Busca detalhes de um equipamento. |
| POST    | `/Equipments`                         | Cria um novo equipamento. |
| PATCH   | `/Equipments/{id}/status/{status}`    | Atualiza o status do equipamento. |
| DELETE  | `/Equipments/{id}`                    | Remove um equipamento. |

### **Histórico de Ações**
| Método  | Endpoint                              | Descrição |
|---------|---------------------------------------|-----------|
| GET     | `/Equipments/{id}/history`            | Lista ações realizadas no equipamento. |
| POST    | `/Equipments/{id}/action`             | Registra nova ação no histórico. |

### **Autenticação**
| Método  | Endpoint      | Descrição |
|---------|--------------|-----------|
| POST    | `/login`     | Autentica o usuário e retorna token (se configurado). |

---

## 🛠 Tecnologias Utilizadas
**Backend**
- .NET 9 (ASP.NET Core Web API)
- Entity Framework Core
- SQLite
- Swagger (Swashbuckle)

**Frontend**
- React
- TypeScript
- Material UI (MUI)
- Axios

---

## ▶️ Como Rodar o Projeto

### 1️⃣ Clonar o repositório
    ```bash
    git clone https://github.com/deborahsakamoto/techSolutions.git
    cd tech-solutions  
    
### 2️⃣ Configurar o backend
    cd backend
    dotnet restore
    dotnet ef database update
    dotnet run

### 3️⃣ Configurar o frontend
    cd frontend
    npm install
    npm run dev
