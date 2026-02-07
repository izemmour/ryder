/**
 * QuizModule - Enhanced Quiz Component v4
 * 
 * Features:
 * - Persistent trust header with 5 stars + "746,000+ Happy Sleepers"
 * - Animated testimonial carousel (right-to-left, filtered by user answers)
 * - Unified loading screen with email form (email available during loading)
 * - Psychological belief checkpoint screens with Continue button
 * - Improved loading animation with stops at 50, 75, 85, 95, 97, 100
 * - Checkout-style "See My Results" button matching OrderPopup
 * - Answer-based profile tags (max 4) for results page
 * - Proper page reload redirect to top of page
 */

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, 
  Moon, Bed, Clock, ThermometerSun, Package, Star, Shield, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ============================================
// TESTIMONIALS DATA (categorized by use case)
// ============================================
interface Testimonial {
  name: string;
  text: string;
  tags: string[]; // For filtering based on user answers
}

const testimonials: Testimonial[] = [
  { 
    name: "David & Linda", 
    text: "We're both in our 60s and have tried EVERYTHING. This is the first one that actually stays put all night. No more 3am pillow fluffing.",
    tags: ['night-wakeups', 'old-pillow', 'compression']
  },
  { 
    name: "Margaret T.", 
    text: "After 3 back surgeries, I'd given up on finding a pillow that works. I wake up and my neck isn't screaming at me anymore.",
    tags: ['neck-pain', 'back-pain', 'alignment-issues']
  },
  { 
    name: "Robert K.", 
    text: "8 months now. Still perfect. I've washed it probably 15 times and it comes out exactly the same every single time.",
    tags: ['durability', 'quality']
  },
  { 
    name: "Susan C.", 
    text: "My physical therapist asked what I changed! Said my neck alignment improved dramatically. Years of pain and THIS is what finally helped.",
    tags: ['neck-pain', 'alignment-issues', 'moderate-pain', 'severe-pain']
  },
  { 
    name: "Jennifer H.", 
    text: "The morning stiffness I thought was just \"getting older\"? Gone. Just... gone. I'm ordering more for Christmas gifts!",
    tags: ['morning-stiffness', 'minor-pain', 'moderate-pain']
  },
  { 
    name: "Michael P.", 
    text: "Woke up without that familiar neck tension for the first time in literally years. My wife thought I was being dramatic until she tried it.",
    tags: ['neck-pain', 'shoulder-pain', 'side-sleeper']
  },
  { 
    name: "Patricia W.", 
    text: "At 62, I've been through more pillows than I can count. This one? Still exactly like day one after 6 months.",
    tags: ['old-pillow', 'compression', 'durability']
  },
  { 
    name: "James L.", 
    text: "Two months in and it's exactly like day one. No sagging, no adjusting. Just... consistent.",
    tags: ['compression', 'poor-support', 'night-wakeups']
  },
  { 
    name: "Carol M.", 
    text: "I used to flip my pillow 5+ times a night looking for the cool side. Haven't done that once since switching.",
    tags: ['hot-sleeper', 'temperature', 'warm-sleeper']
  },
  { 
    name: "Richard B.", 
    text: "Side sleeper for 40 years. Finally found a pillow that doesn't crush down by 2am. Shoulder pain is gone.",
    tags: ['side-sleeper', 'shoulder-pain', 'compression']
  },
  { 
    name: "Nancy K.", 
    text: "My allergies have improved so much since switching. No more waking up congested every morning.",
    tags: ['allergies', 'dust-mites', 'congested']
  },
  { 
    name: "Thomas H.", 
    text: "Hotel pillows used to be my benchmark. Now my home pillow is better than any 5-star hotel I've stayed at.",
    tags: ['hotel-quality', 'pillow-issue']
  },
];

// ============================================
// ANSWER-BASED TAG LABELS (for results page)
// Maps quiz tags to human-readable labels
// ============================================
interface TagLabel {
  tags: string[]; // Quiz tags that trigger this label
  label: string;  // Human-readable label for results
  priority: number; // Higher = shown first (max 4 shown)
}

