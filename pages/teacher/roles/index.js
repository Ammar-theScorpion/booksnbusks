import TeacherLayout from "../../../layouts/teacher";
import Link from "next/link";
import { useAction, useFetch } from "../../../helpers/hooks";
import { delRole, fetchRoles, postRoleDefault } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import { useRouter } from "next/router";
import { Switch } from "antd";
import Button from "../../../components/form/Button";
import { useEffect, useState } from "react";

const Roles = () => {
    const router = useRouter()
    const [roles, getRoles] = useFetch(fetchRoles)
    const [isSwitchChanged, setSwitchChanged] = useState(false);

    const columns = [
        {
            label: "Role Name",
            dataIndex: 'name',
        },
        {
            label: "Description",
            dataIndex: 'description',
        },
        {
            label: "Default",
            dataIndex: 'default',
            formatter: (d, {_id}) => <Switch checked={d} disabled={d} onChange={() => useAction(postRoleDefault, {_id}, () => getRoles())}/>
        }
    ]

    useEffect(()=>{
        if(isSwitchChanged!==false){
            setSwitchChanged(false);
        }
    }, [isSwitchChanged]);

    return (
        <>
            <div className="flex justify-between">
                {/* <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Roles
                </h4> */}
                <div>
                    <Link href="/teacher/roles/create">
                        <Button>Create Role</Button>
                    </Link>
                </div>
            </div>
            <Table
                getData={getRoles}
                columns={columns}
                data={roles}
                onEdit={(value) => {
                    router.push('/teacher/roles/' + value._id)
                }}
                onDelete={delRole}
            />
        </>
    )
}
Roles.layout = TeacherLayout
export default Roles