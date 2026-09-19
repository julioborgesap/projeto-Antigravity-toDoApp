import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // OAuth2 Password form data format
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        
        const response = await axios.post('http://localhost:8000/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        localStorage.setItem('token', response.data.access_token);
        navigate('/dashboard');
      } else {
        await axios.post('http://localhost:8000/auth/register', {
          username, email, password
        });
        // Auto login after register
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        const response = await axios.post('http://localhost:8000/auth/login', params);
        localStorage.setItem('token', response.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Um erro ocorreu. Tente novamente.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-300 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center">
            <CheckCircle2 className="text-white w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
        </h1>
        <p className="text-text-muted text-center mb-8">
          {isLogin ? 'Acesse seu painel para organizar seu dia.' : 'Junte-se a nós e seja mais produtivo.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Nome de usuário</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="seu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Senha</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-6 py-3">
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-textMuted">
          {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary hover:text-primaryHover font-medium transition-colors"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}
