
import { Lightbulb, Volume2 } from 'lucide-react'
import React,{useEffect} from 'react'


function QuestionSection({activeQuestionIndex,interviewQuestions,setActiveQuestionIndex}) {

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
      
   
  return (
    <div className="border p-6 rounded-lg ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                interviewQuestions && interviewQuestions.map((question,index)=>(
                    <h1 key={index} className={`text-xs md:text-sm border rounded-md bg-secondary cursor-pointer text-center p-2 ${index===activeQuestionIndex && 'bg-blue-700 text-white'}`}
                        onClick={()=>setActiveQuestionIndex(index)}
                    >
                        Question #{index+1}
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

        <div className="bg-blue-100 text-blue-800 rounded-lg p-4 mt-20">
            <h2>
                <strong > <Lightbulb/>Note: </strong>
                {process.env.NEXT_PUBLIC_INTERVIEW_NOTE}
            </h2>
        </div>
    </div>
  )
}

export default QuestionSection