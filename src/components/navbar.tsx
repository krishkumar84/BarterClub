'use client'
import React from "react";
import Image from 'next/image';
import { Menu, X } from 'lucide-react'

const menuItems = [
  {
    name: 'Home',
    href: '#home',
  },
  {
    name: 'About',
    href: '#about',
  },
  {
    name: 'Features',
    href: '#faq',
  },
  {
    name: 'Marketplace',
    href: '/products',
  },
  {
    name: 'Pricing',
    href: '#pricing',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
]
import logo from '/public/logo.png'
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const user = useUser();
  const isAdmin = user.isLoaded && user.isSignedIn && user.user?.publicMetadata?.role === 'admin';

  console.log(isAdmin)



  return (
    <div className="relative w-full  ">
      <div className="mx-auto flex mb-3  max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <span>
            <Image src={logo} alt="logo" width={82} height={82} />
          </span>
        </div>
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-md font-normal text-slate-200 hover:text-slate-400"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          <SignedOut>
            <Link href="/signin">
              <button
                type="button"
                className="rounded-3xl  px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="rounded-3xl  px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Signup
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
          {isAdmin && <Link href="/admin">
          <button
           type="button"
           className="rounded-3xl mr-3 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Admin
              </button>
          </Link>}
          <Link href="/profile">
          <button
           type="button"
           className="rounded-3xl mr-6 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Dashboard
              </button>
          </Link>
          <Link href="/addProduct">
          <button
           type="button"
           className="rounded-3xl mr-6 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Add Post
              </button>
          </Link>
          </SignedIn>
          <SignedIn>
           <SignOutButton>
           <button
                type="button"
                className="rounded-3xl mr-6 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Logout
              </button>
         </SignOutButton>
         <UserButton />
         </SignedIn>
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 text-slate-200 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 h-screen origin-top-right transform transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 bg-[#38111f]  shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5 h-screen">
                <div className="flex items-center justify-between">
                  <div className="flex justify-center items-center space-x-2">
                    <span>
                      <Image src={logo} alt="logo" width={82} height={82} />
                    </span>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex bg-transparent items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold"
                        onClick={toggleMenu}
                      >
                        <span className="ml-3 text-base font-medium text-slate-300">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-row">
        <div className="flex flex-col">
          <SignedIn>
          {isAdmin && <Link href="/admin">
          <button
           type="button"
           className="rounded-3xl mt-2 pl-3 py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Admin
              </button>
          </Link>}
          <Link href="/profile">
          <button
           type="button"
           className="rounded-3xl pl-3 py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Dashboard
              </button>
          </Link>
          <Link href="/addProduct">
          <button
           type="button"
           className="rounded-3xl pl-3 py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Add Post
              </button>
          </Link>
          </SignedIn>
          <SignedIn>
           <SignOutButton>
           <button
                type="button"
                className="rounded-3xl  py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Logout
              </button>
         </SignOutButton>
         <div className="mt-2 ml-4">
         <UserButton />
         </div>
         </SignedIn>
        </div>
          <SignedOut>
            <div className="flex flex-col gap-2 mt-2">
            <Link href="/signin">
              <button
                type="button"
                className="rounded-3xl  px-6 py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={toggleMenu}
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="rounded-3xl  px-6 py-3 text-sm font-semibold text-slate-300 shadow-sm hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={toggleMenu}
              >
                Signup
              </button>
            </Link>
            </div>
          </SignedOut>
          <SignedIn>
         </SignedIn>
        </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