const tagLabels: TagLabel[] = [
  // Sleep position tags (highest priority - always show first)
  { tags: ['side-sleeper'], label: 'Made for Side Sleepers', priority: 100 },
  { tags: ['back-sleeper'], label: 'Perfect for Back Sleepers', priority: 100 },
  { tags: ['stomach-sleeper'], label: 'Designed for Stomach Sleepers', priority: 100 },
  { tags: ['mixed-sleeper'], label: 'Adapts to Any Position', priority: 98 },
  
  // Pain-related tags (high priority - key selling points)
  { tags: ['neck-pain'], label: 'Neck Pain Relief', priority: 95 },
  { tags: ['shoulder-pain'], label: 'Shoulder Support', priority: 94 },
  { tags: ['alignment-issues'], label: 'Spinal Alignment', priority: 93 },
  { tags: ['severe-pain'], label: 'Pain Relief Formula', priority: 92 },
  { tags: ['moderate-pain'], label: 'Comfort Support', priority: 88 },
  { tags: ['circulation-issues'], label: 'Pressure Relief', priority: 91 },
  
  // Temperature tags (important differentiator)
  { tags: ['hot-sleeper'], label: 'Cooling Technology', priority: 87 },
  { tags: ['temperature'], label: 'Temperature Control', priority: 86 },
  { tags: ['warm-sleeper'], label: 'Temperature Neutral', priority: 80 },
  { tags: ['cold-sleeper'], label: 'Cozy Warmth', priority: 78 },
  
  // Allergy tags (health-focused)
  { tags: ['allergies'], label: 'Hypoallergenic', priority: 89 },
  { tags: ['dust-mites'], label: 'Dust Mite Resistant', priority: 85 },
  { tags: ['congested'], label: 'Breathe Easy', priority: 84 },
  
  // Urgency/danger tags (conversion drivers)
  { tags: ['urgent'], label: 'Urgent Replacement', priority: 82 },
  { tags: ['very-old-pillow'], label: 'Overdue for Upgrade', priority: 81 },
  { tags: ['old-pillow'], label: 'Time to Replace', priority: 79 },
  { tags: ['danger'], label: 'Health Alert', priority: 77 },
  
  // Support quality tags
  { tags: ['compression'], label: 'Lasting Support', priority: 76 },
  { tags: ['poor-support'], label: 'Superior Support', priority: 75 },
  { tags: ['severe-support-issues'], label: 'Maximum Support', priority: 83 },
  
  // Hotel quality (aspirational)
  { tags: ['hotel-quality'], label: 'Hotel-Grade Quality', priority: 74 },
  { tags: ['pillow-issue'], label: 'Sleep Upgrade', priority: 72 },
  
  // Pillow type upgrades
  { tags: ['memory-foam'], label: 'Premium Fill', priority: 65 },
  { tags: ['down'], label: 'Luxury Alternative', priority: 64 },
  { tags: ['polyester'], label: 'Quality Upgrade', priority: 63 },
];

// Function to get display labels from quiz tags (max 4)
function getDisplayLabels(quizTags: string[]): string[] {
  const matchedLabels: { label: string; priority: number }[] = [];
  
  for (const tagLabel of tagLabels) {
    const hasMatch = tagLabel.tags.some(tag => quizTags.includes(tag));
    if (hasMatch && !matchedLabels.find(m => m.label === tagLabel.label)) {
      matchedLabels.push({ label: tagLabel.label, priority: tagLabel.priority });
    }
  }
  
  // Sort by priority (highest first) and take top 4
  return matchedLabels
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4)
    .map(m => m.label);
}

// ============================================
// QUESTION TYPES AND DATA
// ============================================
type QuestionType = 'single' | 'multiple' | 'checkpoint';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  subtitle?: string;
  icon?: React.ReactNode;
  options: {
    id: string;
    label: string;
    value: number;
    tags?: string[];
  }[];
}

// Belief checkpoint generator based on answers
interface BeliefCheckpoint {
  triggeredAfter: string; // Question ID that triggers this checkpoint
  getMessage: (answers: Record<string, string[]>) => { title: string; body: string; stat?: string } | null;
}

