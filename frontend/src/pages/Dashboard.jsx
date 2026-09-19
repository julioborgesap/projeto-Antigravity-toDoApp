import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Circle, Clock, LayoutDashboard, LogOut, Plus, Search, Tag, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ total_tasks: 0, completed_today: 0, overdue_tasks: 0, pending_urgent: 0 });
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'media', category_id: '' });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [metricsRes, tasksRes, catRes] = await Promise.all([
        axios.get('http://localhost:8000/dashboard/', config),
        axios.get('http://localhost:8000/tasks/', config),
        axios.get('http://localhost:8000/tasks/categories', config)
      ]);
      
      setMetrics(metricsRes.data);
      setTasks(tasksRes.data);
      setCategories(catRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTaskStatus = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/tasks/${task.id}`, {
        ...task,
        is_completed: !task.is_completed,
        tags: task.tags.map(t => t.name)
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDashboardData();
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/tasks/', {
        ...newTask,
        category_id: newTask.category_id || null,
        due_date: new Date().toISOString() // Just for dummy data
      }, { headers: { Authorization: `Bearer ${token}` } });
      setShowForm(false);
      setNewTask({ title: '', description: '', priority: 'media', category_id: '' });
      fetchDashboardData();
    } catch (err) { console.error(err); }
  };

  const getPriorityColor = (p) => {
    if (p === 'urgente') return 'text-urgent bg-urgent/10 border-urgent/20';
    if (p === 'media') return 'text-medium bg-medium/10 border-medium/20';
    return 'text-low bg-low/10 border-low/20';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando painel...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-surface/50 border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 font-bold text-xl text-white">
            <CheckCircle2 className="text-primary w-6 h-6" />
            <span>To-Do Dash</span>
          </div>
        </div>
        
        <div className="px-4 py-2 flex-1">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" /> Painel Geral
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-white/5 hover:text-white transition-colors">
              <Calendar className="w-5 h-5" /> Hoje
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Categorias</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button key={cat.id} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-text-muted hover:text-urgent transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-surface/30">
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Olá, pronto para produzir? 🚀</h1>
              <p className="text-text-muted">Aqui está um resumo de como estão as coisas.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nova Tarefa
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Total de Tarefas</p>
                  <p className="text-2xl font-bold text-white">{metrics.total_tasks}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-5 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Concluídas</p>
                  <p className="text-2xl font-bold text-white">{metrics.completed_today}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-5 card-hover relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Atrasadas</p>
                  <p className="text-2xl font-bold text-white">{metrics.overdue_tasks}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-5 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Pendentes Urgentes</p>
                  <p className="text-2xl font-bold text-white">{metrics.pending_urgent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* New Task Form */}
          {showForm && (
            <div className="glass-panel p-6 animate-fade-in border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <h2 className="text-lg font-bold mb-4">Adicionar Nova Tarefa</h2>
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input type="text" placeholder="O que precisa ser feito?" className="input-field text-lg" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
                </div>
                <div>
                  <select className="input-field appearance-none" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="baixa">Prioridade Baixa</option>
                    <option value="media">Prioridade Média</option>
                    <option value="urgente">Urgente 🔥</option>
                  </select>
                </div>
                <div>
                  <select className="input-field appearance-none" value={newTask.category_id} onChange={e => setNewTask({...newTask, category_id: e.target.value})}>
                    <option value="">Sem Categoria</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-text-muted hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="btn-primary">Criar Tarefa</button>
                </div>
              </form>
            </div>
          )}

          {/* Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Suas Tarefas</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" placeholder="Buscar tarefas..." className="input-field pl-9 py-1.5 text-sm w-64 bg-surface/50" />
              </div>
            </div>
            
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-text-muted glass-panel">
                  Nenhuma tarefa encontrada. Comece criando uma!
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={clsx("glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300", task.is_completed ? 'opacity-60' : 'hover:border-white/20')}>
                    <div className="flex items-start gap-4 flex-1">
                      <button onClick={() => toggleTaskStatus(task)} className={clsx("mt-1 shrink-0 transition-colors", task.is_completed ? 'text-primary' : 'text-textMuted hover:text-white')}>
                        {task.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <h3 className={clsx("font-medium text-lg", task.is_completed ? 'text-textMuted line-through' : 'text-white')}>{task.title}</h3>
                        {task.description && <p className="text-sm text-textMuted mt-1">{task.description}</p>}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {task.category_id && categories.find(c => c.id === task.category_id) && (
                            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-textMuted flex items-center gap-1 border border-white/5">
                              <Tag className="w-3 h-3" /> {categories.find(c => c.id === task.category_id).name}
                            </span>
                          )}
                          <span className={clsx("text-xs px-2 py-1 rounded-md border flex items-center gap-1 font-medium capitalize", getPriorityColor(task.priority))}>
                            {task.priority === 'urgente' ? '🔥 ' : ''}{task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
