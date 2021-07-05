import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import { Button } from '../components/Button/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

type AdminRoomParams = {
  id: string;
}

export const AdminRoom = () => {
  // const { user } = useAuth()
  const history = useHistory();
  const params = useParams<AdminRoomParams>()
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)  

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length > 1 ? 'perguntas' : 'pergunta'}</span>}
        </div>

        <div className="questionList">
          {questions.map(question => (
            <Question key={question.id} content={question.content} author={question.author}>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="remover pergunta" />
              </button>
            </Question>
          ))}
        </div>

      </main>
    </div>
  )
}
