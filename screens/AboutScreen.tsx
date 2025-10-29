import React from 'react';
import { SparklesIcon, ShieldCheckIcon } from '../components/Icons';

const AboutScreen: React.FC = () => {
  return (
    <div className="animate-fade-in pb-16 md:pb-0 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">About Atlas</h1>
        <p className="text-lg text-text-secondary mt-2">
          Your guide to building a better self.
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed">
            Atlas was created to be a private, powerful resource for men navigating the complexities of modern life. We believe that true strength comes from self-awareness, emotional intelligence, and the courage to grow. Our mission is to provide men with the tools, knowledge, and support to build a fulfilling life on their own terms, covering everything from mental wellness and relationships to career and personal habits.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-4">How Atlas Works</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li><strong>Guides:</strong> Expert-informed articles to build your knowledge base.</li>
            <li><strong>Challenges:</strong> Actionable daily tasks to build positive habits and momentum.</li>
            <li><strong>Community:</strong> A safe, anonymous space to connect and share with other men.</li>
            <li><strong>AI Mentor:</strong> A 24/7 conversational guide for reflection and support.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-4">Privacy & Data Stewardship</h2>
          <p className="text-text-secondary leading-relaxed">
            Your reflections are yours. Mentor conversations and progress data are stored securely and used only to deliver smarter guidance inside Atlas. We do not sell your information. For full details on encryption, retention, and how to request deletion, review the <a href="#!" className="text-accent underline hover:text-accent-light">Privacy Notice</a>.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            By using Atlas you agree to the <a href="#!" className="text-accent underline hover:text-accent-light">Terms of Use</a> and <a href="#!" className="text-accent underline hover:text-accent-light">Community Guidelines</a>. These outline expectations around respectful conduct, confidentiality, and how we moderate content to keep the space supportive.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-4 flex items-center">
            <SparklesIcon className="w-7 h-7 mr-3 text-accent" />
            Our Approach to AI
          </h2>
          <p className="text-text-secondary leading-relaxed">
            The AI Mentor is a powerful tool designed to be a supportive guide. It's built on advanced AI technology and programmed with a persona focused on empathy, active listening, and providing actionable advice. It's here to help you explore your thoughts, practice new ways of thinking, and get non-judgmental feedback anytime you need it.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            However, it's crucial to remember that the AI Mentor is a tool for support, not a replacement for a human. It does not have consciousness, feelings, or life experience.
          </p>
        </section>

        <section className="bg-secondary border border-red-500/50 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-red-400 mb-4 flex items-center">
             <ShieldCheckIcon className="w-7 h-7 mr-3" />
            Important Disclaimer
          </h2>
          <p className="text-text-secondary leading-relaxed font-semibold">
            Atlas and its AI Mentor are not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            The information and guidance provided in this app are for informational and educational purposes only. Always seek the advice of your physician, psychiatrist, psychologist, or other qualified health provider with any questions you may have regarding a medical or mental health condition. Never disregard professional medical advice or delay in seeking it because of something you have read or discussed on this app.
          </p>
           <p className="text-text-secondary leading-relaxed mt-4 font-bold text-text-primary">
            If you are in crisis or you think you may have an emergency, call your doctor or 911 immediately. If you're having suicidal thoughts, call or text 988 in the US and Canada, or call 111 in the UK to connect with a trained crisis counselor.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutScreen;
