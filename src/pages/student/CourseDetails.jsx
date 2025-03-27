import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'

const CourseDetails = () => {

  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const { allCourses, calculateRating, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime } = useContext(AppContext)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(item => item._id === id)
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/** Left Column */}
        <div>
          <h1>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

          {/** review and ratings*/}
          <div className='flex justify-between items-center space-x-2 pt-3 pb-1 '>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt="" className='w-3.5 h-3.5' />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>
            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>
          <p>Course by <span className='text-blue-600 underline'>Web Sette</span>  </p>

          <div className='text-gray-800 pt-8'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>

            <div className='pt-5 '>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb:2 rounded'>
                  <div onClick={() => toggleSection(index)} className='flex justify-between items-center px-4 py-3 course-pointer select-none'>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>
                </div>
              ))}
              <p>{calculateCourseDuration(courseData)} total hours</p>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
              <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                {chapter.chapterContent.map((lecture, i) => ( // Search for chapter to play
                  <li key={i} className='flex items-start gap-2 py-1'>
                    <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                      <p className='text-sm'>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>
                        {lecture.isPreview && <p className='text-blue-600 cursor-pointer'>Preview</p>}
                        <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='pt-20 text-sm md:text-default '>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>

          {/** Right Column */}
          <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
            <img src={courseData.courseThumbnail} alt="" />
            <div className='pt-5'>
              <div>
                <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
                <p><span className='text-red-500'>5 days</span> left at this price!</p>
              </div>

              <div className=' flex gap-3 items-center pt-2'>
                <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
                <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
              </div>

              <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                <div className='flex items-center gap-2'>
                  <img src={assets.star} alt="star icon" />
                  <p>{calculateRating(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.time_clock_icon} alt="clock icon" />
                  <p>{calculateCourseDuration(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.time_clock_icon} alt="clock icon" />
                  <p>{calculateNoOfLectures(courseData)}lessons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>) : <Loading />
}

export default CourseDetails
