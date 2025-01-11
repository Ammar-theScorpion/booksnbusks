import TeacherLayout from "../../../layouts/teacher";
import Link from "next/link";
import { useFetch } from "../../../helpers/hooks";
import { fetchQuizzes, delQuiz } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import { useRouter } from "next/router";
import moment from "moment";
import { FiArrowLeft } from "react-icons/fi";
import Button from "../../../components/form/Button";
import { FaEye } from "react-icons/fa";


const Quiz = () => {
    const router = useRouter()
    const [quizzes, getQuizzes, { loading }] = useFetch(fetchQuizzes, { size: 6 })
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.title}</p>
                <p>{data?.course}</p>
            </>
        )
    }


    let columns = [
        { label: 'Title', dataIndex: 'title', formatter: nameFormat, minWidth: 150, className: "hover:bg-gray-100 cursor-pointer", onClick: data => router.push('/teacher/quiz/' + data._id) },

        {
            label: 'Assigned to',
            dataIndex: 'classes',
            formatter: data => (
                <>
                    {data?.map((item, index) => (
                        <span key={index} className="tag-white">
                            {item?.name}
                        </span>
                    ))}
                </>
            )
        },
        {
            label: 'Active',
            dataIndex: 'submission_date',
            formatter: (_, data) => (
                <>
                    <div className="flex items-center space-x-2 text-gray-700  p-4 ">
                        <span className="text-sm font-medium text-blue-600">
                            {moment(data.submission_start)?.format('MMM, Do')}
                        </span>
                        <span className="text-sm text-gray-500">
                            {moment(data.submission_start)?.format('h:mm A')}
                        </span>
                        <span className="mx-2 text-gray-800 font-semibold">To</span>
                        <span className="text-sm font-medium text-blue-600">
                            {moment(data.submission_end)?.format('MMM, Do')}
                        </span>
                        <span className="text-sm text-gray-500">
                            {moment(data.submission_end)?.format('h:mm A')}
                        </span>
                    </div>
                </>
            )
        },
        {
            label: 'View',
            dataIndex: '_id',
            formatter: data => (
                <Link href={'/teacher/submissions/' + data}>
                    <FaEye />
                </Link>
            )
        }, ,
        //{label: 'Delete', dataIndex: '_id', onClick: data => delQuiz(data._id), className: "btn-primary rounded-lg"}
    ]

    return (
        <>
            <div className="flex justify-between">
                {/* yacoob remove back */}
                {/* <div>
                    <h4 className="page-title"> <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Quiz List</h4>
                </div> */}
                <div>
                    <Link href="/teacher/quiz/create">
                        <Button>Create Quiz</Button>
                    </Link>
                </div>
            </div>
            <Table
                getData={getQuizzes}
                columns={columns}
                data={quizzes}
                loading={loading}
                pagination
                onDelete={delQuiz}
                actionLabel={<span>Delete</span>}
            />
        </>
    )
}
Quiz.layout = TeacherLayout
export default Quiz