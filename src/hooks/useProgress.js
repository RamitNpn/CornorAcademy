import { useState, useCallback } from 'react';
import api from '../api/axios';
export const useProgress = (courseId) => {
    const [completedLessons, setCompleted] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const fetchProgress = useCallback(async () => {
        const { data } = await api.get(`/progress/${courseId}`);
        setCompleted(data.completedLessons.map(l => l._id || l));
        setPercentage(data.percentage);
    }, [courseId]);
    const markComplete = async (lessonId) => {
        const { data } = await api.post('/progress/complete', { courseId, lessonId });
        setCompleted(prev => [...new Set([...prev, lessonId])]);
        setPercentage(data.percentage);
        if (data.percentage === 100) {
            // Certificate generated server-side, notify user
            toast.success('Congratulations! Certificate sent to your email!');
        }
    };
    return { completedLessons, percentage, fetchProgress, markComplete };
};