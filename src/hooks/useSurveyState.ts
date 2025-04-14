import { useState, useEffect } from 'react';

// Define survey types
export type SurveyType = 'rwa' | 'lending';

interface SurveyState {
  hasCompletedRwaSurvey: boolean;
  hasCompletedLendingSurvey: boolean;
  rwaSurveyResponses: Record<string, string | string[]>;
  lendingSurveyResponses: Record<string, string | string[]>;
}

export const useSurveyState = () => {
  // Initialize state from localStorage or with defaults
  const [surveyState, setSurveyState] = useState<SurveyState>(() => {
    const savedState = localStorage.getItem('venicefi_survey_state');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse survey state', e);
      }
    }
    
    return {
      hasCompletedRwaSurvey: false,
      hasCompletedLendingSurvey: false,
      rwaSurveyResponses: {},
      lendingSurveyResponses: {}
    };
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('venicefi_survey_state', JSON.stringify(surveyState));
  }, [surveyState]);
  
  // Functions to check if surveys should be shown
  const shouldShowSurvey = (type: SurveyType): boolean => {
    if (type === 'rwa') {
      return !surveyState.hasCompletedRwaSurvey;
    } else if (type === 'lending') {
      return !surveyState.hasCompletedLendingSurvey;
    }
    return false;
  };
  
  // Function to mark survey as completed
  const completeSurvey = (type: SurveyType, responses: Record<string, string | string[]>) => {
    if (type === 'rwa') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedRwaSurvey: true,
        rwaSurveyResponses: responses
      }));
      
      // Here you would typically send the data to your analytics or backend
      console.log('RWA Survey completed:', responses);
    } else if (type === 'lending') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedLendingSurvey: true,
        lendingSurveyResponses: responses
      }));
      
      // Here you would typically send the data to your analytics or backend
      console.log('Lending Survey completed:', responses);
    }
  };
  
  // Function to reset survey state (for testing)
  const resetSurvey = (type: SurveyType) => {
    if (type === 'rwa') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedRwaSurvey: false,
        rwaSurveyResponses: {}
      }));
    } else if (type === 'lending') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedLendingSurvey: false,
        lendingSurveyResponses: {}
      }));
    }
  };
  
  // Function to skip survey
  const skipSurvey = (type: SurveyType) => {
    if (type === 'rwa') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedRwaSurvey: true
      }));
    } else if (type === 'lending') {
      setSurveyState(prev => ({
        ...prev,
        hasCompletedLendingSurvey: true
      }));
    }
  };
  
  return {
    shouldShowSurvey,
    completeSurvey,
    skipSurvey,
    resetSurvey,
    rwaSurveyResponses: surveyState.rwaSurveyResponses,
    lendingSurveyResponses: surveyState.lendingSurveyResponses
  };
};

export default useSurveyState; 