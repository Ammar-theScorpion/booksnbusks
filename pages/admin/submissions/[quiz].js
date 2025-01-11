import AdminLayout from "../../../layouts/admin";
import { useRouter } from "next/router";
import { useActionConfirm, useFetch } from "../../../helpers/hooks";
import { fetchQuiz, fetchSubmissions, postQuiz, submitQuiz } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import moment from "moment";
import { useState } from "react";
import { Form } from "antd";
import FormInput from "../../../components/form/FormInput";

const Submissions = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [quiz, getQuiz] = useFetch(fetchQuiz, { _id: router.query.quiz })
    const [submissions, getSubmissions] = useFetch(fetchSubmissions, { quiz: router.query.quiz })
    const [submission, setSubmission] = useState()
    let columns = [
        { label: 'Student', dataIndex: 'student', formatter: data => <>{data?.first_name} {data?.last_name}</> },
        { label: 'Submission Time', dataIndex: 'date', formatter: data => moment(data).format('MMM, Do YYYY hh:mm A') },
        { label: 'Grade', dataIndex: 'grade' },
        {
            label: '',
            dataIndex: '_id',
            formatter: (_, data) => <a className="btn-primary rounded-lg" onClick={() => {
                form.setFieldsValue({
                    points: data?.points,
                    grade: data?.grade
                })
                setSubmission(data)
            }
            }>View</a>
        }
    ]

    const handleMarkUpdate = values => {
        return useActionConfirm(submitQuiz, { ...values, submission: submission._id }, () => {
            getSubmissions()
            setSubmission(undefined)
        }, 'Are you sure submit the result?', 'Yes, Submit')
    }


    if (submission) {
        return (
            <>
                <h4 className="page-title">Submission - {quiz?.title}</h4>
                <h5 className="mt-3">Student: {submission?.student?.first_name} {submission?.student?.last_name}</h5>
                <h5 className="mb-4">Submission Time: {moment(submission?.date).format('MMM, Do YYY hh:mm A')}</h5>
                <Form form={form} layout="vertical" onFinish={handleMarkUpdate}>
                    {quiz?.questions?.map((question, index) => (
                        <div key={index}>
                            <h6 className="font-bold">{index + 1}. {question.title}</h6>
                            {question?.type === 'single' && (
                                <ul className="pl-5 mt-2 mb-4">
                                    {question?.options?.map((option, index2) => (
                                        <li className="flex items-center mb-2" key={index2}>
                                            <input type="radio" name={'answer' + index} className="mr-2"
                                                checked={submission.answers[index] === index2} readOnly />
                                            <span
                                                className={"text-xl " + (+question.answer === index2 ? 'text-blue-700 font-bold' : 'font-medium')}>{option}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {question?.type === 'multiple' && (
                                <ul className="pl-5 mt-2 mb-4">
                                    {question?.options?.map((option, index2) => (
                                        <li className="flex items-center mb-2" key={index2}>
                                            <input type="checkbox" name={'answer' + index} className="mr-2"
                                                checked={submission.answers[index]?.includes(index2)} readOnly />
                                            <span className={"text-xl " + (+question.answer?.includes(index2) ? 'text-blue-700 font-bold' : 'font-medium')}>{option}</span>
                                        </li>
                                    ))}
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
                            <div className="w-36 flex items-center mb-4">
                                <h6>Points: </h6>
                                <Form.Item name={['points', index]} className="mb-2"
                                    initialValue={isSameAnswer(question?.answer, submission.answers[index]) ? question?.points : 0}>
                                    <input type="number" className="form-control text-center ml-2" />
                                </Form.Item>
                            </div>
                        </div>
                    ))}
                    <div>
                        <h4>Result</h4>
                        <Form.Item shouldUpdate>
                            {() => {
                                return <h5>Total
                                    Points: {form.getFieldValue('points')?.reduce((t, d) => +t + (+d || 0), 0)}</h5>
                            }}
                        </Form.Item>
                        <div className="w-44">
                            <FormInput name="grade" label="Grade" placeholder="Eg. A+, A, A-, B+" required />
                        </div>
                        <button className="btn-primary mt-2 rounded-lg mr-3">Save</button>
                        <button className="btn-primary mt-2 rounded-lg" type="button"
                            onClick={() => setSubmission(undefined)}>Cancel
                        </button>
                    </div>
                </Form>
            </>
        )
    }

    return (
        <>
            <h4 className="page-title">Submissions - {quiz?.title}</h4>
            <Table columns={columns} data={submissions} noAction />
        </>
    )
}
Submissions.layout = AdminLayout
export default Submissions


const isSameAnswer = (answer1, answer2) => {
    if (!answer1) {
        return true
    }
    if (Array.isArray(answer1) && Array.isArray(answer2)) {
        return JSON.stringify(answer1.sort()) === JSON.stringify(answer2.sort())
    }
    return answer1 === answer2
}