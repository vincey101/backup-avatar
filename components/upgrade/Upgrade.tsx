'use client';
import React, { useState, useEffect } from 'react';
import {
    Button,
} from '@mui/material';

export default function Upgrade() {
  // Initialize with a default state structure
  const [isUserData, setIsUserData] = useState({
    user: {
      oto_1: 0,
      oto_2: 0,
      oto_3: 0,
      oto_4: 0,
      oto_5: 0,
      oto_6: 0,
      oto_7: 0,
      oto_8: 0
    }
  });

  // Move localStorage access to useEffect
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        setIsUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);
  
 const handleOto_1Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/unlimited-access', '_blank');
  };
 
 const handleOto_2Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/dfy-access', '_blank');
  };
  
 const handleOto_3Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/automation-access', '_blank');
  };
  
 const handleOto_4Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/swiftprofit-access', '_blank');
  };
  
 const handleOto_5Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/limitlesstraffic-access', '_blank');
  };
  
 const handleOto_6Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(' https://grabhumanai.com/agency-access', '_blank');
  };
  
 const handleOto_7Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(' https://grabhumanai.com/franchise-access', '_blank');
  };
  
 const handleOto_8Click = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://grabhumanai.com/multiincome-access', '_blank');
  };
  
  return (
      
    <div className="w-full max-w-[1400px] mx-auto font-sans mt-8 px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upgrades</h1>

      <div className="space-y-8">
  
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
            { /* <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    S/N
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Title Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead> */}
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Entry 1 */}
                {isUserData.user.oto_1 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 1 (Unlimited) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                            onClick={handleOto_1Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                 
                </tr>
                 : ''}
                {/* Entry 2 */}
                 {isUserData.user.oto_2 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 2 (Done For You) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                     <Button
                                            variant="contained"
                                            onClick={handleOto_2Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                </tr>
                  : ''}
                {/* Entry 3 */}
                {isUserData.user.oto_3 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 3 (Automation) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                             onClick={handleOto_3Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                 
                </tr>
                    : ''}
                {/* Entry 4 */}
                {isUserData.user.oto_4 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 4 (Swift Profit) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                             onClick={handleOto_4Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                </tr>
                 : ''}
                {/* Entry 5 */}
                 {isUserData.user.oto_5 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 5 (Limitless Traffic) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                            onClick={handleOto_5Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                 
                </tr>
                :''}
                {/* Entry 6 */}
                 {isUserData.user.oto_6 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 6 (Agency) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                            onClick={handleOto_6Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                </tr>
                :''}
                {/* Entry 7 */}
                 {isUserData.user.oto_7 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 7 (Franchise) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                   <Button
                                            variant="contained"
                                             onClick={handleOto_7Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                 
                </tr>
                :''}
                {/* Entry 8 */}
                 {isUserData.user.oto_8 === 0 ? 
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OTO 8 (Multiple Income) -</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Button
                                            variant="contained"
                                            onClick={handleOto_8Click}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            CLICK HERE TO UPGRADE
                                        </Button>
                  </td>
                  
                </tr>
                :''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 