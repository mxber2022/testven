import React, { useState } from 'react';
import { Box, Flex, Text, Button, Heading } from 'theme-ui';
import { X } from 'lucide-react';

export interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
  allowMultiple?: boolean;
}

interface SurveyOverlayProps {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  onComplete: (responses: Record<string, string | string[]>) => void;
  onSkip: () => void;
}

const SurveyOverlay: React.FC<SurveyOverlayProps> = ({
  title,
  description,
  questions,
  onComplete,
  onSkip,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  
  const handleOptionSelect = (questionId: string, option: string) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question?.allowMultiple) {
      const currentSelections = responses[questionId] as string[] || [];
      if (currentSelections.includes(option)) {
        setResponses({
          ...responses,
          [questionId]: currentSelections.filter(item => item !== option)
        });
      } else {
        setResponses({
          ...responses,
          [questionId]: [...currentSelections, option]
        });
      }
    } else {
      setResponses({
        ...responses,
        [questionId]: option
      });
      
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 300);
      }
    }
  };
  
  const handleSubmit = () => {
    // Send data to analytics or backend
    onComplete(responses);
  };
  
  const currentQuestionObj = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isMultipleSelect = currentQuestionObj?.allowMultiple;
  const currentSelections = isMultipleSelect ? (responses[currentQuestionObj.id] as string[] || []) : [];
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#171720',
          borderRadius: '16px',
          width: ['95%', '85%', '70%'],
          maxWidth: '800px',
          padding: [3, 4, 5],
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Heading as="h2" sx={{ fontSize: [3, 4], fontWeight: 'bold' }}>
            {title}
          </Heading>
          <Button
            sx={{
              bg: 'transparent',
              p: 1,
              color: 'gray',
              cursor: 'pointer',
              '&:hover': { color: 'white' },
            }}
            onClick={onSkip}
          >
            <X size={18} />
          </Button>
        </Flex>
        
        <Text sx={{ mb: 4, color: 'gray', fontSize: [1, 2] }}>{description}</Text>
        
        <Box sx={{ mb: 4 }}>
          <Text sx={{ fontWeight: 'bold', mb: 3, fontSize: [2, 3] }}>
            {currentQuestionObj.question}
          </Text>
          
          <Flex sx={{ flexDirection: 'column', gap: 3 }}>
            {currentQuestionObj.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleOptionSelect(currentQuestionObj.id, option)}
                sx={{
                  bg: isMultipleSelect 
                    ? (currentSelections.includes(option) ? '#3B82F6' : '#2A2A35') 
                    : (responses[currentQuestionObj.id] === option ? '#3B82F6' : '#2A2A35'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  p: [3, 4],
                  fontSize: [2, 3],
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'block',
                  width: '100%',
                  '&:hover': {
                    bg: isMultipleSelect
                      ? (currentSelections.includes(option) ? '#3B82F6' : '#3F3F50')
                      : (responses[currentQuestionObj.id] === option ? '#3B82F6' : '#3F3F50'),
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                {option}
              </Button>
            ))}
          </Flex>
        </Box>
        
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Button
            onClick={onSkip}
            sx={{
              bg: 'transparent',
              color: 'gray',
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              fontSize: [1, 2],
            }}
          >
            Skip
          </Button>
          
          {isLastQuestion && (isMultipleSelect ? (currentSelections.length > 0) : responses[currentQuestionObj.id]) && (
            <Button
              onClick={handleSubmit}
              sx={{
                bg: '#3B82F6',
                color: 'white',
                borderRadius: '8px',
                py: 2,
                px: 4,
                fontSize: [1, 2],
                cursor: 'pointer',
                '&:hover': { bg: '#2563EB' },
              }}
            >
              Submit
            </Button>
          )}
          
          {!isLastQuestion && isMultipleSelect && currentSelections.length > 0 && (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              sx={{
                bg: '#3B82F6',
                color: 'white',
                borderRadius: '8px',
                py: 2,
                px: 4,
                fontSize: [1, 2],
                cursor: 'pointer',
                '&:hover': { bg: '#2563EB' },
              }}
            >
              Next
            </Button>
          )}
        </Flex>
        
        <Flex sx={{ mt: 4, justifyContent: 'center', gap: 2 }}>
          {questions.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                bg: index === currentQuestion ? '#3B82F6' : 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default SurveyOverlay; 