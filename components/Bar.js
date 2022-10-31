import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from './ProgressProvider';
import { easeQuadInOut } from "d3-ease";

export default function Radial(props) {
	const { curValue, max } = props;
	let pbValue = curValue
	if (pbValue == 0) {
		pbValue = 0.01 * max;
	}
	return (
		<div className="w-fit m-auto">
			<ProgressProvider
				valueStart={0}
				valueEnd={pbValue}
			>
				{value => {
					return (
						<CircularProgressbar value={value} text={`${curValue} min`} maxValue={max} styles={buildStyles({
							pathColor: (curValue > max) ? '#F87171' : '#2563EB',
							textColor: (curValue > max) ? '#F87171' : '#2563EB',
							trailColor: (curValue > max) ? '#2563EB' : '#BFDBFE'
						})} />
					)
				}}

			</ProgressProvider>

		</div>
	)
}