import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PreviousButton = () => {
	const navigation = useNavigate();
	return (
		<Button variant='contained' onClick={() => navigation(-1)}>
			Previous
		</Button>
	);
};

export default PreviousButton;
