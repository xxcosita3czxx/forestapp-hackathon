import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import './journey.css';

const journeyTasks = [
  {
    id: 1,
    title: 'Začátek',
    description: 'Vítej v aplikaci',
    completed: true,
    unlocked: true
  },
  {
    id: 2,
    title: 'Profil',
    description: 'Vyplň svůj profil',
    completed: false,
    unlocked: true
  },
  {
    id: 3,
    title: 'První příspěvek',
    description: 'Napiš svůj první příspěvek do fóra',
    completed: false,
    unlocked: false
  },
  {
    id: 4,
    title: 'Komunikace',
    description: 'Napiš někomu zprávu',
    completed: false,
    unlocked: false
  },
  {
    id: 5,
    title: 'Pomoc ostatním',
    description: 'Odpověz na příspěvek v fóru',
    completed: false, 
    unlocked: false
  }
];

const Journey = () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTheme = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        const theme = data.settings.theme;

        // Apply theme
        const gradients = {
          PINK: 'linear-gradient(45deg, #FF55E3, #F3C1EE)',
          BLUE: 'linear-gradient(45deg, #55B4FF, #C1E4EE)',
          GREEN: 'linear-gradient(45deg, #55FF7E, #C1EED3)',
          BLACK: 'linear-gradient(45deg, #333333, #666666)'
        };

        document.body.style.background = gradients[theme];

      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, [userId]);

  const [tasks, setTasks] = useState(journeyTasks);
  const navigate = useNavigate();

  const handleTaskClick = (task) => {
    if (!task.unlocked) return;
    
    // Handle navigation based on task
    switch(task.id) {
      case 1:
        // Already completed
        break;
      case 2:
        navigate('/profile');
        break;
      case 3:
        navigate('/forum');
        break;
      case 4:
        navigate('/chat');
        break;
      case 5:
        navigate('/forum');
        break;
      default:
        break;
    }
  };

  return (
    <div className="journey-page">
      <h1>Tvoje cesta</h1>
      <div className="journey-path">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-container">
            <div 
              className={`task-circle ${task.completed ? 'completed' : ''} ${task.unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleTaskClick(task)}
            >
              <span className="task-number">{task.id}</span>
            </div>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            {index < tasks.length - 1 && (
              <div className={`path-line ${tasks[index + 1].unlocked ? 'unlocked' : 'locked'}`} />
            )}
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default Journey;