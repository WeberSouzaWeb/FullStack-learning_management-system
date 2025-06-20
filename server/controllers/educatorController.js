import { clerkClient, User } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import Purchase from '../models/Purchase.js'
import { educatorId } from '../configs/educator.js'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.json({ success: true, message: 'You can publish a course now' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Add a course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const userId = req.auth.userId

        // Validate required fields
        if (!imageFile) {
            return res.json({ success: false, message: 'All fields are required' })
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()
        res.json({ success: true, message: 'Course Added' })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator: userId })
        res.json({ success: true, courses })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get Educator  Dashboard Data ( Total Courses, Total Students, Total Earnings )
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const totalCourses = courses.length
        const courseIds = courses.map(course => course._id)

        // Calculate total earnings from purchases
        const purchases = await Purchase.aggregate([
            { $match: { courseId: { $in: courseIds }, status: 'completed' } },
        ])

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
        // Collect unique enrolled students IDs with their course titles
        const enrolledStudentsData = []
        for (const course of courses) {
            const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({
            success: true, dashboardData: {
                totalCourses,
                totalStudentsData,
                totalEarnings,
            }
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get Enrolled Students Data with Purschase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)

        // Get all purchases for the educator's courses
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
            .populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        // Map to get unique students with their course titles
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: courses.find(course => course._id.toString() === purchase.courseId.toString()).courseTitle,
            purchaseDate: purchase.createdAt,
        }))

        res.json({ success: true, enrolledStudents })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}