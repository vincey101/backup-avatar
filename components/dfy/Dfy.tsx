'use client';


import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface OfferCardProps {
    title: string;
    imageUrl: string;
    linkUrl: string;
}

const OfferCard: FC<OfferCardProps> = ({ title, imageUrl, linkUrl }) => (
    <section className="offer-card p-4 border rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="image-container mb-4">
            <img 
                src={imageUrl} 
                alt={title} 
                className="mx-auto w-[120px] h-[120px] object-contain"
            />
        </div>
        <Link href={linkUrl} target="_blank" className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Affiliate Link
        </Link>
    </section>
);

const DfyInstructions: FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-6">
        <div className="hidden lg:block lg:col-span-1"></div>
        <div className="col-span-10">
            <div className="content mt-3">
                <div className="animated fadeIn">
                    <h5 className="text-red-600 mb-4">INSTRUCTIONS</h5>
                    <ol className="text-red-600 list-decimal list-inside">
                        <li>Click on "Affiliate Link" below to get your affiliate link</li>
                        <li>Send an email to "hello@appclicksupportdesk.com" to get bumped to 80% across the funnel</li>
                        <li>Paste your Affiliate Link into your Marketplace Banner URL Section in "Monetize" or at the footer of your eBook</li>
                    </ol>
                    <br />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <OfferCard title="Dzign" imageUrl="https://mybrainboxapp.com/images/dzign.jpg" linkUrl="https://warriorplus.com/as/o/qgycy0" />
                        <OfferCard title="Edge" imageUrl="https://mybrainboxapp.com/images/edge.jpg" linkUrl="https://warriorplus.com/as/o/m2h56f" />
                        <OfferCard title="Swirl" imageUrl="https://mybrainboxapp.com/images/swirl.png" linkUrl="https://warriorplus.com/as/o/bg260c" />
                        <OfferCard title="vAI" imageUrl="https://mybrainboxapp.com/images/vai.jpg" linkUrl="https://warriorplus.com/as/o/nw2jl0" />
                        <OfferCard title="AI Genius" imageUrl="https://mybrainboxapp.com/images/ai-gen.jpg" linkUrl="https://warriorplus.com/as/o/n6csmf" />
                        <OfferCard title="Vox AI" imageUrl="https://mybrainboxapp.com/images/vox-ai.jpg" linkUrl="https://warriorplus.com/as/o/j8jxhv" />
                        <OfferCard title="Proto" imageUrl="https://api.humanaiapp.com/public/images/proto.png" linkUrl="https://warriorplus.com/as/o/zyqgrm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DfyInstructions;
