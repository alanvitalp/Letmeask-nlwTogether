import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answer from '../assets/images/answer.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question/index'
import '../styles/room.scss'

import { RoomCode } from '../components/RoomCode'
import { useHistory, useParams } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();
  const { questions, title } = useRoom(roomId);
  // const { user } = useAuth();

  async function handleEndRoom () {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion (questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAnswered (questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightedQuestion (questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }
  
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask"/>
          <div className="">
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1> 
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>


        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                { !question.isAnswered && 
                  ( <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAnswered(question.id)}
                      >
                        <img src={checkImg} alt="marcar pergunta como respondida" />
                      </button>
          
                      <button
                        type="button"
                        onClick={() => handleHighlightedQuestion(question.id)}
                      >
                        <img src={answer} alt="dar destaque as perguntas" />
                      </button>
                    </>
                  )
                }
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="delete button" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
