import ModalForm from "../../components/common/modal_form";
import { Form } from "antd";
import { useState } from "react";
import FormInput from "../../components/form/FormInput";
import { delTrait, fetchTraits, postTraitAdd, postTraitUpdate } from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import { checkPermission, useFetch } from "../../helpers/hooks";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import SearchInput from "../../components/form/search";
import AdminLayout from "../../layouts/admin";

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
    let sort = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    const add = checkPermission('virtue_create')
    const router = useRouter()

    const [search, setSearch] = useState('')

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
            <div className="flex justify-between">
                {/* <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button"
                                                        onClick={() => router.back()}/> Virtues</h4> */}
                <div className="flex">
                    <SearchInput value={search} setValue={setSearch} />
                    {add && (
                        <button className="btn-primary font-semibold rounded-lg w-36" onClick={() => {
                            form.resetFields()
                            setVisible(true)
                        }}>Add Item
                        </button>
                    )}
                </div>

            </div>
            <Table
                data={traits?.filter(d => d?.name?.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.name?.toLowerCase().localeCompare(b.name?.toLowerCase()))}
                getData={getTraits}
                columns={columns}
                permission="virtue"
                action={(
                    <button className="add-button w-36" onClick={() => {
                        form.resetFields()
                        setVisible(true)
                    }}>Add Item
                    </button>
                )}
                onEdit={(values) => {
                    form.resetFields()
                    form.setFieldsValue({
                        ...values,
                    })
                    setVisible(true)
                }}
                onDelete={delTrait}
            />
        </>
    )
}
Virtues.layout = AdminLayout
export default Virtues