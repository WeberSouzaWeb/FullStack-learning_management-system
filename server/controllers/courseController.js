import Course from '../models/Course.js';

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select(['-courseContent', '-enrolledStudent']).populate({ path: 'educator', select: 'name imageUrl' });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get Course by ID
export const getCourseId = async (req, res) => {

    const { id } = req.params.id;
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator', select: 'name imageUrl' });

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = undefined; // Remove lectureUrl for non-preview lectures
                }
            });
        });
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};