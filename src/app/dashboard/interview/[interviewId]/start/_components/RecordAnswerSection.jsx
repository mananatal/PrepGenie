"use client"

import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/hooks/use-toast';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/gemeniAiModel';
import { userAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic, StopCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React,{useState,useEffect} from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';

function RecordAnswerSection({activeQuestionIndex,interviewQuestions,interviewData,setAnsweredQuestion,setActiveQuestionIndex,answeredQuestion}){

    const [loading,setLoading]=useState(false);
    const [userRecordedAnswer,setUserRecordedAnswer]=useState("");
    const {user}=useUser();
    const { toast } = useToast();

    const {
        error,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });


    useEffect(()=>{
        results.map((result)=>setUserRecordedAnswer((prev)=>prev+result?.transcript))
    },[results])

    const StartStopRecording=()=>{
        if(isRecording){
            stopSpeechToText();
        }
        else{
            startSpeechToText();
        }
    }

    useEffect(()=>{
        if(userRecordedAnswer.length>10 && !isRecording){
            updateUserAnswer();
        }
    },[userRecordedAnswer])

    const updateUserAnswer=async ()=>{
        try {
            setLoading(true);
            const prompt=`question: ${interviewQuestions && interviewQuestions[activeQuestionIndex].question} ,userAnswer: ${userRecordedAnswer} ,Depends on question and answer for given interview question please give user rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in json format with rating field and feedback field`;
    
            const result=await chatSession.sendMessage(prompt);
            const resp=result.response.text().replace("```json", "").replace("```", "");
            const jsonFeedbackAndrRating=JSON.parse(resp);
    
            const insertedUserResponse=await db.insert(userAnswer).values({
                mockIdRef:interviewData.mockId,
                question:interviewQuestions[activeQuestionIndex]?.question,
                correctAns:interviewQuestions[activeQuestionIndex]?.answer,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                feedback:jsonFeedbackAndrRating.feedback,
                rating:jsonFeedbackAndrRating.rating,
                userAns:userRecordedAnswer,
                createdAt: moment().format("DD-MM-YYYY"),
            });
    
            if(insertedUserResponse){
                toast({
                    title:"User Answer Recorded Succesfully "
                });
                setUserRecordedAnswer("");
                setResults([]);
                setAnsweredQuestion(prev=>[...prev,activeQuestionIndex]);
                if(activeQuestionIndex!=interviewQuestions.length-1){
                    setActiveQuestionIndex(activeQuestionIndex+1);
                }
            }
            setResults([]);
    
        } catch (error) {
            console.error("Error while Saving User Recorded Answer: "+error);
        }finally{
            setLoading(false);
        }
    }

    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>; 

  return (
    <div className="border p-6 rounded-lg ">
        <div className="flex justify-cente items-center flex-col">
            <div className="flex flex-col my-6 justify-center items-center bg-black rounded-lg p-5">
                <Image
                src={"/webcam.png"}
                width={200}
                height={200}
                className="absolute"
                alt="webcam"
                priority
                />
                <Webcam
                style={{ height: 300, width: "100%", zIndex: 10 }}
                mirrored={true}
                />
            </div>

            {
                answeredQuestion.includes(activeQuestionIndex) ?
                (
                    <Button variant="ghost" className='font-semibold text-lg '>You have already answered this question.</Button>
                )
                :
                (
                    <Button
                        disabled={loading}
                        variant="outline"
                        className="my-10"
                        onClick={StartStopRecording}
                    >
                        {isRecording ? (
                            <h2 className="text-red-600 items-center animate-pulse flex gap-2">
                                <StopCircle /> Stop Recording...
                            </h2>
                            ) : (
                            <h2 className="text-primary flex gap-2 items-center">
                                <Mic /> Record Answer
                            </h2>
                        )}
                    </Button>
                )
            }
            
            
            </div>
    </div>
  )
}

export default RecordAnswerSection