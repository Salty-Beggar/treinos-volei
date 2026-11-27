import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function BallMark({ small = false }) {
  return (
    <span className={small ? 'brand-mark brand-mark--small' : 'brand-mark'} aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M24 4c-2 8 1 13 7 17 5 3 10 4 13 4M9 12c7 2 12 7 15 12M24 44c-1-9 3-14 10-18M4 24c7-1 13 1 20 7M44 23c-7 1-12 5-14 13M15 39c5-8 12-10 20-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function Icon({ name }) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    repeat: <><path d="M17 2l3 3-3 3" /><path d="M20 5H9a6 6 0 00-6 6v1M7 22l-3-3 3-3" /><path d="M4 19h11a6 6 0 006-6v-1" /></>,
    series: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
    timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6M12 2v3" /></>,
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function createDemoTreinos(userId) {
  return [
    { id: `demo-${userId}-1`, user_id: userId, nome: 'Manchete na parede', tempo: 15, series: 3, intervalo: 45, repeticoes: 20, categoria: 'Fundamentos' },
    { id: `demo-${userId}-2`, user_id: userId, nome: 'Toque e controle de bola', tempo: 18, series: 4, intervalo: 40, repeticoes: 15, categoria: 'Levantamento' },
    { id: `demo-${userId}-3`, user_id: userId, nome: 'Saque flutuante por zonas', tempo: 25, series: 4, intervalo: 60, repeticoes: 10, categoria: 'Saque' },
    { id: `demo-${userId}-4`, user_id: userId, nome: 'Aproximação e ataque', tempo: 22, series: 3, intervalo: 50, repeticoes: 12, categoria: 'Ataque' },
    { id: `demo-${userId}-5`, user_id: userId, nome: 'Deslocamento para bloqueio', tempo: 20, series: 4, intervalo: 45, repeticoes: 8, categoria: 'Bloqueio' },
    { id: `demo-${userId}-6`, user_id: userId, nome: 'Defesa em mergulho', tempo: 16, series: 3, intervalo: 60, repeticoes: 10, categoria: 'Defesa' },
  ]
}

function getDemoTreinos(userId) {
  const storageKey = `@TreinoVolei:treinos_demo:${userId}`
  const storedTreinos = localStorage.getItem(storageKey)
  if (storedTreinos) return JSON.parse(storedTreinos)

  const demoTreinos = createDemoTreinos(userId)
  localStorage.setItem(storageKey, JSON.stringify(demoTreinos))
  return demoTreinos
}

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('player')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('@TreinoVolei:token'))
  )
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('@TreinoVolei:user')) || { id: null, name: 'Atleta', type: 'player' }
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [treinos, setTreinos] = useState([])
  const [selectedTreino, setSelectedTreino] = useState(null)
  const [treinosLoading, setTreinosLoading] = useState(true)
  const [treinosError, setTreinosError] = useState('')
  const [treinosNotice, setTreinosNotice] = useState('')
  const [isAddTreinoOpen, setIsAddTreinoOpen] = useState(false)
  const [newTreino, setNewTreino] = useState({
    nome: '', categoria: 'Fundamentos', tempo: 20, series: 3, repeticoes: 10, intervalo: 60, descricao: '', video: ''
  })

  useEffect(() => {
    let isActive = true
    if (!isAuthenticated) {
      return () => {
        isActive = false
      }
    }

    const loadTreinos = async () => {
      if (!currentUser.id) {
        setTreinos(getDemoTreinos('demo'))
        setTreinosNotice('Exibindo treinos fictícios de demonstração, salvos apenas neste navegador.')
        setTreinosLoading(false)
        return
      }

      try {
        const response = await axios.get('http://localhost:8000/api/treinos', {
          params: { user_id: currentUser.id },
        })
        const apiTreinos = Array.isArray(response.data)
          ? response.data
          : response.data?.data || []

        if (isActive) {
          const visibleTreinos = apiTreinos.filter(
            (treino) => String(treino.user_id) === String(currentUser.id)
          )
          if (visibleTreinos.length > 0) {
            setTreinos(visibleTreinos)
            setTreinosNotice('')
          } else {
            setTreinos(getDemoTreinos(currentUser.id))
            setTreinosNotice('Exibindo treinos fictícios de demonstração, salvos apenas neste navegador.')
          }
          setTreinosError('')
        }
      } catch {
        if (isActive) {
          setTreinos(getDemoTreinos(currentUser.id))
          setTreinosError('Não foi possível conectar à API. Exibindo os treinos locais.')
          setTreinosNotice('')
        }
      } finally {
        if (isActive) setTreinosLoading(false)
      }
    }

    loadTreinos()
    return () => {
      isActive = false
    }
  }, [isAuthenticated, currentUser.id])

  const toggleMode = (isLoginMode) => {
    setIsLogin(isLoginMode)
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    const validUser = usersDB.find((user) =>
      user.email.trim().toLowerCase() === email.trim().toLowerCase() && user.password === password
    )
    if (validUser) {
      localStorage.setItem('@TreinoVolei:token', `mock-token-${validUser.id}-${Date.now()}`)
      localStorage.setItem('@TreinoVolei:user', JSON.stringify(validUser))
      setCurrentUser(validUser)
      setTreinos(getDemoTreinos(validUser.id))
      setIsAuthenticated(true)
    } else {
      alert('E-mail ou senha incorretos!')
    }
  }

  const handleRegister = (event) => {
    event.preventDefault()
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    if (usersDB.some((user) => user.email.trim().toLowerCase() === email.trim().toLowerCase())) {
      alert('Este e-mail já está cadastrado!')
      return
    }
    const newUser = { id: Date.now(), name, email: email.trim(), password, type: userType }
    usersDB.push(newUser)
    localStorage.setItem('@TreinoVolei:users_db', JSON.stringify(usersDB))
    localStorage.setItem('@TreinoVolei:token', `mock-token-${newUser.id}-${Date.now()}`)
    localStorage.setItem('@TreinoVolei:user', JSON.stringify(newUser))
    setCurrentUser(newUser)
    setTreinos(getDemoTreinos(newUser.id))
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('@TreinoVolei:token')
    localStorage.removeItem('@TreinoVolei:user')
    setSelectedTreino(null)
    setCurrentUser({ id: null, name: 'Atleta', type: 'player' })
    setIsAuthenticated(false)
    setName('')
    setEmail('')
    setPassword('')
  }

  const getCreatorName = (userId) => {
    const usersDB = JSON.parse(localStorage.getItem('@TreinoVolei:users_db')) || []
    return usersDB.find((user) => user.id === userId)?.name || 'Central de Treinos'
  }

