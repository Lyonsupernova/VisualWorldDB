import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import testVideo0 from '../../../data/video_00000-01000/video_01000.mp4';
import testVideo1 from '../../../data/video_00000-01000/video_01001.mp4';
import testVideo2 from '../../../data/video_00000-01000/video_01002.mp4';
import testVideo3 from '../../../data/video_00000-01000/video_01003.mp4';
import testVideo4 from '../../../data/video_00000-01000/video_01004.mp4';
import testVideo5 from '../../../data/video_00000-01000/video_01005.mp4';
import testVideo6 from '../../../data/video_00000-01000/video_01006.mp4';
import testVideo7 from '../../../data/video_00000-01000/video_01007.mp4';
import testVideo8 from '../../../data/video_00000-01000/video_01008.mp4';
import testVideo9 from '../../../data/video_00000-01000/video_01009.mp4';
import { Player } from 'video-react';
import { Box } from '@mui/system';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const testVideos = [
        testVideo0,
        testVideo1,
        testVideo2,
        testVideo3,
        testVideo4,
        testVideo5,
        testVideo6,
        testVideo7,
        testVideo8,
        testVideo9
    ];

    const videoGrid = (
        <Grid container>
            {testVideos.map((video) => (
                <Box>
                    <Player>
                        <source src={video} />
                    </Player>
                </Box>
            ))}
        </Grid>
    );

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                Hello world
                {videoGrid}
            </Grid>
        </Grid>
    );
};

export default Dashboard;
