import { useState, useEffect } from 'react'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('player') // 'player' ou 'coach'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Estados para os campos dos formulários
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Verifica se já existe um token ativo ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('@TreinoVolei:token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Alterna entre Login e Cadastro limpando os inputs
  const toggleMode = (isLoginMode) => {
    setIsLogin(isLoginMode)
    setName('')
    setEmail('')
    setPassword('')
  }

  // Login validando contra os usuários cadastrados no localStorage
  const handleLogin = (e) => {
    e.preventDefault()

    // Busca a lista de usuários cadastrados (ou array vazio se não houver nenhum)
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    
    // Procura um usuário com o mesmo e-mail e senha
    const validUser = usersDB.find(
      (user) => user.email === email && user.password === password
    )

    if (validUser) {
      const generatedToken = `mock-token-${validUser.id}-${Date.now()}`
      
      localStorage.setItem('@TreinoVolei:token', generatedToken)
      localStorage.setItem('@TreinoVolei:user', JSON.stringify(validUser))
      setIsAuthenticated(true)
    } else {
      alert('E-mail ou senha incorretos! Se ainda não tem conta, clique em Cadastre-se.')
    }
  }

  // Cadastro salvando o novo usuário no "banco" do localStorage
  const handleRegister = (e) => {
    e.preventDefault()

    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []

    // Impede cadastrar o mesmo e-mail duas vezes
    const emailExists = usersDB.some((user) => user.email === email)
    if (emailExists) {
      alert('Este e-mail já está cadastrado! Tente fazer login.')
      return
    }

    // Cria o objeto do novo usuário
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      type: userType
    }

    // Adiciona na lista e salva de volta no localStorage
    usersDB.push(newUser)
    localStorage.setItem('@TreinoVolei:users_db', JSON.stringify(usersDB))

    // Já faz o login automático após cadastrar
    const generatedToken = `mock-token-${newUser.id}-${Date.now()}`
    localStorage.setItem('@TreinoVolei:token', generatedToken)
    localStorage.setItem('@TreinoVolei:user', JSON.stringify(newUser))
    
    setIsAuthenticated(true)
  }

  // Logout (remove apenas a sessão atual, mantendo os usuários cadastrados no banco)
  const handleLogout = () => {
    localStorage.removeItem('@TreinoVolei:token')
    localStorage.removeItem('@TreinoVolei:user')
    setIsAuthenticated(false)
    setName('')
    setEmail('')
    setPassword('')
  }

  /* ================== TELA PROTEGIDA (DASHBOARD) ================== */
  if (isAuthenticated) {
    const currentUser = JSON.parse(localStorage.getItem('@TreinoVolei:user')) || { name: 'Atleta', type: 'player' }
    const typeLabel = currentUser.type === 'player' ? 'Jogador' : 'Coach'

    return (
      <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-darker p-8 rounded-2xl shadow-lg border border-gray-800 text-center">
          <div className="w-16 h-16 bg-neon text-dark rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-3xl">
            V
          </div>
          <h1 className="text-2xl font-bold mb-1">Fala, {currentUser.name}!</h1>
          <span className="inline-block bg-gray-800 text-neon text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Perfil: {typeLabel}
          </span>
          
          <p className="text-gray-400 mb-6 text-sm">
            Sessão ativa para <strong className="text-white">{currentUser.email}</strong>.
          </p>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white font-bold rounded-lg p-3 hover:bg-red-700 transition"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    )
  }

  /* ================== TELA DE AUTENTICAÇÃO (PÚBLICA) ================== */
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-darker p-8 rounded-2xl shadow-lg border border-gray-800">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neon text-dark rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-3xl">
            V
          </div>
          <h1 className="text-2xl font-bold">
            {isLogin ? 'Bem-vindo de volta' : 'Crie a sua conta'}
          </h1>
        </div>

        {isLogin ? (
          /* --- FORMULÁRIO DE LOGIN --- */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full bg-neon text-dark font-bold rounded-lg p-3 mt-2 hover:bg-[#bce600] transition">
              Entrar
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Ainda não tem conta?{' '}
                <button type="button" onClick={() => toggleMode(false)} className="text-neon hover:underline font-semibold">
                  Cadastre-se
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* --- FORMULÁRIO DE CADASTRO --- */
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Seletor Jogador / Coach */}
            <div className="flex bg-dark p-1 rounded-lg border border-gray-700 mb-4">
              <button
                type="button"
                onClick={() => setUserType('player')}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                  userType === 'player' ? 'bg-neon text-dark' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sou Jogador
              </button>
              <button
                type="button"
                onClick={() => setUserType('coach')}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                  userType === 'coach' ? 'bg-neon text-dark' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sou Coach
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
                placeholder="Ex: Rafael Nunes"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="w-full bg-neon text-dark font-bold rounded-lg p-3 mt-2 hover:bg-[#bce600] transition">
              Criar Conta
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Já tem conta?{' '}
                <button type="button" onClick={() => toggleMode(true)} className="text-neon hover:underline font-semibold">
                  Faça Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default App