import React, { useState, useEffect, useRef } from 'react'

interface AccessCodeProps {
  onSuccess: () => void
}

const ACCESS_CODE = '21_million'
const STORAGE_KEY = 'venice_access_granted'

const AccessCode: React.FC<AccessCodeProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if access was previously granted for this session only
    const hasAccess = sessionStorage.getItem(STORAGE_KEY)
    if (hasAccess === 'true') {
      onSuccess()
    }

    // Set up intersection observer for footer animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 } // Trigger when footer is 15% visible
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [onSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.toLowerCase() === ACCESS_CODE.toLowerCase()) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      onSuccess()
    } else {
      setError(true)
      setCode('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#0B0B0F] overflow-visible" style={{ backgroundColor: "#0B0B0F" }}>
      {/* Main Content */}
      <div 
        className="w-full max-w-5xl flex flex-col items-center justify-center py-16 md:py-20 z-10 relative bg-[#0B0B0F]"
        style={{ backgroundColor: "#0B0B0F" }}
      >
        {/* Header - with original logo and improved spacing */}
        <div className="text-center space-y-5 mb-16 w-full bg-[#0B0B0F]">
          <img 
            src="/Group 48095482.png" 
            alt="Venice Finance" 
            className="w-32 md:w-40 h-auto mx-auto"
          />
          
          <p className="text-gray-400 text-base md:text-lg px-4">
            Enter the access code to continue
          </p>
        </div>

        {/* Access Code Form - same spacing as above */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 mb-12 px-4 bg-[#0B0B0F]">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(false)
              }}
              placeholder="Enter access code"
              className={`w-full px-4 md:px-6 py-4 bg-[#1C1C24] border ${
                error ? 'border-red-500' : 'border-gray-700'
              } rounded-xl text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 font-medium">
                Invalid access code. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 md:px-6 py-4 bg-[#f97316] text-white rounded-xl text-base md:text-lg font-semibold hover:bg-[#ea580c] transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
          >
            Continue
          </button>
        </form>
        
        {/* Social Links */}
        <div className="flex flex-col items-center justify-center mb-16 bg-[#0B0B0F]">
          <div className="flex justify-center gap-8 mb-4">
            <a 
              href="https://t.me/venicefi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity transform hover:scale-110"
            >
              <img src="/tgLogo.png" alt="Telegram" className="w-8 h-8 md:w-10 md:h-10" />
            </a>
            <a 
              href="https://x.com/evenicefi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity transform hover:scale-110"
            >
              <img src="/xlogo-white.png" alt="X (Twitter)" className="w-8 h-8 md:w-10 md:h-10" />
            </a>
          </div>
          <p className="text-gray-500 text-xs font-mono text-center px-4 max-w-sm">
            Early access code through community. Be on the lookout and engage with us on socials for an access code.
          </p>
        </div>

        {/* Marketing text section with consistent background */}
        <div className="w-full text-center max-w-2xl mb-8 px-4 md:px-8 bg-[#0B0B0F]">
          <p className="text-[#f97316] text-lg md:text-xl leading-relaxed font-medium">
            Bitcoin's block space will become the global settlement layer for all value. Venice unlocks easy & secure participation to yield. 
            <br className="hidden md:block" /><br className="hidden md:block" />
            Securely Lend your Bitcoin to earn yield & accumulate returns from whitelisted cross-chain DeFi protocols.
          </p>
        </div>

      </div>

      {/* Simplified footer with logo combination */}
      <div 
        ref={footerRef} 
        className="w-full bg-[#0B0B0F] pt-4 pb-12 md:pt-4 md:pb-16 relative"
        style={{ backgroundColor: "#0B0B0F" }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 bg-[#0B0B0F]">
          {/* Combined logo display with opacity effects */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#0B0B0F]`}>
            <div className="flex justify-center items-center bg-[#0B0B0F] overflow-hidden">
              {/* Container to maintain consistent scaling */}
              <div className="flex items-center justify-center h-[120px] md:h-[160px] bg-[#0B0B0F]">
                {/* Venice logo with linear opacity gradient */}
                <div className="relative h-full mr-4 md:mr-8">
                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      background: 'linear-gradient(to bottom, rgba(11,11,15,0) 0%, rgba(11,11,15,1) 100%)',
                      pointerEvents: 'none'
                    }}
                  ></div>
                  <img 
                    src="/venicelogo.png" 
                    alt="Venice Logo" 
                    className="h-full w-auto object-contain" 
                    style={{ aspectRatio: 'auto', maxHeight: '100%' }}
                  />
                </div>
                
                {/* Blue Venice logo */}
                <div className="h-full">
                  <img 
                    src="/VENICEaccesscodefooter.png" 
                    alt="Venice Finance" 
                    className="h-full w-auto object-contain" 
                    style={{ backgroundColor: "#0B0B0F", aspectRatio: 'auto', maxHeight: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessCode 