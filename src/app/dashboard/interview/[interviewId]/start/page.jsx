"use client"
import React ,{useState,useEffect} from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { mockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { json } from 'drizzle-orm/mysql-core';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function InterviewStartPage({params}) {

  const [interviewData,setInterviewData]=useState();
  const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
  const [interviewQuestions,setInterviewQuestions]=useState();

  const [visitedQuestions,setVisitedQuestions]=useState([0]);
  const [answeredQuestion,setAnsweredQuestion]=useState([]);

  const getInterviewData=async ()=>{
    const result=await db.select().from(mockInterview).where(eq(mockInterview.mockId,params.interviewId));
    setInterviewData(result[0]);

    const jsonRes=JSON.parse(result[0].jsonMockResp);
    setInterviewQuestions(jsonRes);
  };

  useEffect(() => {
    getInterviewData();
  }, []);

  
  const onNextPress=()=>{
    setVisitedQuestions(prev=>[...prev,activeQuestionIndex]);
    setActiveQuestionIndex(activeQuestionIndex+1);
  }

  const onPrevPress=()=>{
    setVisitedQuestions(prev=>[...prev,activeQuestionIndex]);
    setActiveQuestionIndex(activeQuestionIndex-1);
  }



  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* questions section */}
          <QuestionSection
            activeQuestionIndex={activeQuestionIndex}
            interviewQuestions={interviewQuestions}
            setActiveQuestionIndex={setActiveQuestionIndex}
            setVisitedQuestions={setVisitedQuestions}
            visitedQuestions={visitedQuestions}
            answeredQuestion={answeredQuestion}
          />
          {/* record answer section */}
          <RecordAnswerSection
            activeQuestionIndex={activeQuestionIndex}
            interviewQuestions={interviewQuestions}
            interviewData={interviewData}
            setAnsweredQuestion={setAnsweredQuestion}
            answeredQuestion={answeredQuestion}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
      </div>

      <div className="flex gap-4 my-6 justify-end">
        {activeQuestionIndex!==0 && <Button onClick={onPrevPress} >Previous</Button>}
        {interviewQuestions &&  activeQuestionIndex!== interviewQuestions.length-1 &&  <Button onClick={onNextPress} >Next</Button>}
        {interviewQuestions && activeQuestionIndex===interviewQuestions.length-1 && 
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
            <Button>End Interview</Button>
          </Link>     
        }
          
      </div>
    </div>
  )
}

export default InterviewStartPage