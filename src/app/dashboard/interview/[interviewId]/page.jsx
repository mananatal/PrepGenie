"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React,{ useState ,useEffect} from 'react'
import Webcam from 'react-webcam';




function InterviewPage({params}) {
    const [interviewData,setInterviewData]=useState();
    const [webcamEnabled,setWebcamEnabled]=useState(false);

    const getInterviewData=async ()=>{
        const result=await db.select().from(mockInterview).where(eq(mockInterview.mockId,params.interviewId));
        setInterviewData(result[0]);
    };

    useEffect(()=>{
        getInterviewData();
    },[])
    
  
    // http://localhost:3000/dashboard/interview/5ec629ad-fbd9-435b-8840-239fde6e71f1

  return (
    <div className="my-10 ">
        <h2 className="font-bold text-2xl">Lets get started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col p-5  rounded-lg border gap-5">
            <h2 className="text-lg">
                <strong>Job Role/Job Position: </strong>
                {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
                <strong>Job Description/tech Stack: </strong>
                {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
                <strong>Years of Experience: </strong>
                {interviewData?.jobExperience}
            </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
                <Lightbulb />
                <span>Information</span>
            </h2>
            <h2 className="mt-3 text-yellow-500">
                {process.env.NEXT_PUBLIC_INTERVIEW_DESCRIPTION}
            </h2>
            </div>
        </div>
        <div>
            {webcamEnabled ? (
            <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={(e) => {console.log(e); setWebcamEnabled(false)}}
                mirrored={true  }
                style={{ height: 300, width: 300 }}
            />
            ) : (
            <>
                <WebcamIcon className="h-72 my-7 border rounded-lg w-full p-20 bg-secondary" />
                <Button
                className="w-full"
                variant="ghost"
                onClick={() => setWebcamEnabled(true)}
                >
                Enable Web Cam and Microphone
                </Button>
            </>
            )}
        </div>
        </div>
        <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button>Start Interview</Button>
        </Link>
        </div>
  </div>
  )
}

export default InterviewPage