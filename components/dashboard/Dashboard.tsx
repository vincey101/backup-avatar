'use client';

export default function Dashboard() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Welcome to HumanAI Studio
                </h1>

                <div className="space-y-6 text-gray-700">
                    <p className="text-lg leading-relaxed">
                        Welcome to your interactive AI platform where technology meets human-like interaction.
                        Our platform enables you to create and manage AI avatars that can engage in natural,
                        dynamic conversations.
                    </p>

                    <div className="grid gap-6 mt-8">
                        <div className="border-l-4 border-indigo-500 pl-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Interactive AI Avatars
                            </h3>
                            <p>
                                Create customized AI avatars that can understand context, respond naturally,
                                and engage in meaningful conversations with your audience.
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Natural Conversations
                            </h3>
                            <p>
                                Our AI avatars use advanced language processing to maintain context-aware,
                                fluid conversations that feel natural and engaging.
                            </p>
                        </div>

                        <div className="border-l-4 border-pink-500 pl-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Multiple Use Cases
                            </h3>
                            <p>
                                Perfect for customer service, educational content, presentations,
                                and any scenario where you need engaging, interactive AI communication.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 