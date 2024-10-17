
import { Lightbulb, Volume2 } from 'lucide-react'
import React,{useEffect} from 'react'


function QuestionSection({activeQuestionIndex,interviewQuestions,setActiveQuestionIndex,visitedQuestions,setVisitedQuestions,answeredQuestion}) {

    function speak(text) {
        if('speechSynthesis' in window){
            // Create a SpeechSynthesisUtterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Select a voice
            const voices = speechSynthesis.getVoices();
            utterance.voice = voices[0]; // Choose a specific voice
            
            // Speak the text
            speechSynthesis.speak(utterance);

        }
    }

    const onVisitQuestion=(index)=>{
        setActiveQuestionIndex(index);
        setVisitedQuestions((prev)=>[...prev,index]);
    }
      
   
  return (
    <div className="border p-6 rounded-lg ">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                interviewQuestions && interviewQuestions.map((question, index) => (
                    <h1 
                        key={index} 
                        className={`text-xs md:text-sm border rounded-md bg-secondary cursor-pointer text-center p-2
                        ${index === activeQuestionIndex ? '!bg-blue-700 text-white' : ''}
                        ${answeredQuestion.includes(index) && index !== activeQuestionIndex ? '!bg-green-700 text-white' : ''}
                        ${visitedQuestions.includes(index) && !answeredQuestion.includes(index) && index !== activeQuestionIndex ? '!bg-purple-950 text-white' : ''}
                        `}
                        onClick={() => onVisitQuestion(index)}
                    >
                        Question #{index + 1}
                    </h1>
                ))
            }
        </div>

        <p className="mt-6 md:text-lg">
            {
                interviewQuestions && interviewQuestions[activeQuestionIndex].question
            }
        </p>

        <Volume2 className="mt-2 cursor-pointer" 
            onClick={()=>speak(interviewQuestions && interviewQuestions[activeQuestionIndex].question)} 
        />

        <div className='my-4'>
            <div className='flex items-center space-x-4'>
                <div className='h-4 w-4 rounded-full bg-green-700'></div>
                <p>Answered Question</p>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='h-4 w-4 rounded-full bg-purple-900'></div>
                <p>Visited Question</p>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='h-4 w-4 rounded-full bg-secondary border'></div>
                <p>Unanswered Question</p>
            </div>
        </div>

        <div className="bg-blue-100 text-blue-800 rounded-lg p-4 mt-8">
            <strong className="flex gap-2 items-center font-semibold">
                <Lightbulb  />
                <span >Note:</span>
            </strong>
            <h2 className="mt-1 ">
                {process.env.NEXT_PUBLIC_INTERVIEW_NOTE}
            </h2>
        </div>

    </div>
  )
}

export default QuestionSection