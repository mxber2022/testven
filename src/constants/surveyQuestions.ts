import { SurveyQuestion } from '../components/SurveyOverlay';

// RWA Survey Questions
export const RWA_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'rwa_asset_preference',
    question: 'Which assets would you like to trade on Bitcoin first?',
    options: [
      'Blue Chip Crypto (BTC, SOL, ETH)',
      'Tradfi (SP500, NVDA, AMZN, VIX, QQQ)'
    ]
  }
];

// Lending Survey Questions
export const LENDING_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'lending_protocol_preference',
    question: 'Which lending protocols and ecosystem would you like to see first?',
    options: [
      'SOL Defi', 
      'ETH Defi', 
      'Stablecoin strategies'
    ]
  },
  {
    id: 'lending_feature_preference',
    question: 'Which features are you most interested in?',
    options: [
      'Margin trading',
      'Leveraged Pools',
      'Leveraged Farming'
    ],
    allowMultiple: true
  }
];

// Survey Metadata
export const RWA_SURVEY_METADATA = {
  title: 'Customize Your Trading Experience',
  description: 'Help us prioritize what to build next by sharing your preferences.'
};

export const LENDING_SURVEY_METADATA = {
  title: 'Customize Your Lending Experience',
  description: 'Let us know which lending protocols and features you\'re most interested in.'
}; 