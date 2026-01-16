import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import imgFacture from '../assets/image.png'

function HomeProduct() {
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const buttonsRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(descRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    )
    .fromTo(buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(imageRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1 },
      '-=0.8'
    )
  }, [])

  return (
    <section className="px-6 lg:px-12 h-screen flex items-center relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
                <div className="flex-1 text-center lg:text-left z-10">
                    <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 opacity-0">
                        Get paid in hours,<br />not weeks
                    </h1>
                    <p ref={descRef} className="text-lg md:text-xl text-gray-300 max-w-md mx-auto lg:mx-0 mb-8 opacity-0">
                        For freelancers and SMBs who need cash flow, not excuses
                    </p>
                    <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0">
                        <button className="px-8 py-3 bg-dark-light text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                            Get Started Free
                        </button>
                        <button className="px-8 py-3 border border-gray-500 hover:border-white text-white font-semibold rounded-lg transition-colors duration-200">
                            See How It Works
                        </button>
                    </div>
                </div>
            </div>

            <div ref={imageRef} className="absolute bottom-0 right-0 lg:right-12 xl:right-24 hidden lg:block opacity-0">
                <div className="w-[500px] xl:w-[600px] 2xl:w-[700px] shadow-2xl">
                    <img
                        src={imgFacture}
                        alt="Exemple de facture"
                        className="w-full h-auto object-contain rounded-t-lg"
                    />
                </div>
            </div>
        </section>
  )
}

export default HomeProduct