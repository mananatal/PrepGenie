"use client"

import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { Loader2 } from 'lucide-react';

function InterviewList() {
  const [interviewList,setInterviewList]=useState([]);
  const [loading,setLoading]=useState(false);
  const {user}=useUser();

  const getUserInterviews=async ()=>{
   try {
     setLoading(true);
     const result=await db.select().from(mockInterview).where(eq(mockInterview.createdBy,user?.primaryEmailAddress.emailAddress)).orderBy(desc(mockInterview.id));
     setInterviewList(result);
   } catch (error) {
      console.error("Error while getting interview list: ",error);
   }finally{
      setLoading(false);
   }
  }

  useEffect(()=>{
    user && getUserInterviews();
  },[user])

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      {
        loading?
        (
          <div className='flex justify-center mt-12'>
            <Loader2 className='animate-spin h-12 w-12 opacity-40'/>
          </div>
        )
        :
        (
            interviewList.length==0?
            (
              <p className='my-2 text-sm'>You don&apos;t have any interview yet.</p>
            )
            :
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviewList&&interviewList.map((interview,index)=>(
                    <InterviewItemCard interview={interview} key={index}/>
                ))}
              </div>
            )
        )
      }
      
    </div>
  )
}

export default InterviewList