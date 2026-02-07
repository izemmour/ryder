import { HelpCircle } from 'lucide-react';

interface QuizMiniSectionProps {
  onOpenQuiz: () => void;
  context?: 'hotel-quality' | 'side-sleeper' | 'neck-pain' | 'default';
}

export function QuizMiniSection({ onOpenQuiz, context = 'default' }: QuizMiniSectionProps) {
  const contextualMessages = {
    'hotel-quality': {
      headline: 'Not sure if this is right for you?',
      description: 'Take our 60-second quiz to find your perfect pillow match based on your sleep habits.',
    },
    'side-sleeper': {
      headline: 'Waking up with shoulder pain?',
      description: 'Our quick quiz identifies your exact sleep issue and recommends the best solution.',
    },
    'neck-pain': {
      headline: 'Still experiencing neck stiffness?',
      description: 'Find out what\'s really causing your pain with our personalized sleep assessment.',
    },
    'default': {
      headline: 'Not sure what your sleep issue is?',
      description: 'Take our 60-second quiz to discover your sleep profile and get personalized recommendations.',
    },
  };

  const message = contextualMessages[context];

  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-1">{message.headline}</h4>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{message.description}</p>
          <button
            onClick={onOpenQuiz}
            className="text-xs font-medium bg-foreground text-background hover:opacity-90 px-4 py-2 rounded-full transition-opacity"
          >
            Take the Sleep Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}
