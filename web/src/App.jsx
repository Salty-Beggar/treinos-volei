import { useState, useEffect } from 'react'
import './App.css'
import './index.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('player')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [treinos, setTreinos] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('@TreinoVolei:token')
    if (token) {
      setIsAuthenticated(true)
    }

    const storedTreinos = localStorage.getItem('@TreinoVolei:treinos_db')
    if (!storedTreinos) {
      const treinosIniciais = [
        { id: 1, user_id: 1, nome: "Passe na parede (Estabilidade)", tempo: 15, series: 3, intervalo: 45, repeticoes: 20, video: 1 },
        { id: 2, user_id: 1, nome: "Aquece Recepção de Antebraço", tempo: 20, series: 4, intervalo: 60, repeticoes: 15, video: 2 },
        { id: 3, user_id: 2, nome: "Levantamento de Precisão (Cesta)", tempo: 25, series: 3, intervalo: 30, repeticoes: 25, video: 3 },
        { id: 4, user_id: 2, nome: "Ataque Direcionado com Alvo", tempo: 18, series: 4, intervalo: 45, repeticoes: 10, video: 4 },
        { id: 5, user_id: 1, nome: "Bloqueio Reativo na Rede", tempo: 22, series: 4, intervalo: 40, repeticoes: 12, video: 5 }
      ]
      localStorage.setItem('@TreinoVolei:treinos_db', JSON.stringify(treinosIniciais))
      setTreinos(treinosIniciais)
    } else {
      setTreinos(JSON.parse(storedTreinos))
    }
  }, [])

  const toggleMode = (isLoginMode) => {
    setIsLogin(isLoginMode)
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    
    const validUser = usersDB.find(
      (user) => user.email.trim().toLowerCase() === email.trim().toLowerCase() && user.password === password
    )

    if (validUser) {
      const generatedToken = `mock-token-${validUser.id}-${Date.now()}`
      localStorage.setItem('@TreinoVolei:token', generatedToken)
      localStorage.setItem('@TreinoVolei:user', JSON.stringify(validUser))
      setIsAuthenticated(true)
    } else {
      alert('E-mail ou senha incorretos!')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []

    const emailExists = usersDB.some((user) => user.email.trim().toLowerCase() === email.trim().toLowerCase())
    if (emailExists) {
      alert('Este e-mail já está cadastrado!')
      return
    }

    const newUser = {
      id: Date.now(),
      name,
      email: email.trim(),
      password,
      type: userType
    }

    usersDB.push(newUser)
    localStorage.setItem('@TreinoVolei:users_db', JSON.stringify(usersDB))

    const generatedToken = `mock-token-${newUser.id}-${Date.now()}`
    localStorage.setItem('@TreinoVolei:token', generatedToken)
    localStorage.setItem('@TreinoVolei:user', JSON.stringify(newUser))
    
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('@TreinoVolei:token')
    localStorage.removeItem('@TreinoVolei:user')
    setIsAuthenticated(false)
    setName('')
    setEmail('')
    setPassword('')
  }

  const getCreatorName = (userId) => {
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    const creator = usersDB.find(u => u.id === userId)
    if (creator) return creator.name
    return "Coach / Sistema"
  }

  /* ================== DASHBOARD (ÁREA AUTENTICADA) ================== */
  if (isAuthenticated) {
    const currentUser = JSON.parse(localStorage.getItem('@TreinoVolei:user')) || { name: 'Atleta', type: 'player' }
    const typeLabel = currentUser.type === 'player' ? 'Jogador' : 'Coach'

    return (
      <div className="min-h-screen bg-dark text-white p-6 font-sans">
        {/* Cabeçalho da Dashboard (Aumentado para max-w-6xl para alinhar com a grid) */}
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-darker p-5 rounded-2xl border border-gray-800 mb-8">
          <div>
            <h1 className="text-xl font-bold">Fala, {currentUser.name}! 🏐</h1>
            <span className="inline-block bg-gray-800 text-neon text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 uppercase tracking-wider">
              {typeLabel}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600/20 text-red-400 border border-red-600/30 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white transition"
          >
            Sair
          </button>
        </div>

        {/* Listagem de Treinos em Cards (Layout ajustado para max-w-6xl e grid de 3 colunas) */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-200">Treinos Disponíveis</h2>
            <span className="text-xs text-gray-400">{treinos.length} treinos cadastrados</span>
          </div>

          {/* Grid alterada para lg:grid-cols-3 (máximo de 3 por linha) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {treinos.map((treino) => (
              <div 
                key={treino.id} 
                className="bg-darker border border-gray-800 rounded-2xl p-5 hover:border-neon/50 transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white leading-snug">{treino.nome}</h3>
                    <span className="text-xs bg-dark px-2 py-1 rounded text-neon border border-gray-800 whitespace-nowrap ml-2">
                      ⏱️ {treino.tempo} min
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Criado por: <span className="text-gray-300 font-medium">{getCreatorName(treino.user_id)}</span>
                  </p>
                </div>

                <div className="bg-dark/60 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs border border-gray-800/60 mb-4">
                  <div>
                    <span className="block text-gray-400">Séries</span>
                    <strong className="text-white text-sm">{treino.series}x</strong>
                  </div>
                  <div>
                    <span className="block text-gray-400">Repetições</span>
                    <strong className="text-white text-sm">{treino.repeticoes}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-400">Intervalo</span>
                    <strong className="text-white text-sm">{treino.intervalo}s</strong>
                  </div>
                </div>

                <button className="w-full bg-neon text-dark font-bold py-2.5 rounded-xl text-sm hover:bg-[#bce600] transition">
                  Iniciar Treino
                </button>
              </div>
            ))}
          </div>
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
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
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
                autoComplete="new-password"
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
          <form onSubmit={handleRegister} className="space-y-4">
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="new-password"
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