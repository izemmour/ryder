import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'wouter';
import QuizModule from './QuizModule';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [, navigate] = useLocation();
  const { getQuizRedirect } = useSiteSettings();
  
  // Prevent body scroll and preserve scroll position when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleComplete = (profile: any, score: number) => {
    console.log('Quiz completed:', profile, score);
    
    // Get the redirect URL from settings based on profile
    // Map profile names to setting keys
    const profileNameToKey: Record<string, string> = {
      'Side Sleeper with Severe Issues': 'the_restless_sleeper',
      'Side Sleeper': 'the_restless_sleeper',
      'Neck Pain Sufferer': 'the_pain_sufferer',
      'Hot Sleeper': 'the_hot_sleeper',
      'Pillow Danger Zone': 'the_allergy_prone',
      'Hotel Sleep Seeker': 'the_quality_seeker',
    };
    
    const settingKey = profileNameToKey[profile.name] || 'the_quality_seeker';
    const redirectUrl = getQuizRedirect(settingKey);
    
    // Close modal and navigate to result page with profile parameter
    onClose();
    
    // Navigate to the redirect URL with quiz profile info
    const separator = redirectUrl.includes('?') ? '&' : '?';
    navigate(`${redirectUrl}${separator}from=quiz&profile=${profile.slug}&score=${score}`);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-none sm:rounded-2xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Close quiz"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content - Unified white background container wrapping quiz */}
        <div className="p-4 sm:p-6 md:p-8">
          <QuizModule onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
