import { useEffect, useRef } from 'react'
import videoDemo from '../assets/produit.mp4'
import { gsap } from 'gsap'

function ProductPage({ videoSrc }) {
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo(descRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(videoRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1 },
      '-=0.3'
    )
  }, [])

  return (
    <section className="py-24 lg:py-32 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 opacity-0">
          See InvoiceMe in Action
        </h2>
        <p ref={descRef} className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 opacity-0">
          Watch how easy it is to create professional invoices and manage your clients in minutes.
        </p>

        <div ref={videoRef} className="relative rounded-2xl overflow-hidden shadow-2xl opacity-0">
          <video
            className="w-full h-auto"
            autoPlay
            loop
            muted
            controls
            poster=""
            src={videoDemo}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  )
}

export default ProductPage