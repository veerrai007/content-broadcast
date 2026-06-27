'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Video, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn && user) {
      if (user.role === 'teacher') router.push('/teacher/dashboard');
      else if (user.role === 'principal') router.push('/principal/dashboard');
      else router.push('/dashboard');
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading || isLoggedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Video size={24} className="animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight">Content Broadcast</span>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-md mb-8"
        >
          <Sparkles size={16} className="text-primary" />
          <span>The next generation of learning distribution</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
        >
          Transform Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Educational Content
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
        >
          A unified platform for teachers and principals to broadcast live classes, share resources, and monitor student engagement seamlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <button className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95">
              <span>Get Started</span>
              <UserPlus size={18} className="transition-transform group-hover:rotate-12" />
            </button>
          </Link>
          
          <Link href="/login" className="w-full sm:w-auto">
            <button className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-input bg-background/50 px-8 py-4 text-sm font-semibold backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95">
              <span>Log In</span>
              <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
        
        {/* Decorative elements */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 w-full max-w-4xl rounded-2xl border border-border bg-card/40 p-4 shadow-2xl backdrop-blur-sm"
        >
          <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center border border-border/50">
            <div className="flex flex-col items-center gap-4 text-muted-foreground/50">
              <Video size={64} />
              <p className="font-medium">Live Broadcast Preview</p>
            </div>
          </div>
        </motion.div> */}
      </main>
    </div>
  );
}