const beliefCheckpoints: BeliefCheckpoint[] = [
  {
    triggeredAfter: 'pillow-age',
    getMessage: (answers) => {
      const pillowAge = answers['pillow-age']?.[0];
      if (pillowAge === 'over-5' || pillowAge === '2-5' || pillowAge === 'no-idea') {
        const years = pillowAge === 'over-5' ? '5+' : pillowAge === '2-5' ? '2-5' : 'several';
        return {
          title: `Your pillow is ${years} years old...`,
          body: "Sleep experts recommend replacing pillows every 1-2 years. After that, they lose up to 50% of their support and accumulate dust mites, dead skin cells, and allergens.",
          stat: "Pillows double in weight every 2 years from accumulated debris"
        };
      }
      return null;
    }
  },
  {
    triggeredAfter: 'night-wakeups',
    getMessage: (answers) => {
      const wakeups = answers['night-wakeups']?.[0];
      const painPoints = answers['pain-points'] || [];
      
      if (wakeups === '2-3' || wakeups === '4-plus') {
        const times = wakeups === '4-plus' ? '4+' : '2-3';
        return {
          title: `Waking up ${times} times per night isn't normal`,
          body: painPoints.includes('neck-pain') || painPoints.includes('shoulder-pain')
            ? "Your body is waking you up because it's uncomfortable. The pain you're experiencing is a signal that your pillow isn't providing proper support."
            : "Each time you wake to adjust your pillow, you're interrupting your sleep cycle. This prevents you from reaching the deep, restorative sleep your body needs.",
          stat: "Interrupted sleep reduces cognitive function by up to 32%"
        };
      }
      return null;
    }
  }
];

// Quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: 'sleep-position',
    type: 'single',
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
      { id: 'congested', label: 'I wake up congested', value: 7, tags: ['dust-mites', 'danger', 'congested'] },
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

// Profile definitions
interface QuizProfile {
  id: string;
  name: string;
  slug: string;
  minScore: number;
  requiredTags: string[];
  dangerScore: number;
  description: string;
  recommendation: string;
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
    recommendation: 'Your sleep position requires a pillow with proper loft and shoulder relief.',
  },
  {
    id: 'side-sleeper',
    name: 'Side Sleeper',
    slug: 'side-sleeper-pillow',
    minScore: 40,
    requiredTags: ['side-sleeper'],
    dangerScore: 60,
    description: 'Your sleeping position requires specific pillow support that you\'re not currently getting.',
    recommendation: 'Side sleepers need a higher loft pillow to maintain spinal alignment.',
  },
  {
    id: 'neck-pain',
    name: 'Neck Pain Sufferer',
    slug: 'neck-pain-relief-pillow',
    minScore: 35,
    requiredTags: ['neck-pain'],
    dangerScore: 70,
    description: 'Your neck pain is likely caused by poor pillow support and alignment.',
    recommendation: 'Proper cervical support can eliminate morning neck pain.',
  },
  {
    id: 'hot-sleeper',
    name: 'Hot Sleeper',
    slug: 'hotel-quality-pillow',
    minScore: 30,
    requiredTags: ['hot-sleeper'],
    dangerScore: 50,
    description: 'Temperature regulation is critical for your sleep quality.',
    recommendation: 'Breathable materials can reduce night sweats significantly.',
  },
  {
    id: 'pillow-danger',
    name: 'Pillow Danger Zone',
    slug: 'hotel-quality-pillow',
    minScore: 25,
    requiredTags: ['danger'],
    dangerScore: 80,
    description: 'Your old pillow is affecting your sleep quality and potentially your health.',
    recommendation: 'It\'s time to replace your pillow with something that will last.',
  },
  {
    id: 'hotel-quality',
    name: 'Hotel Quality Seeker',
    slug: 'hotel-quality-pillow',
    minScore: 20,
    requiredTags: ['hotel-quality'],
    dangerScore: 40,
    description: 'You know what good sleep feels like - you just need it at home.',
    recommendation: 'Same suppliers, direct pricing - no markup.',
  },
  {
    id: 'general',
    name: 'Sleep Improvement Candidate',
    slug: 'hotel-quality-pillow',
    minScore: 0,
    requiredTags: [],
    dangerScore: 35,
    description: 'Your sleep could benefit from better pillow support.',
    recommendation: 'A quality pillow is the foundation of good sleep.',
  },
];

