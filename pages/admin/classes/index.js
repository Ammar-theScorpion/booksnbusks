import AdminLayout from "../../../layouts/admin";
import Link from 'next/link'
import { checkPermission, useFetch } from "../../../helpers/hooks";
import { fetchClasses } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import moment from "moment";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import SearchInput from "../../../components/form/search";
import { useState } from "react";

const Classes = () => {
    const router = useRouter()
    const [classes, getClasses] = useFetch(fetchClasses)
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.name}</p>
                <p>{data?.section}</p>
            </>
        )
    }

    const timeFormat = (_, data) => {
        return (
            <>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </>
        )
    }

    const columns = [
        {
            label: "All Classes",
            dataIndex: 'name',
            formatter: nameFormat,
            className: "hover:bg-gray-100 cursor-pointer",
            onClick: data => router.push('/teacher/classes/' + data._id)
        },
        {
            label: "Time",
            dataIndex: 'name',
            formatter: timeFormat,
            className: 'text-center',
            shadow: true,
            maxWidth: 200,
        },
        {
            label: "Instructors",
            dataIndex: 'instructors',
            formatter: data => data?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).map((instructor, index) => `${index > 0 ? ', ' : ''}${instructor?.first_name} ${instructor?.last_name}`),
            className: 'text-center',
            maxWidth: 200,
        }
    ]

    const add = checkPermission('class_create')
    const [search, setSearch] = useState('')
    return (
        <>
            <div className="flex justify-between">
                <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Classes
                </h4>
                <div className="flex">
                    <SearchInput value={search} setValue={setSearch} />
                    {add && (
                        <Link href="/teacher/classes/create">
                            <a className="btn btn-primary">Add Class</a>
                        </Link>
                    )}

                </div>
            </div>
            <Table
                data={classes?.filter(d => d.name.toLowerCase()?.includes(search.toLowerCase())).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))}
                getData={getClasses}
                columns={columns}
                noAction
            />
            {/*<div className="pr-2">*/}
            {/*    {classes?.filter(d => d.name.toLowerCase()?.includes(search.toLowerCase())).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))?.map((d, index) => (*/}
            {/*        <ClassCard data={d} key={index}/>*/}
            {/*    ))}*/}
            {/*</div>*/}

        </>

    )
}

Classes.layout = AdminLayout
export default Classes


const ClassCard = ({ data }) => {
    return (
        <div className="bg-white p-8 rounded my-4">
            <h4 className="text-center">{data?.name}</h4>
            <p className="text-center mb-1">{data?.section}</p>
            <hr className="mt-1" />
            <div className="flex justify-between">
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </div>

        </div>
    )
}