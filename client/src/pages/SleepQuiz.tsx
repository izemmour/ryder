/**
 * Sleep Quiz Funnel Page
 * 
 * Multi-step quiz to diagnose sleep issues and route users to the right product page.
 * Features: gamified UI, visual aids, email gate, profile scoring algorithm.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, ChevronLeft, Mail, Loader2, CheckCircle2, AlertTriangle, Moon, Bed, Clock, ThermometerSun, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Question types
type QuestionType = 'single' | 'multiple' | 'scale' | 'image-select';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  subtitle?: string;
  icon?: React.ReactNode;
  options: {
    id: string;
    label: string;
    image?: string;
    icon?: React.ReactNode;
    value: number; // For scoring
    tags?: string[]; // For profile matching
  }[];
}

// Quiz questions configuration
const quizQuestions: QuizQuestion[] = [
  {
    id: 'sleep-position',
    type: 'image-select',
    question: 'What position do you sleep in most often?',
    subtitle: 'Choose the one you wake up in',
    icon: <Bed className="w-6 h-6" />,
    options: [
      { id: 'side', label: 'Side', value: 10, tags: ['side-sleeper'] },
      { id: 'back', label: 'Back', value: 5, tags: ['back-sleeper'] },
      { id: 'stomach', label: 'Stomach', value: 3, tags: ['stomach-sleeper'] },
      { id: 'mixed', label: 'I switch', value: 7, tags: ['mixed-sleeper'] },
    ],
  },
  {
    id: 'pain-points',
    type: 'multiple',
    question: 'Which of these do you experience when you wake up?',
    subtitle: 'Select all that apply',
    icon: <AlertTriangle className="w-6 h-6" />,
    options: [
      { id: 'shoulder-pain', label: 'Shoulder pain or pressure', value: 10, tags: ['shoulder-pain', 'side-sleeper'] },
      { id: 'neck-pain', label: 'Neck stiffness or pain', value: 10, tags: ['neck-pain'] },
      { id: 'arm-numbness', label: 'Arm numbness or tingling', value: 8, tags: ['circulation-issues', 'side-sleeper'] },
      { id: 'back-pain', label: 'Lower back pain', value: 6, tags: ['alignment-issues'] },
      { id: 'headache', label: 'Headaches', value: 5, tags: ['neck-pain'] },
      { id: 'none', label: 'None of these', value: 0, tags: ['no-pain'] },
    ],
  },
  {
    id: 'pillow-age',
    type: 'single',
    question: 'How old is your current pillow?',
    subtitle: 'Be honest - most people underestimate this',
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'under-1', label: 'Less than 1 year', value: 0, tags: ['new-pillow'] },
      { id: '1-2', label: '1-2 years', value: 3, tags: ['aging-pillow'] },
      { id: '2-5', label: '2-5 years', value: 7, tags: ['old-pillow', 'danger'] },
      { id: 'over-5', label: 'Over 5 years', value: 10, tags: ['very-old-pillow', 'danger', 'urgent'] },
      { id: 'no-idea', label: 'No idea... probably old', value: 8, tags: ['old-pillow', 'danger'] },
    ],
  },
  {
    id: 'night-wakeups',
    type: 'single',
    question: 'How often do you wake up to adjust your pillow?',
    subtitle: 'During a typical night',
    icon: <Moon className="w-6 h-6" />,
    options: [
      { id: 'never', label: 'Never', value: 0, tags: ['good-support'] },
      { id: 'once', label: 'Once', value: 3, tags: ['minor-issues'] },
      { id: '2-3', label: '2-3 times', value: 7, tags: ['poor-support', 'compression'] },
      { id: '4-plus', label: '4+ times', value: 10, tags: ['severe-support-issues', 'compression', 'urgent'] },
    ],
  },
  {
    id: 'hotel-sleep',
    type: 'single',
    question: 'Do you sleep better in hotels?',
    subtitle: 'Think about your last hotel stay',
    icon: <Bed className="w-6 h-6" />,
    options: [
      { id: 'much-better', label: 'Yes, much better', value: 10, tags: ['hotel-quality', 'pillow-issue'] },
      { id: 'somewhat', label: 'Somewhat better', value: 7, tags: ['hotel-quality'] },
      { id: 'same', label: 'About the same', value: 3, tags: [] },
      { id: 'worse', label: 'Worse', value: 0, tags: [] },
    ],
  },
  {
    id: 'arm-numbness',
    type: 'single',
    question: 'Do you wake up with a numb or "dead" arm?',
    subtitle: 'That tingling feeling when you shake it out',
    icon: <AlertTriangle className="w-6 h-6" />,
    options: [
      { id: 'every-night', label: 'Almost every night', value: 10, tags: ['circulation-issues', 'side-sleeper', 'urgent'] },
      { id: 'few-times-week', label: 'A few times a week', value: 7, tags: ['circulation-issues', 'side-sleeper'] },
      { id: 'occasionally', label: 'Occasionally', value: 3, tags: ['minor-circulation'] },
      { id: 'never', label: 'Never', value: 0, tags: [] },
    ],
  },
  {
    id: 'pillow-type',
    type: 'single',
    question: 'What type of pillow do you currently use?',
    subtitle: 'Check the tag if you\'re not sure',
    icon: <Package className="w-6 h-6" />,
    options: [
      { id: 'memory-foam', label: 'Memory foam', value: 3, tags: ['memory-foam'] },
      { id: 'down', label: 'Down or feather', value: 5, tags: ['down'] },
      { id: 'polyester', label: 'Polyester fill', value: 7, tags: ['polyester', 'compression'] },
      { id: 'no-idea', label: 'No idea', value: 5, tags: ['unknown'] },
    ],
  },
  {
    id: 'temperature',
    type: 'single',
    question: 'Do you sleep hot?',
    subtitle: 'Waking up sweaty or flipping to the cool side',
    icon: <ThermometerSun className="w-6 h-6" />,
    options: [
      { id: 'very-hot', label: 'Yes, I wake up sweating', value: 10, tags: ['hot-sleeper', 'temperature'] },
      { id: 'somewhat', label: 'Sometimes too warm', value: 5, tags: ['warm-sleeper'] },
      { id: 'comfortable', label: 'Usually comfortable', value: 0, tags: [] },
      { id: 'cold', label: 'I get cold easily', value: 0, tags: ['cold-sleeper'] },
    ],
  },
  {
    id: 'allergies',
    type: 'single',
    question: 'Do you have allergies or wake up congested?',
    subtitle: 'Dust mites live in old pillows',
    icon: <AlertTriangle className="w-6 h-6" />,
    options: [
      { id: 'yes-allergies', label: 'Yes, I have allergies', value: 8, tags: ['allergies', 'dust-mites', 'danger'] },
      { id: 'congested', label: 'I wake up congested', value: 7, tags: ['dust-mites', 'danger'] },
      { id: 'no', label: 'No issues', value: 0, tags: [] },
    ],
  },
  {
    id: 'pillow-flip',
    type: 'single',
    question: 'How often do you flip your pillow to the "cool side"?',
    subtitle: 'During a single night',
    icon: <ThermometerSun className="w-6 h-6" />,
    options: [
      { id: 'multiple', label: 'Multiple times', value: 8, tags: ['hot-sleeper', 'temperature'] },
      { id: 'once', label: 'Once', value: 4, tags: ['warm-sleeper'] },
      { id: 'rarely', label: 'Rarely', value: 0, tags: [] },
    ],
  },
  {
    id: 'morning-stiffness',
    type: 'single',
    question: 'How long does morning stiffness last?',
    subtitle: 'Neck or shoulder stiffness after waking',
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'hours', label: 'Several hours', value: 10, tags: ['severe-pain', 'alignment-issues', 'urgent'] },
      { id: '1-hour', label: 'About an hour', value: 7, tags: ['moderate-pain', 'alignment-issues'] },
      { id: '30-min', label: '30 minutes or less', value: 3, tags: ['minor-pain'] },
      { id: 'none', label: 'No stiffness', value: 0, tags: [] },
    ],
  },
  {
    id: 'shoulder-pressure',
    type: 'single',
    question: 'Do you wake up because your shoulder hurts?',
    subtitle: 'That 3am wake-up to switch sides',
    icon: <AlertTriangle className="w-6 h-6" />,
    options: [
      { id: 'every-night', label: 'Yes, almost every night', value: 10, tags: ['shoulder-pain', 'side-sleeper', 'urgent'] },
      { id: 'few-times', label: 'A few times a week', value: 7, tags: ['shoulder-pain', 'side-sleeper'] },
      { id: 'occasionally', label: 'Occasionally', value: 3, tags: ['minor-shoulder'] },
      { id: 'never', label: 'Never', value: 0, tags: [] },
    ],
  },
];

// Profile scoring algorithm
interface QuizProfile {
  id: string;
  name: string;
  slug: string;
  minScore: number;
  requiredTags: string[];
  dangerScore: number;
  description: string;
}

const profiles: QuizProfile[] = [
  {
    id: 'side-sleeper-urgent',
    name: 'Side Sleeper with Severe Issues',
    slug: 'side-sleeper-pillow',
    minScore: 60,
    requiredTags: ['side-sleeper', 'urgent'],
    dangerScore: 85,
    description: 'You\'re experiencing significant pain and sleep disruption from improper side sleeping support.',
  },
  {
    id: 'side-sleeper',
    name: 'Side Sleeper',
    slug: 'side-sleeper-pillow',
    minScore: 40,
    requiredTags: ['side-sleeper'],
    dangerScore: 60,
    description: 'Your sleeping position requires specific pillow support that you\'re not currently getting.',
  },
  {
    id: 'neck-pain',
    name: 'Neck Pain Sufferer',
    slug: 'neck-pain-relief-pillow',
    minScore: 35,
    requiredTags: ['neck-pain'],
    dangerScore: 70,
    description: 'Your neck pain is likely caused by poor pillow support and alignment.',
  },
  {
    id: 'hot-sleeper',
    name: 'Hot Sleeper',
    slug: 'hotel-quality-pillow',
    minScore: 30,
    requiredTags: ['hot-sleeper'],
    dangerScore: 50,
    description: 'Temperature regulation is critical for your sleep quality.',
  },
  {
    id: 'pillow-danger',
    name: 'Pillow Danger Zone',
    slug: 'hotel-quality-pillow',
    minScore: 25,
    requiredTags: ['danger'],
    dangerScore: 90,
    description: 'Your old pillow is a health hazard and affecting your sleep quality.',
  },
  {
    id: 'hotel-quality',
    name: 'Hotel Sleep Seeker',
    slug: 'hotel-quality-pillow',
    minScore: 20,
    requiredTags: ['hotel-quality'],
    dangerScore: 55,
    description: 'You know what good sleep feels like - you just need it at home.',
  },
];

export default function SleepQuiz() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [email, setEmail] = useState('');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  // Handle answer selection
  const handleAnswer = (optionId: string) => {
    if (currentQuestion.type === 'multiple') {
      // Toggle selection for multiple choice
      const current = answers[currentQuestion.id] || [];
      const newAnswers = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
    } else {
      // Single selection
      setAnswers({ ...answers, [currentQuestion.id]: [optionId] });
      
      // Auto-advance for single-choice questions after a brief delay
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowEmailGate(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call to store quiz responses
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for now
    const quizData = {
      email,
      answers,
      timestamp: new Date().toISOString(),
      profile: calculateProfile(),
    };
    localStorage.setItem('sleep_quiz_result', JSON.stringify(quizData));
    
    setIsSubmitting(false);
    setShowResults(true);
    
    // Redirect to profile page after showing results preview
    setTimeout(() => {
      const profile = calculateProfile();
      navigate(`/${profile.slug}?profile=${profile.id}&email=${encodeURIComponent(email)}`);
    }, 3000);
  };

  const calculateProfile = (): QuizProfile => {
    // Calculate total score and collect all tags
    let totalScore = 0;
    const allTags: string[] = [];

    Object.entries(answers).forEach(([questionId, selectedOptions]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question) return;

      selectedOptions.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
        if (option) {
          totalScore += option.value;
          if (option.tags) {
            allTags.push(...option.tags);
          }
        }
      });
    });

    // Find best matching profile
    const matchedProfile = profiles.find(profile => {
      const hasRequiredTags = profile.requiredTags.every(tag => allTags.includes(tag));
      const meetsMinScore = totalScore >= profile.minScore;
      return hasRequiredTags && meetsMinScore;
    });

    return matchedProfile || profiles[profiles.length - 1]; // Default to last profile
  };

  const isAnswered = currentQuestion.type === 'multiple' 
    ? (answers[currentQuestion.id]?.length || 0) > 0
    : answers[currentQuestion.id]?.length === 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-secondary z-50">
        <div 
          className="h-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
        <div className="container max-w-2xl mx-auto px-4 py-12 md:py-20">
        {!showEmailGate && !showResults && (
          <>
            {/* Question Card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10">
              {/* Question Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <div className="text-foreground">{currentQuestion.icon}</div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    Question {currentStep + 1} of {quizQuestions.length}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 leading-tight">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-sm text-muted-foreground">{currentQuestion.subtitle}</p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id]?.includes(option.id);
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className={`w-full p-4 border rounded-xl text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground hover:bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-medium text-sm ${
                          isSelected ? 'text-background' : 'text-foreground'
                        }`}>{option.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
                {currentQuestion.type === 'multiple' && (
                  <Button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className="ml-auto gap-2"
                  >
                    {isLastQuestion ? 'See Results' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Email Gate */}
        {showEmailGate && !showResults && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                Get Your Personalized Sleep Analysis
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your email to see your full results and personalized recommendations
              </p>
            </div>

            {/* Blurred Results Preview */}
            <div className="relative mb-8 p-6 bg-secondary rounded-xl blur-sm select-none">
              <div className="space-y-3">
                <div className="h-6 bg-border rounded w-3/4"></div>
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-5/6"></div>
                <div className="h-20 bg-border rounded w-full mt-4"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card px-6 py-3 rounded-full shadow-lg border border-border">
                  <span className="font-semibold text-sm">Enter email to unlock</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-base border-2 border-[#e5e0d8] rounded-xl focus:border-[#1a1a1a] transition-colors"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-base gap-2 bg-gradient-to-r from-[#1d9bf0] to-[#0c7abf] hover:from-[#0c7abf] hover:to-[#1d9bf0] text-white rounded-lg font-semibold transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    See My Results
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-[#999] text-center mt-4">
              We'll send you personalized sleep tips. No spam, ever.
            </p>
          </div>
        )}

        {/* Results Preview (before redirect) */}
        {showResults && (
          <div className="bg-white border-2 border-[#e5e0d8] rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
              Analysis Complete!
            </h2>
            <p className="text-[#666] mb-6">
              Redirecting you to your personalized results...
            </p>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1a1a1a]" />
          </div>
        )}
      </div>
    </div>
  );
}
