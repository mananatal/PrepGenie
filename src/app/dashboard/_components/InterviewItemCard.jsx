import { Button } from '@/components/ui/button'
import { toast, useToast } from '@/hooks/use-toast';
import { db } from '@/utils/db';
import { mockInterview, userAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function InterviewItemCard({interview,onInterviewCardDelete}) {
  const [loading,setLoading]=useState(false);
  const {toast}=useToast();
  const router=useRouter();
  const onFeedbackPress=()=>{
    router.push('dashboard/interview/'+interview.mockId+"/feedback")
  }

  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mockId)
  }
  
  const onDelete=async()=>{
    try {
        setLoading(true);

        onInterviewCardDelete(interview.mockId);

        const deletedInterviewFeedback=await db.delete(userAnswer).where(eq(userAnswer.mockIdRef,interview.mockId)).returning({id:mockInterview.mockId});
        const deletedInterview=await db.delete(mockInterview).where(eq(mockInterview.mockId,interview.mockId)).returning({id:userAnswer.mockIdRef});

        if(!deletedInterview || !deletedInterviewFeedback){
          console.error("OOPS! Could not delete");
        }

        toast({
          title:"Interview Deleted Successfully",
        })

    } catch (error) {
      console.error("Error while deleting interview: ",error);
      toast({
        title:"OOPS! Action can't be completed",
        variant:"destructive"
      })
    }finally{
        setLoading(false);
    }
  }

  return (
    <div className="border shadow-sm rounded-sm p-3">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-500">{interview?.jobExperience}</h2>
      <h2 className="text-xs text-gray-400">
        Created At: {interview?.createdAt}
      </h2>
      <div className="flex justify-between gap-5 mt-2">
        <Button size="sm" variant="outline" className="w-full" onClick={onFeedbackPress} >
          Feedback
        </Button>
        <Button className="w-full" size="sm" onClick={onStart}>Start</Button>
        <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                   <Trash2/>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    Interview Record and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} disabled={loading}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default InterviewItemCard