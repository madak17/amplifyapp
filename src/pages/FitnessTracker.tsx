import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listTrainingMaxExercises } from '../graphql/queries';
import { listWeeklyExercises } from '../graphql/queries';
import TrainingMaxWeightsTable from "../components/TrainingMaxFitnessTable";
import WeeklyFitnessTable from "../components/WeeklyFitnessTable";
import moment from "moment-timezone";
import '../assets/css/FitnessTracker.css';

type weeklyExercise = {
    id: string,
    dayOfWeek: string,
    dayOfWeekNum: number,
    name: string,
    exerciseNum: number,
    setNum: number,
    reps: string,
    weight: number,
    ratio: number,
    createdOn: Date,
    updatedOn: Date
}

type weeklyExercises = Array<weeklyExercise>

type trainingMaxWeight = {
    id: string,
    name: string,
    weight: number,
    createdOn: Date,
    updatedOn: Date
}

type trainingMaxWeights = Array<trainingMaxWeight>


function FitnessTracker() {
    const [trainingMaxList, setTrainingMaxList] = useState<trainingMaxWeights>([]);
    const [weeklyExerciseList, setWeeklyExerciseList] = useState<weeklyExercises>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentDayOfWeek = moment().format('dddd').toString();

    useEffect(() => {
        populateWeights();
    }, []);

    async function populateWeights() {
        const listTrainingMaxExercisesData: any = await API.graphql({ query: listTrainingMaxExercises })
        const trainingMaxWeights = listTrainingMaxExercisesData.data.listTrainingMaxExercises.items;

        setTrainingMaxList(trainingMaxWeights);

        const trainingMaxMap = new Map(trainingMaxWeights.map((x: { name: string; weight: number; }) => [x.name, x.weight] as [string, number]));

        const listWeeklyExercisesData: any = await API.graphql({ query: listWeeklyExercises })
        const weeklyExercises: weeklyExercises = listWeeklyExercisesData.data.listWeeklyExercises.items;

        let exerciseArray: weeklyExercises = []; 

        for(let weeklyExercise of weeklyExercises) {
            const newWeeklyExercise = {} as weeklyExercise;
            
            newWeeklyExercise.id = weeklyExercise.id;
            newWeeklyExercise.dayOfWeekNum = weeklyExercise.dayOfWeekNum;
            newWeeklyExercise.name = weeklyExercise.name;
            newWeeklyExercise.exerciseNum = weeklyExercise.exerciseNum;
            newWeeklyExercise.setNum = weeklyExercise.setNum;
            newWeeklyExercise.reps = weeklyExercise.reps;
            newWeeklyExercise.createdOn = weeklyExercise.createdOn;
            newWeeklyExercise.updatedOn = weeklyExercise.updatedOn;

            const trainingMaxWeight = trainingMaxMap.get(newWeeklyExercise.name) as number;
            newWeeklyExercise.weight = roundToNearestFive(weeklyExercise.ratio * trainingMaxWeight);

            switch(weeklyExercise.dayOfWeekNum) {
                case 1:
                    newWeeklyExercise.dayOfWeek = "Sunday";
                    break;
                case 2:
                    newWeeklyExercise.dayOfWeek = "Monday";
                    break;
                case 3:
                    newWeeklyExercise.dayOfWeek = "Tuesday";
                    break;
                case 4:
                    newWeeklyExercise.dayOfWeek = "Wednesday";
                    break;
                case 5:
                    newWeeklyExercise.dayOfWeek = "Thursday";
                    break;
                case 6:
                    newWeeklyExercise.dayOfWeek = "Friday";
                    break;
                case 7:
                    newWeeklyExercise.dayOfWeek = "Saturday";
                    break;
            }
            
            exerciseArray.push(newWeeklyExercise);
        }

        exerciseArray.sort(function(a, b) {
            return a.dayOfWeekNum - b.dayOfWeekNum || a.exerciseNum - b.exerciseNum || a.setNum - b.setNum;
        });

        setWeeklyExerciseList(exerciseArray);

        setIsLoaded(true);
    }

    function roundToNearestFive(value: number) {
        return Math.round(value / 5) * 5;
    }

    return (
        <div id="FitnessTracker">
            <h1>Fitness Tracker</h1>
            <div id="CurrentDayOfWeek">
                Current day of the week: {currentDayOfWeek}
            </div>
            {isLoaded && trainingMaxList !== null && weeklyExerciseList !== null ? (
                <div id="FitnessTrackerContainer">
                    <div id="LeftFitnessColumn">
                        <TrainingMaxWeightsTable trainingMaxExercises={trainingMaxList} />
                    </div>
                    <div id="RightFitnessColumn">
                        <WeeklyFitnessTable weeklyExercises={weeklyExerciseList} />
                    </div>
                </div>
            ) : (
                <div id="FitnessTrackerContainer">
                    <h3>Loading! Please wait...</h3>
                </div>
            )}
        </div>
    );
}

export default FitnessTracker;