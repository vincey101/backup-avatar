'use client';

import { Box, Grid, Card, CardContent, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function Reseller() {
    const [value, setValue] = useState('1')
    
    return (
        <div className="w-full max-w-[1400px] mx-auto font-sans">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    CONGRATULATIONS, YOU HAVE GOT THE RESELLER LICENSE.
                </h1>

                {/* Add new video section */}
                <div className="mb-8">
                    <div className="aspect-video max-w-3xl mx-auto">
                        <iframe
                            className="w-full h-full rounded-lg shadow-lg"
                            src="https://www.youtube.com/embed/JVtYqt2NQeE"
                            title="Reseller License Tutorial"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="mb-8 mt-4">
                        <h2 className="mt-4 text-xl text-gray-700">
                            Kindly Follow The Steps To Get Your Link.
                        </h2>
                    </div>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={1} md={1} lg={1} className="w3-hide-small"> </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Box sx={{ width: '100%' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList
                                            variant="fullWidth"
                                            centered
                                            onChange={(event: SyntheticEvent, newValue: string) => setValue(newValue)}
                                            aria-label="Reseller Steps"
                                        >
                                            {['Step 1', 'Step 2', 'Step 3', 'Step 4'].map((step, index) => (
                                                <Tab 
                                                    key={index + 1}
                                                    sx={{
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        textTransform: 'none'
                                                    }}
                                                    value={(index + 1).toString()}
                                                    label={step}
                                                />
                                            ))}
                                        </TabList>
                                    </Box>

                                    {/* Step 1 */}
                                    <TabPanel value="1">
                                        <Card className="bg-white rounded-lg shadow-sm" elevation={0}>
                                            <CardContent className="p-6">
                                                <img
                                                    src="https://myaitalkie.com/img/users/reseller-7ca33e91.jpg"
                                                    alt="Create Warriorplus Account"
                                                    className="max-w-[450px] h-auto mx-auto mb-6"
                                                />
                                                <a
                                                    href="https://warriorplus.com/user/new"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
                                                >
                                                    Click Here To Create Your Warriorplus Account
                                                </a>
                                            </CardContent>
                                        </Card>
                                    </TabPanel>

                                    {/* Step 2 */}
                                    <TabPanel value="2">
                                        <Card className="bg-white rounded-lg shadow-sm" elevation={0}>
                                            <CardContent className="p-6">
                                                <img
                                                    src="https://myaitalkie.com/img/users/reseller1-b3375310.jpg"
                                                    alt="Request Link"
                                                    className="max-w-[400px] h-auto mx-auto mb-6"
                                                />
                                                <a
                                                    href=" https://warriorplus.com/as/o/rg04jk"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
                                                >
                                                    Click Here To Request For Your Human AI Link
                                                </a>
                                            </CardContent>
                                        </Card>
                                    </TabPanel>

                                    {/* Step 3 */}
                                    <TabPanel value="3">
                                        <Card className="bg-white rounded-lg shadow-sm" elevation={0}>
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold mb-4">
                                                    Enter The Message Below In The "Request Note" Box.
                                                </h3>
                                                <p className="text-red-600 mb-4">
                                                    &gt;&gt; I purchased Ink AI Reseller Plan With This Email Address
                                                    <br />
                                                    ("Specify Your Email"). Pls Approve My Request & Set to 80% Commission.
                                                </p>
                                                <img
                                                    src="https://myaitalkie.com/img/users/reseller2-de618784.jpg"
                                                    alt="Request Note"
                                                    className="max-w-[400px] h-auto mx-auto mb-4"
                                                />
                                                <p className="text-red-800">
                                                    Note - Your Request Will Be Approved Within 24 - 72 Hours
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </TabPanel>

                                    {/* Step 4 */}
                                    <TabPanel value="4">
                                        <Card className="bg-white rounded-lg shadow-sm" elevation={0}>
                                            <CardContent className="p-6 space-y-4">
                                                <div>
                                                    <p className="mb-2">
                                                        Email Swipe, Bonuses and all the resources you need are inside the JV Doc -
                                                    </p>
                                                    <a
                                                        href="https://cutt.ly/humanai-doc"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        Click Here
                                                    </a>
                                                </div>

                                                <p>
                                                    Viola! Start Selling Using Your Link & Bank 80% Commission Across All Funnels
                                                </p>

                                                <a
                                                    href=" https://warriorplus.com/as/o/rg04jk"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
                                                >
                                                    Click Here To Copy Your Link & Start Selling
                                                </a>

                                                <div>
                                                    <h6 className="font-semibold">
                                                        Need Help?{' '}
                                                        <a
                                                            href="https://appclick.convertri.com/support "
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Click Here To Contact Support
                                                        </a>
                                                    </h6>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
}