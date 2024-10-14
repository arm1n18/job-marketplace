import { useState, useEffect } from 'react';
import axios from 'axios';
import { Job } from '../shared/Job/JobDetailsTypes';
import { Resume } from '../shared/Candidate/ResumeDetailsTypes';

interface Props {
    url: string;
    id?: number;
    setSelectedItem: (item: Resume | Job | null) => void;
}

const useFetchData = ({ url, id, setSelectedItem }: Props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`http://192.168.0.106:8080/${url}/${id}`);
                console.log("Fetched jobs:", response.data);
                setData(response.data);

                if(response.data.length > 0) {
                    setSelectedItem(response.data[0]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setLoading(false);
            }
        };

        
        fetchJobs();
    }, [id]);
}