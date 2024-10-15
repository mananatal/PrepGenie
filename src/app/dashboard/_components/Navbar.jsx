"use client"

import { Logo } from '@/components/Logo'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Navbar() {
    const path=usePathname();

  return (
    <div className="flex items-center justify-between px-32 py-4 bg-secondary">
        {/* logo */}
        <div>
            <Logo/>
        </div>

        {/* navigation menu */}
        <ul className="flex gap-6">
            <Link href={'/dashboard'}> 
            <li className={`hover:text-primary cursor-pointer hover:font-bold transition-all duration-200 ${path=='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
            </Link>
           
            <li className={`hover:text-primary cursor-pointer hover:font-bold transition-all duration-200 ${path=='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
            <li className={`hover:text-primary cursor-pointer hover:font-bold transition-all duration-200 ${path=='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
            <li className={`hover:text-primary cursor-pointer hover:font-bold transition-all duration-200 ${path=='/dashboard/how' && 'text-primary font-bold'}`}>How it Works?</li>
        </ul>

        {/* user button */}
        <UserButton/>
    </div>
  )
}

export default Navbar