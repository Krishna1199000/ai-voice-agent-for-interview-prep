"use client"

import { useUser } from '@stackframe/stack'
import { useMutation } from 'convex/react';
import React, { useState, useEffect } from 'react'
import { UserContext } from './_context/UserContext';
import { api } from '../convex/_generated/api';

function AuthProvider({ children }) {

    const user = useUser();
    const CreateUser= useMutation(api.users.CreateUser);
    const [userData,setUserData]=useState();
    useEffect(()=>{
        console.log(user)
        user && CreateNewUser()
    },[user])

    const CreateNewUser=async()=>{
        const result= await CreateUser({
            name:user?.displayName,
            email:user.primaryEmail
        });
        console.log(result);
        setUserData(result);
    }
  return (
    <div>
        <UserContext.Provider value={{userData,setUserData}}>{children}</UserContext.Provider>
      
    </div>
  )
}

export default AuthProvider
