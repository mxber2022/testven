import { useNavigate } from 'react-router-dom'

const Brand = ({ className }: { className?: string }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
  }

  return (
    <div onClick={handleClick} className={className}>
      <div className="hidden md:flex lg:flex items-center dark:text-foreground">
        <img 
          src="/Group 48095482.png" 
          alt="Venice Logo" 
          style={{ maxHeight: '35px', maxWidth: '150px' }} 
        />
      </div>
      <div className="flex md:hidden lg:hidden items-center justify-center text-2xl mr-2">
        <img 
          src="/Group 48095482.png" 
          alt="Venice Logo" 
          style={{ maxHeight: '28px', maxWidth: '120px' }} 
        />
      </div>
    </div>
  )
}

export default Brand
