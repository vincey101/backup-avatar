'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  FolderIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  PlayIcon,
  ChatBubbleLeftIcon,
  GiftIcon,
  PlusIcon,
  WrenchIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Sidebar = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState('');

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState({
    user: {
      oto_2: 0,
      oto_3: 0,
      oto_4: 0,
      oto_5: 0,
      oto_6: 0,
      oto_7: 0,
      oto_8: 0
    }
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('projectsMenuOpen');
    if (savedState !== null) {
      setIsProjectsOpen(JSON.parse(savedState));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('projectsMenuOpen', JSON.stringify(isProjectsOpen));
    }
  }, [isProjectsOpen, isInitialized]);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    // Access localStorage after component mounts
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setIsAdmin(userData);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Replace all pathname checks with currentPath
  const isActive = (path: string) => window.location.pathname === path;

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const toggleDfy = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.clear();
    router.push('/login');
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://appclick.convertri.com/support', '_blank');
  };

  const handleBonusesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://docs.google.com/document/d/165BshNxYJXsLaE-amZSsiRBMDoSKWKsIaSeWt3AUnAs/edit?usp=sharing', '_blank');
  };

  // Update the handleNavigation function
  const handleNavigation = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userData = localStorage.getItem('userData');
    
    // Only redirect to tutorial if user is not logged in and trying to access a protected route
    if (!userData && path !== '/tutorial') {
      router.push('/tutorial');
      return;
    }
    
    // Update currentPath before navigation
    setPathname(path);
    router.push(path);
  };

  if (!isInitialized || !isClient) {
    return (
      <div className="fixed w-64 h-screen bg-gray-900 flex flex-col">
        <div className="flex items-center h-16 px-6 border-b border-gray-700 bg-gradient-to-b from-black to-gray-900">
          <Image
            src="/logo1.png"
            alt="HumanAI Logo"
            width={140}
            height={40}
            className="object-contain w-auto h-8"
            priority
          />
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="fixed w-64 lg:w-64 md:w-56 sm:w-48 h-screen bg-gray-900 flex flex-col">
      <div className="flex items-center h-16 lg:h-16 md:h-14 sm:h-12 px-6 border-b border-gray-700 bg-gradient-to-b from-black to-gray-900">
        <Image
          src="/logo1.png"
          alt="HumanAI Studio Logo"
          width={140}
          height={40}
          className="object-contain w-auto h-8 lg:h-8 md:h-7 sm:h-6"
          priority
        />
      </div>

      {/* Main navigation - with custom scrollbar */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-3 md:p-2 sm:p-2 space-y-1.5 custom-scrollbar">
        {/* <Link
          href="/"
          className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
            isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <HomeIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] mr-2.5 group-hover:text-white" />
          Dashboard
        </Link> */}



        {/* Projects dropdown */}
        <div>
          <Link
            href="/tutorial"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/tutorial', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
              isActive('/tutorial') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            } rounded-lg transition-colors group`}
          >
            <PlayIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Tutorial
          </Link>

          <button
            onClick={handleSupportClick}
            className={`flex items-center w-full px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/support') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
          >
            <ChatBubbleLeftIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Support
          </button>
          <button
            onClick={toggleProjects}
            className="flex items-center justify-between w-full px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <FolderIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
              Projects
            </div>
            {isProjectsOpen ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>
          {isProjectsOpen && (
            <div className="ml-4 mt-1.5 space-y-1.5">
              <Link
                href="/projects/create-avatar"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/projects/create-avatar', e)}
                className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
                  isActive('/projects/create-avatar') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } rounded-lg transition-colors group`}
              >
                <PlusIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />
                Interactive AI Human
              </Link>
              <Link
                href="/projects/manage"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/projects/manage', e)}
                className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
                  isActive('/projects/manage') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } rounded-lg transition-colors group`}
              >
                <WrenchIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />
                Manage
              </Link>
            </div>
          )}
        </div>
        {isAdmin.user.oto_2 === 1 ?

        <button
          onClick={toggleDfy}
          className="flex items-center justify-between w-full px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
        >
          <div className="flex items-center">
            <FolderIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            DFY
          </div>
          {isOpen ? (
            <ChevronUpIcon className="w-3.5 h-3.5" />
          ) : (
            <ChevronDownIcon className="w-3.5 h-3.5" />
          )}
        </button>

          : ''}
        {isOpen && (
          <div className="ml-4 mt-1.5 space-y-1.5">
            <Link
              href="https://store.myrevioapp.com/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
                isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
            >
              <PlusIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />
              DFY Marketplace
            </Link>
            <Link
              href="/dfy"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/dfy', e)}
              className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
                isActive('/dfy') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
            >
              <WrenchIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />
              DFY Offer
            </Link>
          </div>
        )}


        {isAdmin.user.oto_5 === 1 && (
          <Link
            href="/traffic"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/traffic', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
              isActive('/traffic') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            } rounded-lg transition-colors group`}
          >
            <ChartBarIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Limitless Traffic
          </Link>
        )}
        {isAdmin.user.oto_4 === 1 ?
          <Link
            href="/swift-profit"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/swift-profit', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/swift-profit') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
          >
            <BanknotesIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Swift Profit
          </Link>
          : ''}
        {isAdmin.user.oto_8 === 1 ?
          <Link
            href="/multiple-income"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/multiple-income', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/multiple-income') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
          >
            <BuildingOfficeIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Multiple Income
          </Link>
          : ''}
        {isAdmin.user.oto_6 === 1 ?
          <Link
            href="/agency"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/agency', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/agency') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
          >
            <BuildingOfficeIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Agency
          </Link>
          : ''}
        {isAdmin.user.oto_7 === 1 ?
          <Link
            href="/franchise"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/franchise', e)}
            className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/franchise') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } rounded-lg transition-colors group`}
          >
            <BuildingStorefrontIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
            Franchise
          </Link>
          : ''}


        <button
          onClick={handleBonusesClick}
          className={`flex items-center w-full px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/bonuses') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            } rounded-lg transition-colors group`}
        >
          <GiftIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
          Bonuses
        </button>

        <Link
          href="/upgrade"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/upgrade', e)}
          className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
            isActive('/upgrade') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <ArrowUpTrayIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
          Upgrade Plan
        </Link>

        <Link
          href="/settings"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation('/settings', e)}
          className={`flex items-center px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${
            isActive('/settings') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <Cog6ToothIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />&nbsp;
          Profile Settings
        </Link>
      </nav>

      {/* Logout button in a separate container at the bottom */}
      <div className="p-3 lg:p-3 md:p-2 sm:p-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-2 lg:text-[13px] md:text-[12px] sm:text-[11px] ${isActive('/login') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            } rounded-lg transition-colors group`}
        >
          <ArrowRightOnRectangleIcon className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] group-hover:text-white" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 