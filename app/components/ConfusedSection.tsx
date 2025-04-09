"use client";

import React from 'react';

const CHATBOT_PLACEHOLDER =
    "https://via.placeholder.com/300x500?text=AI+Chatbot+Preview";

export default function ConfusedSection() {
    return (
        <section className="text-white py-8 px-4 mt-10 bg-white">
            <div className="max-w-screen-xl mx-auto bg-[#00229A] rounded-lg shadow-md p-6">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-5">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 pt-5">Confused?</h2>
                        <p className="mb-4 text-base md:text-lg leading-relaxed">
                            Not sure what you’re looking for? Our smart AI chatbot is here to
                            help! Simply start a chat, and it will guide you with personalized
                            recommendations tailored to your needs. Try it now!
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src={CHATBOT_PLACEHOLDER}
                            alt="AI Chatbot Placeholder"
                            className="rounded-md shadow-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
