import TeacherLayout from "../../../layouts/teacher";
import { useRouter } from "next/router";
import { useActionConfirm, useFetch } from "../../../helpers/hooks";
import { fetchQuiz, fetchSubmissions, postQuiz, submitQuiz } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import moment from "moment";
import { useState, useMemo } from "react";
import { Form } from "antd";
import FormInput from "../../../components/form/FormInput";
import Button from "../../../components/form/Button";
import { FiArrowLeft } from "react-icons/fi";




const Submissions = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [quiz, getQuiz] = useFetch(fetchQuiz, { _id: router.query.quiz })
    const [submissions, getSubmissions] = useFetch(fetchSubmissions, { quiz: router.query.quiz })
    const [submission, setSubmission] = useState();
    const [sumErrorMessage, setSumErrorMessage] = useState(null);

    //need to add standardized points to award to students
    let columns = [
        { label: 'Student', dataIndex: 'student', formatter: data => <>{data?.first_name} {data?.last_name}</> },
        {
            label: 'Submission Time',
            dataIndex: 'date',
            formatter: data => (
                <>
                    {/* enhance date format  */}
                    <span className="inline-flex text-sm font-medium text-blue-600  px-2 whitespace-nowrap ">
                        {moment(data).format("ddd, MMM Do")}
                    </span>
                    <span className="mr-2 text-gray-800 font-bold ">At</span>


                    <span className="text-sm font-medium  text-blue-600   whitespace-nowrap">
                        {moment(data)?.format('h:mm A')}
                    </span>   </>
            )
        },
        {
            label: 'Percentage',
            dataIndex: 'percentage',
            formatter: (_, data) =>
                <span className="tag-white">{data.percentage}%</span>
        },
        {
            label: '', dataIndex: '_id', formatter: (_, data) => <Button onClick={() => {
                form.setFieldsValue({
                    points: data?.points,
                    percentage: data?.percentage,
                })
                setSubmission(data)
            }}>View</Button>
        }
    ]

    // calculates total points given the points in the quiz
    const totalQuizPoints = useMemo(() => {
        return quiz?.questions?.reduce((total, question) => total + question.points, 0);
    }, [quiz]);
    console.log(totalQuizPoints)


    // calculates %
    const percentage = form.getFieldValue('points') / totalQuizPoints * 100 + '%';

    const validateSumOfPoints = (values) => {
        let sumOfPoints = values.question_points.reduce((t, d) => +t + (+d || 0), 0);
        if (sumOfPoints > totalQuizPoints) {
            setSumErrorMessage(`Sum of question points cannot exceed ${totalQuizPoints}`);
            return false;
        } else
            setSumErrorMessage(null);
        return true;
    };



    const handleMarkUpdate = values => {
        if (!validateSumOfPoints(values)) return; // Check sum of question points
        if (sumErrorMessage) return; // Don't proceed if there's an error message

        // Instead of calculating totalPoints, percentage, and grade,
        // You can get the values from the updatedSubmission
        //const {points, grade} = updatedSubmission;
        return useActionConfirm(submitQuiz,
            { ...values, submission: submission._id }, () => {
                getSubmissions()
                setSubmission(undefined)
            }, 'Are you sure you want to save these changes?', 'Yes')
    };


    if (submission) {
        return (
            <>
                <h4 className="page-title"> <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> {submission?.student?.first_name} {submission?.student?.last_name}'s Submission</h4>
                <h6 className="mb-4">
                    Submission Time:

                    <span className="date-tag day ml-2">
                        {moment(submission?.date).format('MMM, DD YYYY')}
                    </span>
                    <span className="date-tag time">
                        {moment(submission?.date).format('hh:mm A')}
                    </span>
                </h6>


                <Form form={form} layout="vertical" onFinish={handleMarkUpdate}>
                    {quiz?.questions?.map((question, index) => (
                        <div key={index}>

                            <span style={{ fontSize: '1.2rem' }}>{index + 1}.   {question.title}</span>

                            {question?.type === 'single' && (
                                <ul className="pl-5 mt-2 mb-4">
                                    {question?.options?.map((option, index2) => (
                                        <li className="flex items-center mb-2" key={index2}>
                                            <input type="radio" name={'answer' + index} className="mr-2" checked={submission.answers[index] === index2} readOnly />
                                            <span className={"text-xl " + (+question.answer === index2 ? 'text-blue-700 font-bold' : 'font-medium')}>{option}</span>
                                        </li>))}
                                </ul>
                            )}
                            {question?.type === 'multiple' && (
                                <ul className="pl-5 mt-2 mb-4">
                                    {question?.options?.map((option, index2) => (
                                        <li className="flex items-center mb-2" key={index2}>
                                            <input type="checkbox" name={'answer' + index} className="mr-2" checked={submission.answers[index]?.includes(index2)} readOnly />
                                            <span className={"text-xl " + (+question.answer?.includes(index2) ? 'text-blue-700 font-bold' : 'font-medium')}>{option}</span>
                                        </li>))}
                                </ul>
                            )}
                            {question?.type === 'paragraph' && (
                                <div>
                                    <p className="text-sm text-primary mb-2">Min Words: {question.min}, Max
                                        Words: {question.max}</p>
                                    <p className="mb-2">Answer:
                                        ({submission.answers[index]?.split(" ").length} Words)</p>
                                    <div className="border p-2.5 rounded mb-4">{submission.answers[index]}</div>
                                </div>
                            )}
                            {question?.type === 'short_answer' && (
                                <div>
                                    <p className="mb-2">Answer:</p>
                                    <div className="border p-2.5 rounded mb-4">{submission.answers[index]}</div>
                                </div>
                            )}
                            <div className="flex items-center mb-4">
                                <span className="tag-green">Points: </span>
                                <Form.Item
                                    name={['question_points', index]}
                                    className="mb-2"
                                    initialValue={question?.type === 'multiple' ? calculatePartialPoints(question?.answer, submission.answers[index], question?.points) : isSameAnswer(question?.answer, submission.answers[index]) ? question?.points : 0}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (value < 0) {
                                                    return Promise.reject('Cannot award a negative number of points');
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <input
                                        type="number"
                                        className="form-control text-center ml-2"
                                        onWheel={(e) => {
                                            e.currentTarget.blur(); // Remove focus from the input to prevent scrolling
                                            e.preventDefault();
                                        }}
                                        onFocus={(e) => e.currentTarget.select()} // Select the text on focus for easy typing
                                        style={{ pointerEvents: 'auto' }} // Enable pointer events
                                    />
                                </Form.Item>

                            </div>
                        </div>
                    ))}
                    <div>
                        <Form.Item shouldUpdate>
                            {() => {
                                let sumOfPoints = form.getFieldValue('question_points')?.reduce((t, d) => +t + (+d || 0), 0);
                                let percentage = Math.floor(sumOfPoints / totalQuizPoints * 100);

                                if (percentage < 0 || percentage > 100) {
                                    setSumErrorMessage(`Percentage must be between 0% and 100%. Currently, it's ${percentage}%`);
                                } else {
                                    setSumErrorMessage(null);
                                }

                                return (
                                    <>
                                        <span className="tag-white" style={{ fontSize: '1rem', marginBottom: '3px' }}>
                                            Score: {sumOfPoints} / {totalQuizPoints}
                                        </span>
                                        <br></br>
                                        <span className="tag-white" style={{ fontSize: '1rem', marginTop: '3px' }}>
                                            Percentage: {percentage}%
                                        </span>

                                        {sumErrorMessage && <p className="text-red-500">{sumErrorMessage}</p>}
                                    </>
                                );
                            }}
                        </Form.Item>
                        <Button type="submit">Save</Button>

                        <Button onClick={() => setSubmission(undefined)}>Cancel</Button>
                    </div>
                </Form>
            </>
        )
    }
    return (
        <>
            <div>
                <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} />{quiz?.title} Submissions</h4>
            </div>

            <Table columns={columns} data={submissions} noAction />
        </>
    )
}
Submissions.layout = TeacherLayout
export default Submissions



// It calculates the partial points for multiple choice questions
const calculatePartialPoints = (correctAnswers, studentAnswers, questionPoints) => {
    // The points for each correct option
    const pointsPerOption = questionPoints / correctAnswers.length;
    // The number of correct answers given by the student
    let correctCount = 0;
    studentAnswers.forEach(answer => {
        if (correctAnswers.includes(answer)) {
            correctCount++;
        }
    });

    // The total points earned by the student for this question
    return pointsPerOption * correctCount;
};


const isSameAnswer = (answer1, answer2) => {
    if (!answer1) {
        return true
    }
    if (Array.isArray(answer1) && Array.isArray(answer2)) {
        return JSON.stringify(answer1.sort()) === JSON.stringify(answer2.sort())
    }
    return answer1 === answer2
}