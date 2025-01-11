import TeacherLayout from "../../layouts/teacher";
import ModalForm from "../../components/common/modal_form";
import { Empty, Form } from "antd";
import { useMemo, useState } from "react";
import FormInput from "../../components/form/FormInput";
import { delTrait, fetchTraits, postTraitAdd, postTraitUpdate } from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import { checkPermission, useFetch } from "../../helpers/hooks";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import SearchInput from "../../components/form/search";
import Button from "../../components/form/Button";
import TableSkeleton from "../../fragment/skeleton/TableSkeleton";

const Virtues = () => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [traits, getTraits] = useFetch(fetchTraits, { size: 8 })

    const columns = [
        {
            label: 'Name',
            dataIndex: 'name',
        },
        { label: 'Points', dataIndex: 'points', shadow: true, className: "text-center" },
    ]
 

    const add = checkPermission('virtue_create')
    const router = useRouter()

    const [search, setSearch] = useState('')

    const data = useMemo(() => traits?.filter(d =>
        d?.name?.toLowerCase().includes(search.toLowerCase())).sort((a, b) =>
            a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        ), [traits, search]);

    if(!traits) {
        return <TableSkeleton columnCount={4} pagination={false} rowCount={10}/>
    }
    return (
        <>
            <ModalForm
                form={form}
                visible={visible}
                setVisible={setVisible}
                addFunc={async values => {
                    return postTraitAdd(values)
                }}
                updateFunc={async values => {
                    return postTraitUpdate(values)
                }}
                onFinish={getTraits}
                title="Trait">
                <FormInput name="name" label="Name" required />
                <FormInput name="points" label="Points" type="number" required />
            </ModalForm>
            {/*  h4 */}
            {/* <h4 className="page-title"> Virtues</h4> */}
            <div className="flex justify-between ">
                <SearchInput value={search} setValue={setSearch} />
                {add && (
                    <Button onClick={() => {
                        form.resetFields()
                        setVisible(true)
                    }}>Add Item
                    </Button>
                )}
            </div>
            {traits?.length ?
                <Table
                    data={data}
                    getData={getTraits}
                    columns={columns}
                    permission="virtue"
                    actionLabel="Actions"
                    action={(
                        <Button onClick={() => {
                            form.resetFields()
                            setVisible(true)
                        }}>Add Item
                        </Button>
                    )}
                    onEdit={(values) => {
                        form.resetFields()
                        form.setFieldsValue({
                            ...values,
                        })
                        setVisible(true)
                    }}
                    onDelete={delTrait}
                    searchString={search}
                />
                :
                <Empty />
            }

        </>
    )
}
Virtues.layout = TeacherLayout
export default Virtues