// Loading messages with explanations
const loadingMessages = [
  { text: 'Analyzing your sleep patterns...', detail: 'Comparing your answers to our database' },
  { text: 'Calculating your sleep health score...', detail: 'Evaluating 12 key factors' },
  { text: 'Identifying your pain points...', detail: 'Matching symptoms to solutions' },
  { text: 'Building your personalized profile...', detail: 'Customizing recommendations' },
  { text: 'Finalizing your results...', detail: 'Almost there!' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Trust Header with 5 stars
function TrustHeader() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 py-3 border-b border-gray-100">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#f5c542] text-[#f5c542]" />
        ))}
      </div>
      <span className="text-sm text-[#666]">Trusted by <strong>746,000+</strong> Happy Sleepers</span>
    </div>
  );
}

// Animated Testimonial Carousel
function TestimonialCarousel({ userTags }: { userTags: string[] }) {
  const [offset, setOffset] = useState(0);
  
  // Filter testimonials based on user tags, or show all if no matches
  const relevantTestimonials = userTags.length > 0
    ? testimonials.filter(t => t.tags.some(tag => userTags.includes(tag)))
    : testimonials;
  
  // Use all testimonials if no relevant ones found
  const displayTestimonials = relevantTestimonials.length > 0 ? relevantTestimonials : testimonials;
  
  // Duplicate for seamless loop
  const loopedTestimonials = [...displayTestimonials, ...displayTestimonials, ...displayTestimonials];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="overflow-hidden mb-6 -mx-4">
      <div 
        className="flex gap-4 transition-transform"
        style={{ transform: `translateX(-${offset % (displayTestimonials.length * 280)}px)` }}
      >
        {loopedTestimonials.map((testimonial, idx) => (
          <div 
            key={idx}
            className="flex-shrink-0 w-[260px] bg-white rounded-lg border border-gray-100 p-3"
          >
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#f5c542] text-[#f5c542]" />
              ))}
            </div>
            <p className="text-xs text-[#666] line-clamp-3 mb-2">"{testimonial.text}"</p>
            <p className="text-xs font-medium text-[#1a1a1a]">— {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
interface QuizModuleProps {
  onComplete?: (profile: QuizProfile, score: number, tags: string[]) => void;
}

export default function QuizModule({ onComplete }: QuizModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [email, setEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0].text);
  const [loadingDetail, setLoadingDetail] = useState(loadingMessages[0].detail);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showBeliefCheckpoint, setShowBeliefCheckpoint] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<{ title: string; body: string; stat?: string } | null>(null);
  
  const scrollPositionRef = useRef(0);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  // Collect all tags from answers
  const collectTags = () => {
    const tags: string[] = [];
    Object.entries(answers).forEach(([questionId, selectedIds]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question) return;
      selectedIds.forEach(selectedId => {
        const option = question.options.find(opt => opt.id === selectedId);
        if (option?.tags) {
          tags.push(...option.tags);
        }
      });
    });
    return tags;
  };

  // Handle answer selection
  const handleAnswer = (optionId: string) => {
    if (currentQuestion.type === 'multiple') {
      const current = answers[currentQuestion.id] || [];
      const newAnswers = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
    } else {
      const newAnswers = { ...answers, [currentQuestion.id]: [optionId] };
      setAnswers(newAnswers);
      
      // Check for belief checkpoint after this question
      setTimeout(() => {
        const checkpoint = beliefCheckpoints.find(cp => cp.triggeredAfter === currentQuestion.id);
        if (checkpoint) {
          const message = checkpoint.getMessage(newAnswers);
          if (message) {
            setCurrentCheckpoint(message);
            setShowBeliefCheckpoint(true);
            return; // Wait for user to click Continue
          }
        }
        handleNextQuestion();
      }, 300);
    }
  };

  // Handle Continue from belief checkpoint
  const handleContinueFromCheckpoint = () => {
    setShowBeliefCheckpoint(false);
    setCurrentCheckpoint(null);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowLoading(true);
      startLoadingAnimation();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleNext = () => {
    // Check for belief checkpoint
    const checkpoint = beliefCheckpoints.find(cp => cp.triggeredAfter === currentQuestion.id);
    if (checkpoint) {
      const message = checkpoint.getMessage(answers);
      if (message) {
        setCurrentCheckpoint(message);
        setShowBeliefCheckpoint(true);
        return; // Wait for user to click Continue
      }
    }
    handleNextQuestion();
  };

  const handleBack = () => {
    if (showLoading) {
      setShowLoading(false);
      setLoadingProgress(0);
      setLoadingComplete(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Improved loading animation with stops at 50, 75, 85, 95, 97, 100
  const startLoadingAnimation = () => {
    setLoadingProgress(0);
    setLoadingComplete(false);
    setAllTags(collectTags());
    
    // Define stop points and their durations
    const stops = [
      { progress: 50, duration: 2000, messageIdx: 0 },
      { progress: 75, duration: 2500, messageIdx: 1 },
      { progress: 85, duration: 2000, messageIdx: 2 },
      { progress: 95, duration: 2000, messageIdx: 3 },
      { progress: 97, duration: 1000, messageIdx: 4 },
      { progress: 100, duration: 500, messageIdx: 4 },
    ];
    
    let currentStopIndex = 0;
    let currentStopStartTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const currentStop = stops[currentStopIndex];
      const prevProgress = currentStopIndex === 0 ? 0 : stops[currentStopIndex - 1].progress;
      const elapsedInStop = now - currentStopStartTime;
      const stopProgress = Math.min(elapsedInStop / currentStop.duration, 1);
      
      // Ease out for smoother deceleration
      const easedProgress = 1 - Math.pow(1 - stopProgress, 2);
      const displayProgress = prevProgress + (currentStop.progress - prevProgress) * easedProgress;
      
      setLoadingProgress(displayProgress);
      
      // Update message based on current stop
      if (currentStop.messageIdx < loadingMessages.length) {
        setLoadingMessage(loadingMessages[currentStop.messageIdx].text);
        setLoadingDetail(loadingMessages[currentStop.messageIdx].detail);
      }
      
      if (stopProgress >= 1) {
        // Move to next stop
        if (currentStopIndex < stops.length - 1) {
          currentStopIndex++;
          currentStopStartTime = now;
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          setLoadingProgress(100);
          setLoadingComplete(true);
        }
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const calculateResults = () => {
    let totalScore = 0;
    const collectedTags: string[] = [];

    Object.entries(answers).forEach(([questionId, selectedIds]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question) return;

      selectedIds.forEach(selectedId => {
        const option = question.options.find(opt => opt.id === selectedId);
        if (option) {
          totalScore += option.value;
          if (option.tags) {
            collectedTags.push(...option.tags);
          }
        }
      });
    });

    const matchedProfile = profiles.find(profile => {
      const hasRequiredTags = profile.requiredTags.every(tag => collectedTags.includes(tag));
      const meetsMinScore = totalScore >= profile.minScore;
      return hasRequiredTags && meetsMinScore;
    }) || profiles[profiles.length - 1];

    return { profile: matchedProfile, score: totalScore, tags: collectedTags };
  };

  const handleSubmitEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const { profile, score, tags } = calculateResults();
    setAllTags(tags);

    if (onComplete) {
      onComplete(profile, score, tags);
    }

    // Get display labels for the tags (max 4)
    const displayLabels = getDisplayLabels(tags);
    const labelsParam = encodeURIComponent(displayLabels.join(','));
    const tagsParam = encodeURIComponent(tags.join(','));
    
    // Use window.location.href for full page reload to ensure proper scroll to top
    // This avoids the anchor link behavior of wouter's navigate
    window.location.href = `/?from=quiz&profile=${profile.slug}&tags=${tagsParam}&labels=${labelsParam}`;
  };

  // Lock body scroll during loading
  useEffect(() => {
    if (showLoading) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [showLoading]);

  // Belief Checkpoint Screen with Continue button
  if (showBeliefCheckpoint && currentCheckpoint) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <TrustHeader />
        
        <div className="text-center py-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">
            {currentCheckpoint.title}
          </h2>
          
          <p className="text-[#666] mb-4 max-w-md mx-auto">
            {currentCheckpoint.body}
          </p>
          
          {currentCheckpoint.stat && (
            <div className="inline-block bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-6">
              <p className="text-sm font-medium text-red-700">
                📊 {currentCheckpoint.stat}
              </p>
            </div>
          )}
          
          <Button
            onClick={handleContinueFromCheckpoint}
            className="bg-[#e63946] hover:bg-[#d62839] text-white px-8 py-3 text-lg font-semibold rounded-full"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Loading screen with email form (email available during loading)
  if (showLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <TrustHeader />

        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">
            {loadingComplete ? 'Your Results Are Ready!' : 'Analyzing Your Responses'}
          </h2>
          <p className="text-[#666] transition-all duration-300">
            {loadingComplete ? 'Enter your email to unlock your personalized sleep profile' : loadingMessage}
          </p>
          {!loadingComplete && (
            <p className="text-xs text-[#999] mt-1">{loadingDetail}</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#e63946] to-[#c62b38]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-center text-sm text-[#666]">
            {Math.round(loadingProgress)}% complete
          </div>
        </div>

        {/* Testimonial Carousel */}
        <TestimonialCarousel userTags={allTags} />

        {/* Email Form - Always visible and enabled */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4">
          <div className="flex items-center gap-2 mb-3 text-sm text-[#666]">
            <Shield className="w-4 h-4" />
            <span>No spam, ever. Unsubscribe anytime.</span>
          </div>
          
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadingComplete && handleSubmitEmail()}
              className="h-11 sm:h-12"
            />
            {/* Checkout-style button matching OrderPopup */}
            <button
              onClick={handleSubmitEmail}
              disabled={!loadingComplete || isSubmitting}
              className={`w-full font-semibold py-4 rounded-full text-lg transition-all duration-500 flex items-center justify-center gap-2 ${
                loadingComplete 
                  ? 'bg-[#e63946] hover:bg-[#d62839] text-white shadow-lg shadow-red-500/25' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Unlocking...
                </>
              ) : loadingComplete ? (
                <>
                  <Lock className="w-4 h-4" />
                  See My Results
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing Results...
                </>
              )}
            </button>
          </div>
        </div>

        {/* What you'll get */}
        <div className="flex items-center justify-center gap-4 text-xs text-[#666]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Sleep health score
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Personalized tips
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Exclusive discount
          </span>
        </div>

        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] mx-auto mt-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to quiz
        </button>
      </div>
    );
  }

  // Quiz questions screen
  return (
    <div className="w-full max-w-2xl mx-auto">
      <TrustHeader />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#666]">
            Question {currentStep + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-[#666]">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e63946] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-2 sm:gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#e63946] flex-shrink-0">
            {currentQuestion.icon}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">{currentQuestion.question}</h2>
            {currentQuestion.subtitle && (
              <p className="text-sm text-[#666] mt-1">{currentQuestion.subtitle}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 sm:space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = (answers[currentQuestion.id] || []).includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#e63946] bg-red-50/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isSelected ? 'text-[#e63946]' : 'text-[#1a1a1a]'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#e63946] flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 text-sm ${
            currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#666] hover:text-[#1a1a1a]'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {currentQuestion.type === 'multiple' && (
          <Button
            onClick={handleNext}
            disabled={!(answers[currentQuestion.id]?.length > 0)}
            className="bg-[#e63946] hover:bg-[#d62839] text-white rounded-full px-6"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
