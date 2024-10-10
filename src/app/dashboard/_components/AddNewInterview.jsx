"use client"

import React ,{useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { chatSession } from '@/utils/gemeniAiModel'
import { db } from '@/utils/db'
import { v4 as uuidv4 } from 'uuid';
import { mockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [loading,setLoading]=useState(false);
    const [openDialog,setOpenDialog]=useState(false);
    const [jobPosition,setJobPosition]=useState("");
    const [jobDesc,setJobDesc]=useState("");
    const [jobExperience,setJobExperience]=useState(0);
    const [jsonResponse,setJsonResponse]=useState([]);

    const router=useRouter();

    const {user}= useUser();


    const onFormSubmit=async (e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const prompt=`Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on Job Position, Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview question along with Answer in JSON format, Give us question and Answer field on JSON,Each question and answer should be in the format:
            {
                "question": "Your question here",
                "answer": "Your answer here"
            }`;
            const result=await chatSession.sendMessage(prompt);
            const jsonRes=(result?.response?.text()).replace('```json','').replace('```','');
            if(!jsonRes){
                throw new Error("No json response found")
            }
            setJsonResponse(jsonRes);

            const res=await db.insert(mockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: jsonRes,
                jobPosition: jobPosition,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY'),
            }).returning({mockId:mockInterview.mockId});

            if(res){
                router.push(`/dashboard/interview/${res[0].mockId}`)
            }


        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false);
        }
    }

  return (
    <div>
        <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
            onClick={()=>setOpenDialog(true)}
        >
            <h1 className="font-bold text-lg text-center">+ Add New</h1>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tell us more about your job Interviewing</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={onFormSubmit}>
                            <div>
                                Add details about your job position/role, job description, and
                                years of experience
                            </div>
                            <div className=" my-3">
                                <label className="text-gray-900 ">
                                    Job Role/Job Position
                                    <Input
                                        type="text"
                                        placeholder="Ex. Backend Developer"
                                        required
                                        onChange={(e)=>setJobPosition(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="my-3">
                                <label className="text-gray-900 ">
                                    Job Description/Tech Stack (In short)
                                    <Textarea
                                        placeholder="Ex. React, Angular, NodeJs, MySql etc"
                                        required
                                        onChange={(e)=>setJobDesc(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="my-3">
                                <label className="text-gray-900 ">
                                    Years of Experience
                                    <Input
                                        placeholder="Ex. 3"
                                        type="number"
                                        min="0"
                                        max="70"
                                        required
                                        onChange={(e)=>setJobExperience(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="flex gap-5 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                    <LoaderCircle className="animate-spin" /> Generating from AI
                                    </>
                                ) : (
                                    'Start Interview'
                                )}
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
    
  )
}

export default AddNewInterview