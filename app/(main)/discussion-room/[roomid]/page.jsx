"use client"
import React, { useEffect, useRef, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { CoachingExpert } from '@/services/Options';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import {Button} from '@/components/ui/button'
import dynamic from 'next/dynamic';
const RecordRTC = dynamic(()=> import("recordrtc"), {ssr:false});


function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDicussionRoom, { id: roomid })
    const [expert, setExpert] = useState();
    const [enableMic,setEnableMic] = useState(false);
    let recorder = useRef(null)
    console.log(DiscussionRoomData);
    let silenceTimeout;

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = CoachingExpert.find(item => item.name == DiscussionRoomData.expertName);
            console.log(Expert)
            setExpert(Expert)
        }
    }, [DiscussionRoomData])

    const connectToServer = () => {
        setEnableMic(true);
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    // Ensure RecordRTC is properly imported
                    import("recordrtc").then(({ default: RecordRTC }) => {
                        recorder.current = new RecordRTC(stream, {
                            type: 'audio',
                            mimeType: 'audio/webm;codecs=pcm',
                            recorderType: RecordRTC.StereoAudioRecorder,
                            timeSlice: 250,
                            desiredSampRate: 16000,
                            numberOfAudioChannels: 1,
                            bufferSize: 4096,
                            audioBitsPerSecond: 128000,
                            ondataavailable: async (blob) => {
                                clearTimeout(silenceTimeout);
                                const buffer = await blob.arrayBuffer();
                                console.log(buffer);
                                silenceTimeout = setTimeout(() => {
                                    console.log('User stopped talking');
                                }, 2000);
                            }
                        });
                        recorder.current.startRecording();
                    });
                })
                .catch((err) => console.log("Error accessing mic:", err));
        }
    };
    
    const disconnect = () => {
        if (recorder.current) {
            recorder.current.pauseRecording();
            recorder.current = null;
        }
        setEnableMic(false);
    };
    
    return (
        <div className='-mt-12'>
            <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
            <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-3'>


                    <div className='lg:col-span-3 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative'>
                        <Image
                            src={expert?.avatar || "/default-avatar.png"}
                            alt="Avatar"
                            width={200}
                            height={200}
                            className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
                        />

                        <h2 className='text-gray-500'> {expert?.name}</h2>
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10 '>
                            <UserButton />
                        </div>
                    </div>
                    <div>
                    <div className='mt-5 flex items-center justify-center'>
                        {!enableMic ?<Button onClick={connectToServer}>Connect</Button>
                        :
                        <Button variant="destructive" onClick={disconnect}>Disconnect</Button>}
                    </div>
                </div>
                <div className=' h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative'>
                    <h2>Chat Section</h2>
                </div>
                <h2 className='mt-4 text-gray-400 text-sm'>At the end of your conversation we will automatically generate feedback/notes from your conversation</h2>
                </div>
            </div>
        </div>

    )
}

export default DiscussionRoom
