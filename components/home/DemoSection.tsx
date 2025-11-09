import { Pizza } from "lucide-react";
import React from "react";
import { MotionDiv, MotionH3 } from "@/components/common/motion-wrapper";
import SummaryViewer from "@/components/summaries/SummaryViewer";

const DEMO_SUMMARY = `# Quick Overview
- 🎯 Comprehensive Next.js 15 course covering everything from fundamentals to advanced deployment strategies
- 📚 Perfect for developers wanting to master modern React and Next.js development
- ⚡ Learn server-side rendering, static generation, and API routes

# Document Details
- 📄 Type: Educational Course Material
- 👥 For: Web Developers, Full-Stack Engineers, React Developers
- ⏱️ Duration: 8-week intensive program

# Key Highlights
- 🚀 Master the App Router and new Next.js 15 features
- 💫 Build production-ready applications with best practices
- 🌟 Learn server and client components architecture
- 🎨 Implement modern UI with Tailwind CSS and shadcn/ui

# Why It Matters
- 💡 Next.js is the leading React framework used by top companies worldwide
- 🔥 Understanding server components gives you a competitive edge in the job market
- 💪 Build faster, more SEO-friendly applications that scale

# Main Topics Covered
- 🎯 App Router and file-based routing system
- 💎 Server Components vs Client Components
- 🔄 Data fetching and caching strategies
- 🌐 API routes and server actions
- 📱 Responsive design and mobile optimization

# Pro Tips
- 💫 Always consider server components as your default choice
- 💎 Implement route groups for better code organization
- 🌟 Use loading.tsx and error.tsx for better UX
- 🎨 Leverage parallel routes for complex layouts

# Key Terms to Know
- 📚 Server Components: React components that render on the server for better performance
- 🔍 Route Groups: Next.js feature for organizing routes without affecting URL structure
- ⚡ Server Actions: Functions that run on the server and can be called from client components

# Final Thoughts
- 💫 This course transforms developers into Next.js experts, enabling them to build production-ready applications with confidence and efficiency
- 🚀 Perfect foundation for building modern web applications
- 🎓 Includes real-world projects and deployment strategies
`;

const DemoSection = () => {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 
        transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-1155/678 
          w-[36.125rem] -translate-x-1/2 bg-linear-to-br 
          from-emerald-500 via-teal-500 to-cyan-500 opacity-30 
          sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500" />
          </div>

          <div className="text-center mb-16">
            <MotionH3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6"
            >
              Watch how Summarist transform this{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                Next.js course PDF
              </span>
              into an easy-to-read summary!
            </MotionH3>
          </div>
        </div>

        <div className="flex justify-center items-center w-full">
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            <SummaryViewer summary={DEMO_SUMMARY} />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
