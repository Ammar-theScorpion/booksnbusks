import StudentLayout from "../../../layouts/student";
import { useFetch } from "../../../helpers/hooks";
import { fetchQuizzes, fetchSubmissions } from "../../../helpers/backend_helper";
import Link from 'next/link'
import moment from "moment";
import { ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import Pagination from "../../../components/common/pagination";
import Button from '../../../components/form/Button.js';
import { Loading } from "../../../components/common/preloader.js";



const Quiz = () => {
    const [tab, setTab] = useState('due')
    const [quizzes, setQuizzes] = useFetch(fetchQuizzes, { date: moment().format('YYYY-MM-DD') })
    const [graded, getGraded] = useFetch(fetchSubmissions, { size: 4, graded: true })
    console.log("Graded:", graded);

    return (
        <>
            {/* add no quizes condition */}
            {/* add reload */}
            {quizzes ?
                <div className="flex bg-white p-6 rounded-lg shadow-md items-center mt-8 hover:shadow-xl transition-all mb-5">
                    <img className="h-20 w-20 object-contain" src="/images/hello.svg" alt="Welcome illustration" />
                    <div className="pl-4 md:pl-8">
                        {quizzes?.length === 0 ? (
                            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-0">
                                No quizzes available
                            </p>
                        ) : (
                            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-0">
                                You have {quizzes?.length === 1 ? "a new quiz" : `${quizzes?.length} new quizzes`} available
                            </p>
                        )}
                    </div>
                </div> : <div className="flex justify-center items-center" style={{ height: '50vh' }}>
                    <Loading />
                </div>}


            <ButtonGroup className="mt-3">
                <button
                    onClick={() => setTab('due')}
                    className={(tab === 'due' ? 'bg-gray-600' : 'bg-gray-400') + " text-white px-3 py-2 rounded-l"}>Due
                </button>
                <button onClick={() => setTab('graded')}
                    className={(tab === 'graded' ? 'bg-gray-600' : 'bg-gray-400') + " text-white px-3 py-2 rounded-r"}>Graded
                </button>
            </ButtonGroup>
            {tab === 'due' && (
                <div className="mt-3">
                    {quizzes?.map((quiz, index) => (
                        <div className="px-3 pt-3 pb-2 d-flex justify-content-between bg-white mb-3 rounded-lg"
                            key={index}>
                            <div>
                                <h2 className="font-weight-bold text-lg font-semibold">{quiz.title}</h2>

                                <div>
                                    <p className="mb-2">
                                        Class:
                                        {quiz?.classes?.map((data, index) => (
                                            <span key={index} className="tag-red ml-2">
                                                {`${index > 0 ? ', ' : ''}${data?.name}`}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="mb-3">
                                        Due:
                                        <span className="date-tag day ml-2">
                                            {moment(quiz.submission_end).format('ddd, MMM Do')}
                                        </span>
                                        at
                                        <span className="date-tag time ml-2">
                                            {moment(quiz.submission_end).format('hh:mm A')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {moment(quiz.submission_start).isSameOrBefore(moment()) ? (
                                    <Link href={'/student/quiz/' + quiz._id}>
                                        <Button>Take Quiz</Button>
                                    </Link>
                                ) : (
                                    <h5 className="text-end">Quiz will open on<br />{moment(quiz.submission_start).format('dddd, MMMM Do, hh:mm A')}</h5>
                                )}
                            </div>
                        </div>
                    ))}
                    {quizzes?.length === 0 && (
                        <div className="flex justify-center items-center py-6">
                            <h2 className="text-lg text-gray-500">Nothing Found</h2>
                        </div>
                    )}
                </div>
            )}
            {/*tab === 'completed' && (
            <div className="mt-3"> {completed?.docs?.map((sub, index) => (
                sub.quiz ? (
                <div className="px-3 pt-3 pb-2 d-flex justify-content-between bg-white mb-3 rounded-lg"
                key={index}>
                <div>
                    <h4 className="font-weight-bold text-lg font-semibold">{sub.quiz.title}</h4>
                    <p className="mb-2">{sub.quiz?.classes?.map((data, index) => `${index > 0 ? ', ' : ''}${data?.name}`)}</p>
                    <p className="mb-1 text-danger">Submitted: {moment(sub.date).format('dddd, MMMM Do, hh:mm A')}</p>
                </div>
                </div>
            ) : null
            ))}
                {completed?.docs?.length > 0 ? (
                <Pagination
                pageCount={completed?.totalPages || 1}
                page={completed?.page || 1}
                onPageChange={(page) => getCompleted(page)}
                />
                ) : (
                <h2 className="text-primary py-2">No Submissions found</h2>
                )}
                </div>
        )*/}
            {tab === 'graded' && (
                <div className="mt-6">
                    {graded?.docs?.map((sub, index) => (
                        <div
                            className="px-4 pt-4 pb-3 bg-white mb-4 rounded-md shadow-md transition-transform duration-300 transform "
                            key={index}
                        >
                            <div className="flex justify-between items-start">
                                {/* Title */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{sub.quiz?.title}</h2>

                                    <div className="mt-2">
                                        {/* Date info */}
                                        <p className="mb-3 text-gray-600">
                                            Submitted:
                                            <span className="ml-2 text-blue-600 font-semibold">
                                                {moment(sub.date).format('ddd, MMM Do')}
                                            </span>
                                            <span className="px-2">At</span>
                                            <span className="ml-2 text-blue-600 font-semibold">
                                                {moment(sub.date).format('hh:mm A')}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Percentage */}
                                <div className="text-center text-lg font-semibold">
                                    <h3
                                        className={`px-3 py-2 rounded-full ${sub.percentage !== null && sub.percentage !== undefined ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}
                                    >
                                        {sub.percentage !== null && sub.percentage !== undefined
                                            ? `${sub.percentage}%`
                                            : 'N/A'}
                                    </h3>
                                </div>
                            </div>

                            {/* Class info */}
                            <div className="mt-2">
                                <p className="mb-2 text-gray-600">
                                    Classes:

                                    {sub.quiz?.classes?.map((data, index) => (
                                        <span key={index} className="ml-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full">
                                            {`${index > 0 ? ', ' : ''}${data?.name}`}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {graded?.docs?.length !== 0 ? (
                        <Pagination
                            pageCount={graded?.totalPages || 1}
                            page={graded?.page || 1}
                            onPageChange={(page) => getGraded(page)}
                        />
                    ) : (
                        <div className="flex justify-center items-center py-6">
                            <h2 className="text-lg text-gray-500">No Submissions Found</h2>
                        </div>
                    )}
                </div>

            )}
        </>

    )
}
Quiz.layout = StudentLayout
export default Quiz