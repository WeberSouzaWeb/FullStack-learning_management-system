import React,{ createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const navigate = useNavigate()
    const [isEducator, setIsEducator] = useState(true)


    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            setAllCourses(dummyCourses)
        } catch (error) {
            console.log(error)
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) return 0
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    // Function to calculate Course Chapter Time
    const calculateChapterTime = (chapter) => { // Function to calculate total duration of chapter
        let totalDuration = 0                    // totalDuration is in minutes has to be passed
        chapter.chapContent.map((lecture) =>
            totalDuration += lecture.duration
        )
        return humanizeDuration(totalDuration * 60 * 1000, { units: ['h', 'm'], round: true })
    }
    // Function to calculate total duration of course
    const calculateDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapContent.map((lecture) => time += lecture.duration))
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'], round: true })
    }

    //function calculate no of lectures in course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapContent)) {
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures;
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator, setIsEducator,
        calculateChapterTime,
        calculateDuration,
        calculateNoOfLectures
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContextProvider;