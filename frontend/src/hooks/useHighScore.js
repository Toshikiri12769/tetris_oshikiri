import { useState, useEffect } from 'react';

export default function useHighScore() {
    const [highscore, setHighScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchHigh = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/highscore');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (mounted) setHighScore(data.highscore ?? 0);
            } catch (err) {
                console.error('failed to fetch highscore:', err);
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchHigh();
        return () => { mounted = false; };
    }, []);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:3001/api/highscore');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setHighScore(data.highscore ?? 0);
            return true;
        } catch (err) {
            console.error('refresh highscore failed:', err);
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { highscore, loading, error, refresh };
}