const handleAddTreino = (event) => {
  event.preventDefault();

  const userId = currentUser?.id || 'demo';

  const treinoAdicionado = {
    id: `local-${Date.now()}`,
    user_id: userId,
    nome: newTreino.nome.trim(),
    categoria: newTreino.categoria,
    tempo: Number(newTreino.tempo),
    series: Number(newTreino.series),
    repeticoes: Number(newTreino.repeticoes),
    intervalo: Number(newTreino.intervalo),
    descricao: newTreino.descricao.trim(),
    video: newTreino.video.trim(),
  };

  setTreinos((prevTreinos) => {
    const nextTreinos = [treinoAdicionado, ...prevTreinos];
    const storageKey = `@TreinoVolei:treinos_demo:${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(nextTreinos));
    return nextTreinos;
  });

  setTreinosError('');
  setIsAddTreinoOpen(false);
  setNewTreino({
    nome: '',
    categoria: 'Fundamentos',
    tempo: 20,
    series: 3,
    repeticoes: 10,
    intervalo: 60,
    descricao: '',
    video: '',
  });

  setTreinosNotice('Treino adicionado com sucesso!');
  setTimeout(() => {
    setTreinosNotice('');
  }, 3000);
};

  if (isAuthenticated) {
    const typeLabel = currentUser.type === 'player' ? 'Atleta' : 'Coach'
    return (
      <main className="dashboard-shell">
        <header className="topbar">
          <a className="brand" href="#" aria-label="Volei Training">
            <BallMark small /><span>VOLEI<span>TRAINING</span></span>
          </a>
          <div className="topbar-actions">
            <div className="profile">
              <span className="profile-avatar">{currentUser.name.charAt(0).toUpperCase()}</span>
              <span className="profile-copy"><strong>{currentUser.name}</strong><small>{typeLabel}</small></span>
            </div>
            <button type="button" className="logout-button" onClick={handleLogout} aria-label="Sair">
              <span>Sair</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></svg>
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          {selectedTreino ? (
            <section className="workout-detail-view" aria-labelledby="workout-detail-title">
              <button type="button" className="workout-back-button" onClick={() => setSelectedTreino(null)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M10 17l-5-5 5-5" /></svg>
                Voltar para os treinos
              </button>
              <article className="workout-detail-card">
                <div className="workout-detail-heading">
                  <span className="category">{selectedTreino.categoria || 'Treino'}</span>
                  <h1 id="workout-detail-title">{selectedTreino.nome}</h1>
                  <p>Preparado por {selectedTreino.creator?.name || getCreatorName(selectedTreino.user_id)}</p>
                  {selectedTreino.descricao && <p className="workout-detail-description">{selectedTreino.descricao}</p>}
                </div>
                <div className="training-stats workout-detail-stats">
                  <div><Icon name="clock" /><span>Duração<strong>{selectedTreino.tempo} min</strong></span></div>
                  <div><Icon name="series" /><span>Séries<strong>{selectedTreino.series}x</strong></span></div>
                  <div><Icon name="repeat" /><span>Repetições<strong>{selectedTreino.repeticoes}</strong></span></div>
                  <div><Icon name="timer" /><span>Intervalo<strong>{selectedTreino.intervalo}s</strong></span></div>
                </div>
                {typeof selectedTreino.video === 'string' && /^https?:\/\//.test(selectedTreino.video) && (
                  <a className="workout-video-link" href={selectedTreino.video} target="_blank" rel="noreferrer">Assistir vídeo do treino</a>
                )}
              </article>
            </section>
          ) : (
            <>
              <div className="welcome-row">
                <div><p className="eyebrow">Seu plano de hoje</p><h1>Olá, {currentUser.name.split(' ')[0]}.</h1><p>Escolha um treino e continue evoluindo.</p></div>
                <button type="button" className="add-training-button" onClick={() => setIsAddTreinoOpen(true)}>
                  <span>Adicionar treino</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div className="progress-card"><div className="progress-ring"><span>3</span></div><div><strong>Meta semanal</strong><small>3 de 5 treinos</small></div></div>
              </div>
              <div className="section-heading"><h2>Treinos disponíveis</h2><span>{treinos.length} exercícios</span></div>
              {treinosError && <div className="list-message list-message--warning" role="status">{treinosError}</div>}
              {treinosNotice && <div className="list-message list-message--info" role="status">{treinosNotice}</div>}
              {treinosLoading ? (
                <div className="list-message" role="status">Carregando treinos...</div>
              ) : treinos.length === 0 ? (
                <div className="list-message" role="status">Nenhum treino disponível no momento.</div>
              ) : (
                <div className="training-grid">
                  {treinos.map((treino, index) => (
                    <article className="training-card" key={treino.id}>
                      <div className="card-top"><span className="card-number">{String(index + 1).padStart(2, '0')}</span><span className="category">{treino.categoria || 'Treino'}</span></div>
                      <h3>{treino.nome}</h3>
                      <p>Criado por {treino.creator?.name || getCreatorName(treino.user_id)}</p>
                      <div className="training-stats">
                        <div><Icon name="clock" /><span>Duração<strong>{treino.tempo} min</strong></span></div>
                        <div><Icon name="series" /><span>Séries<strong>{treino.series}x</strong></span></div>
                        <div><Icon name="repeat" /><span>Repetições<strong>{treino.repeticoes}</strong></span></div>
                        <div><Icon name="timer" /><span>Intervalo<strong>{treino.intervalo}s</strong></span></div>
                      </div>
                      <button type="button" className="start-button" onClick={() => setSelectedTreino(treino)}><span>Iniciar treino</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {isAddTreinoOpen && (
          <div className="training-modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsAddTreinoOpen(false)
          }}>
            <section className="training-modal" role="dialog" aria-modal="true" aria-labelledby="add-training-title">
              <div className="training-modal-header">
                <div><p>Novo treino</p><h2 id="add-training-title">Adicionar treino</h2></div>
                <button type="button" className="modal-close-button" onClick={() => setIsAddTreinoOpen(false)} aria-label="Fechar">
                  <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2"><path d="M2 2l12 12M14 2L2 14" /></svg>
                </button>
              </div>
              <form className="training-form" onSubmit={handleAddTreino}>
                <label className="training-form-wide"><span>Nome do treino</span><input value={newTreino.nome} onChange={(event) => setNewTreino({ ...newTreino, nome: event.target.value })} placeholder="Ex.: Aquecimento e saque" required /></label>
                <label className="training-form-wide"><span>Categoria</span><select value={newTreino.categoria} onChange={(event) => setNewTreino({ ...newTreino, categoria: event.target.value })}><option>Fundamentos</option><option>Levantamento</option><option>Saque</option><option>Ataque</option><option>Bloqueio</option><option>Defesa</option></select></label>
                <label><span>Duração (min)</span><input type="number" min="1" value={newTreino.tempo} onChange={(event) => setNewTreino({ ...newTreino, tempo: event.target.value })} required /></label>
                <label><span>Séries</span><input type="number" min="1" value={newTreino.series} onChange={(event) => setNewTreino({ ...newTreino, series: event.target.value })} required /></label>
                <label><span>Repetições</span><input type="number" min="1" value={newTreino.repeticoes} onChange={(event) => setNewTreino({ ...newTreino, repeticoes: event.target.value })} required /></label>
                <label><span>Intervalo (s)</span><input type="number" min="0" value={newTreino.intervalo} onChange={(event) => setNewTreino({ ...newTreino, intervalo: event.target.value })} required /></label>
                <label className="training-form-wide"><span>Descrição</span><textarea value={newTreino.descricao} onChange={(event) => setNewTreino({ ...newTreino, descricao: event.target.value })} placeholder="Descreva os objetivos ou orientações do treino" rows="3" /></label>
                <div className="training-form-actions training-form-wide"><button type="button" className="modal-cancel-button" onClick={() => setIsAddTreinoOpen(false)}>Cancelar</button><button type="submit" className="modal-save-button">Adicionar treino</button></div>
              </form>
            </section>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <div className="brand-panel-grid" />
        <a className="brand brand--light" href="#" aria-label="Volei Training"><BallMark /><span>VOLEI<span>TRAINING</span></span></a>
        <div className="brand-copy"><p>Treine com propósito</p><h1>Consistência que vence partidas.</h1><span>Planeje seus treinos, acompanhe sua evolução e esteja pronto para o próximo ponto.</span></div>
        <div className="court-lines" aria-hidden="true"><span className="court-line court-line--one" /><span className="court-line court-line--two" /><span className="court-net" /></div>
      </section>
      <section className="auth-form-panel">
        <div className="mobile-brand"><BallMark small /><span>VOLEI<span>TRAINING</span></span></div>
        <div className="auth-card">
          <div className="auth-heading"><p>{isLogin ? 'Área do atleta' : 'Comece agora'}</p><h2>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2></div>
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoComplete="email" required /></label>
              <label><span>Senha</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required /></label>
              <button type="submit" className="primary-button"><span>Entrar</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></button>
              <p className="auth-switch">Ainda não tem conta? <button type="button" onClick={() => toggleMode(false)}>Cadastre-se</button></p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="role-toggle" aria-label="Tipo de conta"><button type="button" className={userType === 'player' ? 'active' : ''} onClick={() => setUserType('player')}>Sou atleta</button><button type="button" className={userType === 'coach' ? 'active' : ''} onClick={() => setUserType('coach')}>Sou coach</button></div>
              <label><span>Nome completo</span><input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Como devemos chamar você?" autoComplete="name" required /></label>
              <label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoComplete="email" required /></label>
              <label><span>Senha</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete="new-password" minLength={6} required /></label>
              <button type="submit" className="primary-button"><span>Criar conta</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></button>
              <p className="auth-switch">Já tem conta? <button type="button" onClick={() => toggleMode(true)}>Faça login</button></p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
