import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our <br />
        platform has made a difference in their lives.</p>
      <div className='grid grid-cols-3 gap-5 mt-10'>
        {dummyTestimonial.map((testimonial, index) => (
          <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overscroll-hidden'>
            <div className='flex items-center gap-4 bg-gray-500/10 px-7 py-4'>
              <img className='w-20 h-20 rounded-full' src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                <p className='text-gray-800/80'>{testimonial.role}</p>
              </div>
            </div>
            <div className='p-5 pb-5'>
              <div className='flex gap-0.4'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" className='h-5' />
                ))}
              </div>
              <p className='text-gray-500 mt-4'>{testimonial.feedback}</p>
            </div>
            <a href={testimonial.link}  className='flex items-center justify-center gap-2 text-blue-500 hover:underline'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TestimonialsSection
