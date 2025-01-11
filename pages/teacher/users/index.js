import TeacherLayout from "../../../layouts/teacher";
import { useRouter } from "next/router";
import { useFetch } from "../../../helpers/hooks";
import { deleteUser, fetchTeachers } from "../../../helpers/backend_helper";
import Link from "next/link";
import Table from "../../../components/common/table";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import SearchInput from "../../../components/form/search";
import moment from "moment";
import Button from "../../../components/form/Button";

const Users = () => {
    const router = useRouter()
    const [teachers, getTeachers] = useFetch(fetchTeachers)
    const columns = [
        {
            label: "Name",
            dataIndex: 'name',
            formatter: (_, { first_name, last_name }) => `${first_name || ''} ${last_name || ''}`
        },
        {
            label: "Email",
            dataIndex: 'email',
            formatter: d => <span className="text-blue-600" >{d}</span>
        },
        {
            label: "Role",
            dataIndex: 'permission',
            formatter: d => d?.name
        },
        {
            label: "Last Login",
            dataIndex: 'last_login',
            formatter: d => !!d ? (
                <>
                    <span className="text-sm font-medium text-blue-600">
                        {moment(d).format("ddd, MMM Do")}
                    </span>
                    <span className="mx-2 text-gray-800 font-semibold">At</span>


                    <span className="text-sm text-gray-500">
                        {moment(d)?.format('h:mm A')}
                    </span>
                </>
            ) : '-'
        }
    ]
    const [search, setSearch] = useState('')

    return (
        <div className="flex flex-col overflow-hidden h-full">

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-2">
                {/* Search Input */}
                <div className="w-full sm:w-auto">
                    <SearchInput value={search} setValue={setSearch} />
                </div>

                {/* Add Button */}
                <Link href="/teacher/users/create">
                    <Button>Add User</Button>
                </Link>
            </div>
            
            
            <Table
                data={teachers?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase()))}
                columns={columns}
                onEdit={({ _id }) => (
                    router.push('/teacher/users/' + _id)
                )}
                onDelete={deleteUser}
                getData={getTeachers}
            />
        </div>
    )
}
Users.layout = TeacherLayout
export default Users