import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { emailService } from '../services/email.service';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export const Dashboard = () => {
    const emailStats = emailService.getStats()
    const data = {
        labels: Object.keys(emailStats),
        datasets: [
            {
                label: 'Total Emails',
                data: Object.values(emailStats).map(stat => stat.total),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Unread Emails',
                data: Object.values(emailStats).map(stat => stat.unread),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    return <Bar data={data} />;
};
