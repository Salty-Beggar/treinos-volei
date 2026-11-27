 # Treinos de Vôlei - Sistema de Gestão de Treinamentos

 Sistema completo para gestão de treinos de vôlei, composto por uma API em **Laravel 12** (backend) e uma interface em **React 19 + Vite** (frontend).

 ---

 ## 📋 Pré-requisitos

 Antes de começar, certifique-se de ter instalado:

 | Ferramenta | Versão Mínima | Verificação |
 |------------|---------------|-------------|
 | **PHP** | 8.2+ | `php -v` |
 | **Composer** | 2.x | `composer -V` |
 | **Node.js** | 18+ | `node -v` |
 | **NPM** | 9+ | `npm -v` |
 | **SQLite** | 3.x | `sqlite3 --version` (já incluído no PHP) |

 ---

 ## 🚀 Instalação Rápida

 ### 1. Clone e acesse o projeto
 
 ### 2. Configure o Backend (API Laravel)
 ```bash
 cd api

 # Instale as dependências PHP
 composer install

 # Copie o arquivo de ambiente e gere a key
 copy .env.example .env
 php artisan key:generate

 # Crie o banco SQLite e rode as migrations
 php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
 php artisan migrate

 # (Opcional) Popule com dados de exemplo
 php artisan db:seed
 ```

 ### 3. Configure o Frontend (React + Vite)
 ```bash
 cd ..\web

 # Instale as dependências
 npm install
 ```

 ---

 ## ▶️ Como Executar

 Você precisará de **dois terminais** (um para o backend, outro para o frontend):

 ### Terminal 1 - Backend (API)
 ```bash
 php artisan serve
 ```
 A API estará disponível em: **http://localhost:8000**

 ### Terminal 2 - Frontend (React)
 ```bash
 npm run dev
 ```
 A aplicação web estará disponível em: **http://localhost:5173** (porta padrão do Vite)

 ---

 ## 🔧 Comandos Úteis

 ### Backend (pasta `api/`)
 | Comando | Descrição |
 |---------|-----------|
 | `php artisan serve` | Inicia o servidor de desenvolvimento |
 | `php artisan migrate` | Executa as migrations do banco |
 | `php artisan migrate:fresh --seed` | Reseta o banco e popula com seeds |
 | `php artisan test` | Roda os testes (PHPUnit) |
 | `php artisan queue:listen` | Processa jobs da fila |
 | `php artisan pail` | Visualiza logs em tempo real |
 | `composer run dev` | Inicia tudo junto (servidor + queue + logs + vite) |

 ### Frontend (pasta `web/`)
 | Comando | Descrição |
 |---------|-----------|
 | `npm run dev` | Inicia servidor de desenvolvimento com HMR |
 | `npm run build` | Gera build de produção em `dist/` |
 | `npm run preview` | Visualiza o build de produção localmente |
 | `npm run lint` | Executa ESLint no código |

 ---

 ## ⚙️ Configuração do Ambiente (.env)

 O arquivo `.env` na pasta `api/` contém as principais configurações:

 ```env
 APP_NAME="Treinos de Vôlei"
 APP_ENV=local
 APP_DEBUG=true
 APP_URL=http://localhost:8000

 # Banco de dados (SQLite por padrão)
 DB_CONNECTION=sqlite
 # Para MySQL/PostgreSQL, descomente e configure:
 # DB_CONNECTION=mysql
 # DB_HOST=127.0.0.1
 # DB_PORT=3306
 # DB_DATABASE=treinos_volei
 # DB_USERNAME=root
 # DB_PASSWORD=

 SESSION_DRIVER=database
 QUEUE_CONNECTION=database
 CACHE_STORE=database

 # Mail (log por padrão - não envia e-mails reais)
 MAIL_MAILER=log
 ```

 > **Dica:** Para trocar para MySQL/PostgreSQL, crie o banco antes e ajuste as variáveis `DB_*` no `.env`.

 ---

 ## 📁 Estrutura do Projeto

 ```
 treinos-volei/
 ├── api/                    # Backend Laravel
 │   ├── app/                # Models, Controllers, Services
 │   ├── config/             # Arquivos de configuração
 │   ├── database/           # Migrations, Seeders, Factories
 │   ├── routes/             # Rotas da API (api.php, web.php)
 │   ├── resources/views/    # Views Blade (se houver)
 │   ├── storage/            # Logs, cache, uploads
 │   ├── tests/              # Testes automatizados
 │   ├── .env.example        # Exemplo de variáveis de ambiente
 │   └── composer.json       # Dependências PHP
 │
 └── web/                    # Frontend React + Vite
     ├── public/             # Assets estáticos
     ├── src/                # Código fonte React
     │   ├── components/     # Componentes reutilizáveis
     │   ├── pages/          # Páginas da aplicação
     │   ├── services/       # Serviços (API, auth, etc)
     │   ├── hooks/          # Custom hooks
     │   └── utils/          # Utilitários
     ├── index.html
     ├── package.json
     └── vite.config.js
 ```

 ---

 ## 🌐 Endpoints Principais da API

 Base URL: `http://localhost:8000/api`

 | Método | Endpoint | Descrição |
 |--------|----------|-----------|
 | `GET` | `/treinos` | Lista todos os treinos |
 | `POST` | `/treinos` | Cria novo treino |
 | `GET` | `/treinos/{id}` | Detalha um treino |
 | `PUT` | `/treinos/{id}` | Atualiza um treino |
 | `DELETE` | `/treinos/{id}` | Remove um treino |
 | `GET` | `/jogadores` | Lista jogadores |
 | `POST` | `/jogadores` | Cadastra jogador |
 | `GET` | `/estatisticas` | Estatísticas gerais |

 > Consulte `api/routes/api.php` para a lista completa e atualizada.

 ---

 ## 🐛 Solução de Problemas Comuns

 ### Erro: "No application encryption key has been specified"
 ```bash
 cd api
 php artisan key:generate
 ```

 ### Erro de banco: "Database file not found" ou "SQLSTATE[HY000]"
 ```bash
 cd api
 php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
 php artisan migrate
 ```

 ### Erro de permissão no storage (Linux/Mac)
 ```bash
 cd api
 chmod -R 775 storage bootstrap/cache
 ```

 ### Frontend não conecta na API
 1. Verifique se o backend está rodando na porta 8000
 2. Confira `web/src/services/api.js` (ou similar) - a baseURL deve ser `http://localhost:8000/api`
 3. Verifique CORS em `api/config/cors.php`

 ### Porta já em uso
 ```bash
 # Backend - use outra porta
 php artisan serve --port=8001

 # Frontend - o Vite tenta a próxima porta automaticamente
 ```

 ---

 ## 📦 Deploy (Produção)

 ### Backend
 ```bash
 cd api
 composer install --optimize-autoloader --no-dev
 php artisan config:cache
 php artisan route:cache
 php artisan view:cache
 php artisan migrate --force
 ```
 Configure o servidor web (Nginx/Apache) para apontar para `api/public/`.

 ### Frontend
 ```bash
 cd web
 npm run build
 ```
 O conteúdo de `web/dist/` deve ser servido por um servidor estático (Nginx, Apache, Vercel, Netlify, etc).

 ---
 > **Projeto desenvolvido para gestão de treinos de vôlei** 🏐
