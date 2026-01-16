import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function FeatureSection({ title, description, image, reverse = false }) {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current

    gsap.fromTo(imageRef.current,
      { opacity: 0, x: reverse ? 100 : -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    gsap.fromTo(descRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [reverse])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 overflow-hidden">
      <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>

        <div ref={imageRef} className={`w-full px-4 md:px-0 lg:flex-[1.3] ${reverse ? 'lg:-mr-48 lg:pl-6' : 'lg:-ml-48 lg:pr-6'} opacity-0`}>
          <img
            src={image}
            alt={title}
            className="w-full md:w-[90%] md:mx-auto lg:w-[140%] h-auto rounded-xl shadow-2xl"
          />
        </div>

        <div className="flex-1 text-center lg:text-left px-6 lg:px-12">
          <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 opacity-0">
            {title}
          </h2>
          <p ref={descRef} className="text-lg md:text-xl text-gray-300 leading-relaxed opacity-0">
            {description}
          </p>
        </div>

      </div>
    </section>
  )
}

export default FeatureSection
