import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LogoImage from "../../public/logo.svg"
import { cn } from '@/lib/utils'
import localFont from 'next/font/local';


const headingFont=localFont({
  src:"../app/fonts/font.woff2"
})


export const Logo = () => {
  return (
    <Link href="/">
      <div className="items-center justify-center hover:opacity-75 transition gap-x-2 hidden md:flex">
        <Image
          src={LogoImage}
          alt="logo"
          width={30}
          height={30}
          className="-translate-y-0.5"
        />
        <p
          className={cn("text-2xl text-neutral-700 pb-1", headingFont.className)}
        >
          PrepGenie
        </p>
      </div>
    </Link>
  )
}
